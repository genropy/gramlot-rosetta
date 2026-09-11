import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const files={pages:'frontends/pages/pages/repeated-contacts.py','pages-js':'frontends/pages-js/repeated-contacts.js',react:'frontends/react/src/RepeatedContacts.jsx',vue:'frontends/vue/src/RepeatedContacts.vue',nicegui:'frontends/nicegui/repeated_contacts.py'};
for(const [variant,file] of Object.entries(files)) {
 test(`${variant}: six independent contacts with scoped fields`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${variant}/repeated-contacts/`);
  await expect(page.locator('.lesson-intro')).toContainText('Lesson 05');
  const preview=page.frameLocator('.example-panel iframe');
  const names=preview.getByLabel('First name',{exact:true});
  await expect(names).toHaveCount(6);
  for(let i=0;i<6;i++) {
   await expect(preview.getByText(`Contact ${i+1}`,{exact:true})).toBeVisible();
   await names.nth(i).fill(`Person ${i+1}`);await names.nth(i).press('Tab');
   if(variant.startsWith('pages')) await expect(preview.locator(`gnr-textbox[data-value-pointer$="c${i+1}.first_name"]`)).toHaveCount(1);
  }
  for(let i=0;i<6;i++) await expect(names.nth(i)).toHaveValue(`Person ${i+1}`);
  await names.nth(0).fill('Changed');await names.nth(0).press('Tab');
  for(let i=1;i<6;i++) await expect(names.nth(i)).toHaveValue(`Person ${i+1}`);
  const source=page.frameLocator('.source-frame-panel iframe');
  await expect(source.locator('#source-code')).toHaveText(readFileSync(file,'utf8'));
  await expect(source.locator('.cm-content')).toHaveAttribute('contenteditable',variant==='pages-js'?'true':'false');
  await page.setViewportSize({width:390,height:844});
  const frame=page.frames().find(f=>f.url().includes(`/examples/${variant}/repeated-contacts/`));
  expect(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.reload();await expect(names.nth(0)).toHaveValue('');
  expect(errors).toEqual([]);
 });
}
