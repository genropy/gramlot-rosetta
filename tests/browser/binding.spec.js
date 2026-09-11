import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const files = {
  pages: 'frontends/pages/pages/data-binding.py',
  'pages-js': 'frontends/pages-js/data-binding.js',
  react: 'frontends/react/src/DataBinding.jsx',
  vue: 'frontends/vue/src/DataBinding.vue',
  nicegui: 'frontends/nicegui/data_binding.py',
};
for (const [variant, file] of Object.entries(files)) {
  test(`${variant}: live and focus-out pairs update independently`, async ({page}) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${variant}/data-binding/`);
    await expect(page.locator('.lesson-intro')).toContainText('Lesson 02');
    await expect(page.getByRole('navigation', {name:'Groups and lessons'}).getByRole('link',{name:'Data binding',exact:true})).toHaveAttribute('aria-current','page');
    const preview = page.frameLocator('.example-panel iframe');
    if (variant === 'nicegui') {
      await expect.poll(() => preview.locator('body').evaluate(() => Boolean(window.did_handshake))).toBe(true);
    }
    const input = preview.getByRole('textbox',{name:'On focus out',exact:true});
    await expect(input).toHaveValue('Hello World');
    const liveInput = preview.getByRole('textbox',{name:'Live',exact:true});
    const liveHeading = preview.locator('h1').nth(0);
    const heading = preview.locator('h1').nth(1);
    await expect(liveHeading).toHaveText('Hello World');
    await expect(heading).toHaveText('Hello World');
    for (const text of ['Live version', '<b>Live text</b>', '']) {
      await liveInput.fill(text);
      await expect(liveHeading).toHaveText(text);
      await expect(heading).toHaveText('Hello World');
      await expect(input).toHaveValue('Hello World');
    }
    let previous = 'Hello World';
    for (const text of ['Hello Rosetta', '<b>Plain text</b>', '']) {
      await input.fill(text);
      await expect(heading).toHaveText(previous);
      await input.press('Tab');
      previous = text;
      await expect(heading).toHaveText(text);
      await expect(liveHeading).toHaveText('');
      await expect(preview.locator('h1 b')).toHaveCount(0);
    }
    const source = page.frameLocator('.source-frame-panel iframe');
    await expect(source.locator('#source-code')).toHaveText(readFileSync(file, 'utf8'));
    await expect(source.locator('.cm-content')).toHaveAttribute('contenteditable',variant === 'pages-js' ? 'true':'false');
    if (variant === 'pages-js') {
      await source.locator('.cm-content').fill(readFileSync(file,'utf8').replaceAll('Hello World','My version'));
      await source.getByRole('button',{name:'Run',exact:true}).click();
      await expect(input).toHaveValue('My version');
      await expect(liveInput).toHaveValue('My version');
      await expect(liveHeading).toHaveText('My version');
      await expect(heading).toHaveText('My version');
      await source.getByRole('button',{name:'Reset',exact:true}).click();
      await expect(input).toHaveValue('Hello World');
    }
    await page.reload();
    await expect(input).toHaveValue('Hello World');
    expect(errors).toEqual([]);
  });
}
