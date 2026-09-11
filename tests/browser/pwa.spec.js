import {test,expect} from '@playwright/test';

test('installable manifest, icons and server-unavailable recovery', async ({page,context}) => {
    await page.goto('/overview/');
    const manifestUrl = await page.locator('link[rel=manifest]').getAttribute('href');
    const response = await page.request.get(manifestUrl);
    const manifest = await response.json();
    expect(manifest.name).toBe('Gramlot Rosetta');
    expect(manifest.display).toBe('standalone');
    expect(manifest.scope).toBe('/');
    for (const icon of manifest.icons) {
        const image = await page.request.get(icon.src);
        expect(image.ok()).toBe(true);
        const bytes = await image.body();
        expect(bytes.readUInt32BE(16)).toBe(Number(icon.sizes.split('x')[0]));
    }
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    const cdp = await context.newCDPSession(page);
    const result = await cdp.send('Page.getAppManifest');
    expect(result.errors).toEqual([]);
    const installability = await cdp.send('Page.getInstallabilityErrors');
    expect(installability.installabilityErrors).toEqual([]);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading',{name:'Rosetta is waiting for its server'})).toBeVisible();
    await context.setOffline(false);
    await page.getByRole('link',{name:'Try again',exact:true}).click();
    await expect(page.getByRole('navigation',{name:'Groups and lessons'})).toBeVisible();
});
