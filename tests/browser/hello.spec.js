import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const files = {
  pages: 'frontends/pages/pages/hello-world.py',
  'pages-js': 'frontends/pages-js/recipe.js',
  react: 'frontends/react/src/App.jsx',
  vue: 'frontends/vue/src/App.vue',
  nicegui: 'frontends/nicegui/page.py',
};

for (const [variant, file] of Object.entries(files)) {
  test(`${variant}: live Hello World, actual CodeMirror source and responsive layout`, async ({page}) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${variant}/`);
    await expect(page.getByRole('navigation', {name: 'Implementations'}).getByRole('link')).toHaveCount(5);
    const preview = page.frameLocator('.example-panel iframe');
    const source = page.frameLocator('.source-frame-panel iframe');
    await expect(page.locator('.example-panel h2')).toContainText(variant === 'pages-js' ? 'Live example' : 'Example');
    await expect(page.locator('.lab-introduction')).toHaveCount(0);
    await expect(preview.locator('h1')).toHaveText('Hello World');
    await expect(preview.locator('input')).toHaveCount(0);
    await expect(source.locator('.cm-editor')).toBeVisible();
    await expect(source.locator('#source-code')).toHaveText(readFileSync(file, 'utf8'));
    await expect(source.locator('.cm-content')).toHaveAttribute('contenteditable', variant === 'pages-js' ? 'true' : 'false');
    await expect(source.getByRole('button', {name: 'Run', exact: true})).toHaveCount(variant === 'pages-js' ? 1 : 0);
    const raw = await page.request.get(`/sources/${variant}?raw=true`);
    expect(await raw.text()).toBe(readFileSync(file, 'utf8'));
    const liveBox = await page.locator('.example-panel').boundingBox();
    const codeBox = await page.locator('.source-frame-panel').boundingBox();
    expect(codeBox.x).toBeGreaterThan(liveBox.x);
    await expect(source.getByRole('link', {name: 'Boilerplate', exact: true})).toHaveCount(0);
    await expect(source.getByRole('link', {name: 'Common', exact: true})).toHaveCount(0);
    await page.setViewportSize({width: 390, height: 844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const mobileLive = await page.locator('.example-panel').boundingBox();
    const mobileCode = await page.locator('.source-frame-panel').boundingBox();
    expect(mobileCode.y).toBeGreaterThanOrEqual(mobileLive.y + mobileLive.height);
    await expect(preview.locator('h1')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('Gramlot JS Run, errors, Reset and reload preserve the recipe contract', async ({page}) => {
  await page.goto('/pages-js/');
  const source = page.frameLocator('.source-frame-panel iframe');
  const preview = page.frameLocator('.example-panel iframe');
  await expect(preview.locator('h1')).toHaveText('Hello World');
  const editor = source.locator('.cm-content');
  await editor.fill("root.h1('Hello Rosetta');");
  await expect(preview.locator('h1')).toHaveText('Hello World');
  await source.getByRole('button', {name: 'Run', exact: true}).click();
  await expect(preview.locator('h1')).toHaveText('Hello Rosetta');
  for (const code of ["root.h1(", "throw new Error('Deliberate failure');"]) {
    await editor.fill(code);
    await source.getByRole('button', {name: 'Run', exact: true}).click();
    await expect(source.getByRole('status')).toContainText('Error:');
    await expect(preview.locator('h1')).toHaveText('Hello Rosetta');
  }
  await source.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(preview.locator('h1')).toHaveText('Hello World');
  await expect(editor).toHaveText("root.h1('Hello World');");
  await editor.fill("root.h1('Temporary');");
  await source.getByRole('button', {name: 'Run', exact: true}).click();
  await expect(preview.locator('h1')).toHaveText('Temporary');
  await page.reload();
  await expect(preview.locator('h1')).toHaveText('Hello World');
});

test('NiceGUI establishes its native browser connection', async ({page}) => {
  const connected = page.waitForEvent('websocket', socket => socket.url().includes('socket.io'));
  await page.goto('/nicegui/');
  await connected;
  await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
});

test('later lessons are absent from all frame and example routes', async ({request}) => {
  for (const variant of Object.keys(files)) {
    for (const prefix of ['', '/examples']) {
      expect((await request.get(`${prefix}/${variant}/editable-text/`)).status()).toBe(404);
    }
  }
});


test('master tree separates overview setup from lesson code', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/overview/);
  const tree = page.getByRole('navigation', {name: 'Groups and lessons'});
  await expect(tree.getByText('Overview', {exact: true})).toBeVisible();
  await expect(tree.getByText('Simple examples', {exact: true})).toBeVisible();
  await expect(tree.getByRole('link', {name: 'Hello World', exact: true})).toHaveCount(1);
  for (const title of ['Gramlot Python', 'Gramlot JS', 'React', 'Vue', 'NiceGUI', 'Shared infrastructure']) {
    await tree.getByRole('link', {name: title, exact: true}).click();
    const setup = page.frameLocator('.overview-source iframe');
    await expect(setup.locator('.cm-content')).toHaveAttribute('contenteditable', 'false');
    await expect(setup.getByRole('button', {name: 'Run', exact: true})).toHaveCount(0);
    await expect(page.locator('.example-panel')).toHaveCount(0);
  }
  await tree.getByRole('link', {name: 'Hello World', exact: true}).click();
  await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
  await expect(page.frameLocator('.source-frame-panel iframe').getByRole('navigation', {name: 'Source sections'})).toHaveCount(0);
});

test('splitters resize with pointer and keyboard and retain widths', async ({page}) => {
  await page.goto('/pages-js/');
  const tree = page.locator('.lesson-tree');
  const divider = page.getByRole('separator', {name: 'Resize navigation', exact: true});
  const before = await tree.boundingBox();
  await divider.focus();
  await divider.press('ArrowRight');
  expect((await tree.boundingBox()).width).toBeGreaterThan(before.width);
  const live = page.locator('.example-panel');
  const liveBefore = await live.boundingBox();
  const split = page.getByRole('separator', {name: 'Resize example and code'});
  const box = await split.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 70);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 65, box.y + 70);
  await page.mouse.up();
  const changed = (await live.boundingBox()).width;
  expect(changed).toBeGreaterThan(liveBefore.width + 40);
  await expect(page.locator('body')).not.toHaveClass(/resizing/);
  await page.reload();
  expect((await live.boundingBox()).width).toBeCloseTo(changed, 0);
  await expect(page.getByRole('link', {name: /Open source/})).toHaveCount(0);
  await expect(page.frameLocator('.source-frame-panel iframe').getByRole('link', {name: /Open raw/})).toHaveCount(0);
});

for (const variant of ['pages', 'pages-js']) {
  test(`${variant}: discreet external inspector opens the live instance`, async ({page}) => {
    await page.goto(`/${variant}/`);
    const preview = page.frameLocator('.example-panel iframe');
    await expect(preview.locator('h1')).toHaveText('Hello World');
    await expect(preview.locator('.gramlot-inspector-launcher')).toBeHidden();
    const launcher = page.getByRole('button', {name: 'Open inspector', exact: true});
    await expect(launcher).toHaveText('🔍 Open inspector');
    const buttonBox = await launcher.boundingBox();
    const frameBox = await page.locator('.example-panel iframe').boundingBox();
    expect(buttonBox.y).toBeGreaterThanOrEqual(frameBox.y + frameBox.height);
    await expect(page.locator('.rosetta-layout .inspector-tool')).toHaveCount(0);
    const panelBox = await page.locator('.rosetta-layout').boundingBox();
    expect(buttonBox.y).toBeGreaterThanOrEqual(panelBox.y + panelBox.height);
    const sourceBox = await page.locator('.source-frame-panel').boundingBox();
    const sourceFrameBox = await page.locator('.source-frame-panel iframe').boundingBox();
    expect(Math.abs(sourceBox.y + sourceBox.height - sourceFrameBox.y - sourceFrameBox.height)).toBeLessThan(2);
    await launcher.click();
    await expect(page.locator('body > gramlot-inspector')).toHaveCount(1);
    await expect(page.getByRole('button', {name: 'Close palette', exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Close palette', exact: true}).click();
    await expect(page.getByRole('button', {name: 'Close palette', exact: true})).toBeHidden();
  });
}

test('master inspector can move beyond the example and follows JS replacement', async ({page}) => {
  await page.goto('/pages-js/');
  const source = page.frameLocator('.source-frame-panel iframe');
  const preview = page.frameLocator('.example-panel iframe');
  await expect(preview.locator('h1')).toHaveText('Hello World');
  await page.getByRole('button', {name: 'Open inspector', exact: true}).click();
  const palette = page.locator('body > gramlot-inspector').locator('gnr-palette');
  await expect(palette).toBeVisible();
  expect(await page.locator('body > gramlot-inspector').evaluate(element =>
    element.application.target.root.ownerDocument === document.querySelector('.example-panel iframe').contentDocument
  )).toBe(true);
  const handle = page.getByLabel('Move palette with arrow keys', {exact: true});
  const start = await handle.boundingBox();
  await page.mouse.move(start.x + 100, start.y + 10);
  await page.mouse.down();
  await page.mouse.move(900, 20, {steps: 10});
  await page.mouse.up();
  const moved = await palette.boundingBox();
  const frame = await page.locator('.example-panel iframe').boundingBox();
  expect(moved.x).toBeGreaterThan(frame.x + frame.width);
  expect(moved.y).toBeLessThan(frame.y);
  await source.locator('.cm-content').fill("root.h1('New instance');");
  await source.getByRole('button', {name: 'Run', exact: true}).press('Enter');
  await expect(preview.locator('h1')).toHaveText('New instance');
  await expect(page.locator('body > gramlot-inspector')).toHaveCount(0);
  await page.getByRole('button', {name: 'Open inspector', exact: true}).click();
  await expect(palette).toBeVisible();
  await source.getByRole('button', {name: 'Reset', exact: true}).press('Enter');
  await expect(page.locator('body > gramlot-inspector')).toHaveCount(0);
  await expect(preview.locator('h1')).toHaveText('Hello World');
});

test('master inspector splitter resizes the tree and uses compact styling', async ({page}) => {
  await page.goto('/pages-js/');
  await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
  await page.getByRole('button', {name: 'Open inspector', exact: true}).click();
  const inspector = page.locator('body > gramlot-inspector');
  const handle = inspector.locator('.handle:visible');
  await expect(handle).toHaveCount(1);
  const properties = inspector.locator('.inspector-properties:visible');
  const before = await properties.boundingBox();
  const bar = await handle.boundingBox();
  await page.mouse.move(bar.x + bar.width / 2, bar.y + bar.height / 2);
  await page.mouse.down();
  await page.mouse.move(bar.x + bar.width / 2, bar.y + 55, {steps: 5});
  await page.mouse.up();
  const after = await properties.boundingBox();
  expect(after.y).toBeGreaterThan(before.y + 35);
  expect(after.height).toBeLessThan(before.height - 35);
  await expect(inspector.locator('.inspector-path:visible')).toHaveCSS('font-style', 'italic');
  await expect(inspector.locator('.inspector-footer:visible')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(inspector.locator('gnr-palette')).toHaveCSS('border-radius', '9px');
});

test('compact inspector collapses to a draggable title bar and restores its size', async ({page}) => {
  await page.goto('/pages-js/');
  await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
  await page.getByRole('button', {name: 'Open inspector', exact: true}).click();
  const inspector = page.locator('body > gramlot-inspector');
  const palette = inspector.locator('gnr-palette');
  await expect(palette).toBeVisible();
  const original = await palette.boundingBox();
  await expect(palette.locator('.bar')).toHaveCSS('height', '24px');
  await expect(palette.locator('.title')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(inspector.locator('.tab.active')).toHaveCSS('font-size', '11px');
  await page.getByRole('button', {name: 'Collapse palette', exact: true}).click();
  expect((await palette.boundingBox()).height).toBeLessThan(30);
  await expect(inspector.locator('.inspector-properties:visible')).toHaveCount(0);
  const handle = page.getByLabel('Move palette with arrow keys', {exact: true});
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + 100, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + 180, box.y + 70, {steps: 5});
  await page.mouse.up();
  const moved = await palette.boundingBox();
  expect(moved.x).toBeGreaterThan(original.x + 50);
  await page.getByRole('button', {name: 'Restore palette', exact: true}).click();
  const restored = await palette.boundingBox();
  expect(restored.height).toBeCloseTo(original.height, 0);
  expect(restored.width).toBeCloseTo(original.width, 0);
  expect(restored.x).toBeCloseTo(moved.x, 0);
});
