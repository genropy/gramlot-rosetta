import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const files = {
  react: 'frontends/react/src/App.jsx',
  vue: 'frontends/vue/src/App.vue',
  pages: 'frontends/pages/recipe.py',
};

for (const variant of Object.keys(files)) {
  test(`${variant} source view shows original files and preserves the draft`, async ({page, request}) => {
    await request.post('/api/reset');
    await page.goto(`/${variant}/`);
    const host = page.getByTestId('customer');
    await expect(host).toBeVisible();
    const input = await host.evaluate(el => el.tagName === 'INPUT') ? host : host.locator('input');
    await input.fill('Unsaved source review');
    await input.blur();
    const popup = page.waitForEvent('popup');
    await page.getByRole('link', {name: 'View source', exact: true}).click();
    const viewer = await popup;
    await expect(viewer.locator('#source-code')).toHaveText(readFileSync(files[variant], 'utf8'));
    await viewer.getByRole('link', {name: 'Shared FastAPI backend', exact: true}).click();
    await expect(viewer.locator('#source-code')).toHaveText(readFileSync('backend/app.py', 'utf8'));
    await viewer.getByRole('navigation', {name: 'Implementation sources'})
      .getByRole('link', {name: 'Genro Pages', exact: true}).click();
    await expect(viewer.locator('#source-code')).toHaveText(readFileSync(files.pages, 'utf8'));
    await viewer.getByRole('link', {name: 'Client controller · JavaScript', exact: true}).click();
    await expect(viewer.locator('#source-code')).toHaveText(readFileSync('frontends/pages/app.js', 'utf8'));
    await viewer.setViewportSize({width: 390, height: 844});
    expect(await viewer.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await viewer.close();
    await expect(input).toHaveValue('Unsaved source review');
  });
}
