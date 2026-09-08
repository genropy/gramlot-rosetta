import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const files = {
  react: 'frontends/react/src/App.jsx',
  vue: 'frontends/vue/src/App.vue',
  pages: 'frontends/pages/recipe.py',
};

for (const variant of Object.keys(files)) {
  test(`${variant}: common HTML frame and isolated Hello World`, async ({page}) => {
    const errors = [];
    const apiRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().includes('/api/')) apiRequests.push(request.url());
    });
    await page.goto(`/${variant}/`);
    await expect(page.getByRole('navigation', {name:'Implementations'})).toBeVisible();
    await expect(page.locator('script')).toHaveCount(0);
    const example = page.frameLocator('.example-panel iframe');
    await expect(example.locator('h1')).toHaveText('Hello World');
    await expect(example.locator('h1 + div')).toHaveText('Hello World');
    await expect(example.locator('nav')).toHaveCount(0);
    await expect(example.locator('input')).toHaveCount(0);
    await expect(example.getByRole('link', {name:'View source'})).toHaveCount(0);
    expect(apiRequests).toEqual([]);
    expect(errors).toEqual([]);
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await expect(example.locator('h1 + div')).toBeVisible();
  });

  test(`${variant}: source browser starts from the individual page`, async ({page}) => {
    await page.goto(`/${variant}/`);
    const embedded = page.frameLocator('.source-frame-panel iframe');
    await expect(embedded.locator('#source-code')).toHaveText(readFileSync(files[variant], 'utf8'));
    await expect(embedded.getByRole('navigation', {name:'Source files'}).getByRole('link')).toHaveCount(0);
    await embedded.getByRole('link', {name:'Common',exact:true}).click();
    await embedded.getByRole('link', {name:'Shared HTML frame',exact:true}).click();
    await expect(embedded.locator('#source-code')).toHaveText(readFileSync('backend/templates/frame.html', 'utf8'));
    await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
    const popup = page.waitForEvent('popup');
    await page.getByRole('link', {name:'View source',exact:true}).click();
    const source = await popup;
    await expect(source.locator('#source-code')).toHaveText(readFileSync(files[variant], 'utf8'));
    await source.getByRole('link', {name:'Common',exact:true}).click();
    await source.getByRole('link', {name:'Shared HTML frame',exact:true}).click();
    await expect(source.locator('#source-code')).toHaveText(readFileSync('backend/templates/frame.html', 'utf8'));
    await source.getByRole('link', {name:'Boilerplate',exact:true}).click();
    await expect(source.getByRole('link', {name:'Shared HTML frame',exact:true})).toHaveCount(0);
    await source.getByRole('link', {name:'Page',exact:true}).click();
    await expect(source.locator('#source-code')).toHaveText(readFileSync(files[variant], 'utf8'));
    await source.close();
    await expect(page.frameLocator('.example-panel iframe').locator('h1')).toHaveText('Hello World');
  });
}
