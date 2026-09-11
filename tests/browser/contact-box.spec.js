import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const files={pages:'frontends/pages/pages/contact-box.py','pages-js':'frontends/pages-js/contact-box.js',react:'frontends/react/src/ContactBox.jsx',vue:'frontends/vue/src/ContactBox.vue',nicegui:'frontends/nicegui/contact_box.py'};
for(const [variant,file] of Object.entries(files)) {
 test(`${variant}: contact group, relative field scope and editable values`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${variant}/contact-box/`);
  await expect(page.locator('.lesson-intro')).toContainText('Lesson 04');
  const preview=page.frameLocator('.example-panel iframe');
  await expect(preview.getByText('Contact details',{exact:true})).toBeVisible();
  const entries=[['First name','first_name','Ada'],['Last name','last_name','Lovelace'],['Phone','phone','+39 0123456789'],['Email','email','ada@example.com']];
  for(const [label,path,value] of entries){
   const field=preview.getByLabel(label,{exact:true});
   await field.fill(value);await field.press('Tab');await expect(field).toHaveValue(value);
   if(variant.startsWith('pages')) await expect(preview.locator(`gnr-textbox[data-value-pointer$="contact.${path}"]`)).toHaveCount(1);
  }
  const source=page.frameLocator('.source-frame-panel iframe');
  await expect(source.locator('#source-code')).toHaveText(readFileSync(file,'utf8'));
  await expect(source.locator('.cm-content')).toHaveAttribute('contenteditable',variant==='pages-js'?'true':'false');
  if(variant==='pages-js'){
   await source.locator('.cm-content').fill(readFileSync(file,'utf8').replace("datapath: 'contact'","datapath: 'other'"));
   await source.getByRole('button',{name:'Run',exact:true}).click();
   await expect(preview.locator('gnr-textbox[data-value-pointer$="other.first_name"]')).toHaveCount(1);
   await source.getByRole('button',{name:'Reset',exact:true}).click();
   await expect(preview.locator('gnr-textbox[data-value-pointer$="contact.first_name"]')).toHaveCount(1);
  }
  await page.reload();await expect(preview.getByLabel('First name',{exact:true})).toHaveValue('');
  expect(errors).toEqual([]);
 });
}

test('shared styles live once in Overview and lesson code stays separate', async ({page}) => {
  await page.goto('/pages-js/repeated-contacts/');
  const lesson = page.frameLocator('.source-frame-panel iframe');
  await expect(lesson.getByRole('link', {name:'Contact styles · CSS',exact:true})).toHaveCount(0);
  await expect(lesson.locator('.cm-content')).toHaveAttribute('contenteditable','true');
  await page.getByRole('link',{name:'Example styles',exact:true}).click();
  const styles = page.frameLocator('.overview-source iframe');
  await expect(styles.locator('#source-code')).toHaveText(readFileSync('shared/example.css','utf8'));
  await styles.getByRole('link',{name:'Contact styles · CSS',exact:true}).click();
  await expect(styles.locator('#source-code')).toHaveText(readFileSync('shared/contacts.css','utf8'));
  await expect(styles.locator('.cm-content')).toHaveAttribute('contenteditable','false');
  await expect(styles.getByRole('button',{name:'Run',exact:true})).toHaveCount(0);
});
