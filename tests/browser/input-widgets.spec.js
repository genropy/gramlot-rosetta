import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
test.use({locale:'en-US'});
const files = {
  pages:'frontends/pages/pages/input-widgets.py',
  'pages-js':'frontends/pages-js/input-widgets.js',
  react:'frontends/react/src/InputWidgets.jsx',
  vue:'frontends/vue/src/InputWidgets.vue',
  nicegui:'frontends/nicegui/input_widgets.py',
};
for (const [variant,file] of Object.entries(files)) {
  test(`${variant}: six input widgets, editable values and responsive layout`,async ({page}) => {
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`/${variant}/input-widgets/`);
    await expect(page.locator('.lesson-intro')).toContainText('Lesson 03');
    const preview=page.frameLocator('.example-panel iframe');
    for (const [label,value] of [['Name','Ada'],['Quantity','3'],['Date','2026-09-11'],['Time','14:30'],['Notes','First line\nSecond line']]) {
      const input=preview.getByLabel(label,{exact:true});
      await input.fill(value);
      await input.press('Tab');
      // Gramlot's date editor now displays localized free text after commit.
      const expected = label === 'Date' && ['pages', 'pages-js'].includes(variant)
        ? '09/11/2026' : value;
      await expect(input).toHaveValue(expected);
    }
    const checkbox=preview.getByRole('checkbox',{name:'Updates',exact:true});
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    const source=page.frameLocator('.source-frame-panel iframe');
    await expect(source.locator('#source-code')).toHaveText(readFileSync(file,'utf8'));
    await expect(source.locator('.cm-content')).toHaveAttribute('contenteditable',variant==='pages-js'?'true':'false');
    await page.setViewportSize({width:390,height:844});
    await expect(preview.getByLabel('Notes',{exact:true})).toBeVisible();
    const frame=page.frames().find(f=>f.url().includes(`/examples/${variant}/input-widgets/`));
    expect(await frame.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await expect(preview.getByLabel('Name',{exact:true})).toHaveValue('');
    await expect(checkbox).not.toBeChecked();
    expect(errors).toEqual([]);
  });
}
