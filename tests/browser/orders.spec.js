import {test, expect} from '@playwright/test';

async function input(page, name) {
  const target = page.getByTestId(name);
  await expect(target).toBeVisible();
  return await target.evaluate(el => el.tagName === 'INPUT') ? target : target.locator('input');
}

async function edit(page, name, value) {
  const control = await input(page, name);
  await control.fill(value);
  await control.blur();
}

for (const variant of ['react', 'vue', 'pages']) {
  test.describe(variant, () => {
    test.beforeEach(async ({request, page}) => {
      await request.post('/api/reset');
      await page.goto(`/${variant}/`);
      await expect(page.getByTestId('order-1')).toContainText('Ada Studio');
      await expect(await input(page, 'customer')).toHaveValue('Ada Studio');
      await expect(page.getByText(/^\s*Product:?\s*$/)).toBeVisible();
      await expect(page.getByText(/^\s*Unit price:?\s*$/)).toBeVisible();
      await expect(page.getByTestId('order-1')).toHaveAttribute('aria-pressed', 'true');
    });

    test('local calculation, isolated draft and selection', async ({page}) => {
      const requests = [];
      page.on('request', req => { if (req.url().includes('/api/')) requests.push(req.url()); });
      await edit(page, 'quantity', '4');
      await expect(page.getByTestId('total')).toHaveText('EUR 50.00');
      await edit(page, 'customer', 'Unsaved name');
      await expect(page.getByTestId('order-1')).toContainText('Ada Studio');
      await page.getByTestId('order-2').click();
      await expect(page.getByTestId('order-2')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('order-1')).toHaveAttribute('aria-pressed', 'false');
      await expect(await input(page, 'customer')).toHaveValue('Linus Workshop');
      await page.getByTestId('order-1').click();
      await expect(await input(page, 'customer')).toHaveValue('Ada Studio');
      await expect(await input(page, 'quantity')).toHaveValue('2');
      expect(requests).toEqual([]);
    });

    test('save persists, updates list, and reset restores shared seed', async ({page}) => {
      await edit(page, 'customer', 'Rosetta buyer');
      await edit(page, 'quantity', '5');
      await edit(page, 'note', 'Deliver next week');
      await (await input(page, 'fulfilled')).check();
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toHaveText('Order saved.');
      await expect(page.getByTestId('order-1')).toContainText('Rosetta buyer');
      await page.reload();
      await expect(await input(page, 'customer')).toHaveValue('Rosetta buyer');
      await expect(page.getByTestId('total')).toHaveText('EUR 62.50');
      await expect(await input(page, 'note')).toHaveValue('Deliver next week');
      await expect(await input(page, 'fulfilled')).toBeChecked();
      await page.getByTestId('reset').click();
      await expect(await input(page, 'customer')).toHaveValue('Ada Studio');
      await expect(page.getByTestId('total')).toHaveText('EUR 25.00');
    });

    test('server validation preserves edits and allows correction', async ({page}) => {
      await edit(page, 'customer', '   ');
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toContainText('Customer must not be blank.');
      await expect(await input(page, 'customer')).toHaveValue('   ');
      await edit(page, 'customer', 'Valid name');
      await edit(page, 'quantity', '0');
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toContainText('Quantity must be an integer from 1 to 100.');
      await edit(page, 'quantity', '1.5');
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toContainText('Invalid quantity value.');
      await expect(await input(page, 'quantity')).toHaveValue('1.5');
      await edit(page, 'quantity', '3');
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toHaveText('Order saved.');
    });

    test('network failure preserves draft and can be retried', async ({page}) => {
      await edit(page, 'note', 'Keep my edit');
      await page.route('**/api/orders/1', route => route.abort('failed'));
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).not.toHaveText('');
      await expect(page.getByTestId('feedback')).not.toHaveText('Order saved.');
      await expect(page.getByTestId('save')).toBeEnabled();
      await expect(await input(page, 'note')).toHaveValue('Keep my edit');
      await page.unroute('**/api/orders/1');
      await page.getByTestId('save').click();
      await expect(page.getByTestId('feedback')).toHaveText('Order saved.');
    });

    test('pending save prevents duplicate submission and selection races', async ({page}) => {
      let release;
      let submissions = 0;
      const gate = new Promise(resolve => { release = resolve; });
      await page.route('**/api/orders/1', async route => { submissions++; await gate; await route.continue(); });
      await edit(page, 'customer', 'Pending buyer');
      await page.getByTestId('save').dblclick();
      await expect(page.getByTestId('save')).toBeDisabled();
      await expect(page.getByTestId('order-2')).toBeDisabled();
      await expect(await input(page, 'customer')).toBeDisabled();
      await expect(await input(page, 'quantity')).toBeDisabled();
      await expect(await input(page, 'note')).toBeDisabled();
      await expect(await input(page, 'fulfilled')).toBeDisabled();
      await expect(page.getByTestId('reset')).toBeDisabled();
      expect(submissions).toBe(1);
      release();
      await expect(page.getByTestId('feedback')).toHaveText('Order saved.');
      await expect(page.getByTestId('order-2')).toBeEnabled();
      expect(submissions).toBe(1);
    });

    test('initial load failure has visible error and reset retries', async ({page}) => {
      await page.route('**/api/orders', route => route.abort('failed'));
      await page.reload();
      await expect(page.getByTestId('feedback')).not.toHaveText('');
      await expect(page.getByTestId('reset')).toBeEnabled();
      await page.unroute('**/api/orders');
      await page.getByTestId('reset').click();
      await expect(await input(page, 'customer')).toHaveValue('Ada Studio');
      await expect(page.getByTestId('order-3')).toBeVisible();
    });

    test('compact mobile layout remains usable', async ({page}) => {
      await page.setViewportSize({width: 390, height: 844});
      await expect(page.getByTestId('save')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
      await page.getByTestId('order-3').click();
      await expect(await input(page, 'customer')).toHaveValue('Grace Lab');
    });
  });
}
