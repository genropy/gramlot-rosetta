import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const files={pages:'frontends/pages/pages/contact-colors.py','pages-js':'frontends/pages-js/contact-colors.js',react:'frontends/react/src/ContactColors.jsx',vue:'frontends/vue/src/ContactColors.vue',nicegui:'frontends/nicegui/contact_colors.py'};
for(const [variant,file] of Object.entries(files)) {
 test(`${variant}: each color picker changes only its own card`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${variant}/contact-colors/`);
  const preview=page.frameLocator('.example-panel iframe');
  const cards=preview.locator(variant.startsWith('pages') ? '.contact-box [part=label]' : '.contact-box > h2');
  const colors=preview.locator('input[type=color]');
  await expect(colors).toHaveCount(6);
  for(let i=0;i<6;i++) await expect(cards.nth(i)).toHaveCSS('background-color','rgb(41, 56, 77)');
  for(const [index,color,rgb] of [[0,'#bada55','rgb(186, 218, 85)'],[5,'#aabbcc','rgb(170, 187, 204)']]) {
   await colors.nth(index).evaluate((input,value)=>{
    Object.getOwnPropertyDescriptor(input.ownerDocument.defaultView.HTMLInputElement.prototype, 'value').set.call(input,value);
    input.dispatchEvent(new Event('input',{bubbles:true,composed:true}));
    input.dispatchEvent(new Event('change',{bubbles:true,composed:true}));
   },color);
   await expect(cards.nth(index)).toHaveCSS('background-color',rgb);
  }
  await expect(cards.nth(0)).toHaveCSS('background-color','rgb(186, 218, 85)');
  for(let i=1;i<5;i++) await expect(cards.nth(i)).toHaveCSS('background-color','rgb(41, 56, 77)');
  const name=preview.getByLabel('First name',{exact:true}).nth(0);
  await name.fill('Ada');await name.press('Tab');
  await expect(cards.nth(0)).toHaveCSS('background-color','rgb(186, 218, 85)');
  const source=page.frameLocator('.source-frame-panel iframe');
  await expect(source.locator('#source-code')).toHaveText(readFileSync(file,'utf8'));
  if(variant==='pages-js'){
   await source.getByRole('button',{name:'Reset',exact:true}).click();
   await expect(cards.nth(0)).toHaveCSS('background-color','rgb(41, 56, 77)');
  }
  await page.reload();await expect(cards.nth(5)).toHaveCSS('background-color','rgb(41, 56, 77)');
  expect(errors).toEqual([]);
 });
}
