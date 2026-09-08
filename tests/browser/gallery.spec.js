import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const examples = ['editable-text','text-color','background-color','font-size','font-family','font-style'];
for (const variant of ['react','vue','pages','pages-js']) {
  for (const [stage, example] of examples.entries()) {
    test(`${variant} ${example}: cumulative behavior and actual source`, async ({page}) => {
      const errors=[]; page.on('pageerror', e=>errors.push(e.message));
      await page.goto(`/${variant}/${example}/`);
      const frame=page.frameLocator('.example-panel iframe');
      const output=frame.locator('.demo-output').locator('span').last();
      await expect(output).toHaveText('Hello World');
      const input=frame.getByLabel('Text', {exact:true});
      await input.fill('Hello People');
      await expect(output).toHaveText('Hello World');
      await frame.getByRole('heading').click();
      await expect(output).toHaveText('Hello People');
      if(stage>=1) {
        await frame.getByLabel('Text color',{exact:true}).fill('#ff0000');
        await expect(output).toHaveCSS('color','rgb(255, 0, 0)');
      }
      if(stage>=2) {
        await frame.getByLabel('Background color',{exact:true}).fill('#00ff00');
        await expect(output).toHaveCSS('background-color','rgb(0, 255, 0)');
      }
      if(stage>=3) {
        const slider=frame.getByRole('slider');
        await slider.fill('28');
        await expect(output).toHaveCSS('font-size','28px');
      }
      if(stage>=4) {
        await frame.getByLabel('Font family',{exact:true}).selectOption('monospace');
        await expect(output).toHaveCSS('font-family','monospace');
      }
      if(stage>=5) {
        await frame.getByLabel('Bold',{exact:true}).check();
        await frame.getByLabel('Italic',{exact:true}).check();
        await expect(output).toHaveCSS('font-weight','700');
        await expect(output).toHaveCSS('font-style','italic');
      }
      const extension={react:'jsx',vue:'vue',pages:'py','pages-js':'js'}[variant];
      const sourcePath=`frontends/${variant}/${['react','vue'].includes(variant)?'src/':''}examples/${example}.${extension}`;
      const sources=page.frameLocator('.source-frame-panel iframe');
      await expect(sources.locator('#source-code')).toHaveText(readFileSync(sourcePath,'utf8'));
      await sources.getByRole('link',{name:'Common',exact:true}).click();
      await sources.getByRole('link',{name:'Page',exact:true}).click();
      await expect(sources.locator('#source-code')).toHaveText(readFileSync(sourcePath,'utf8'));
      await page.setViewportSize({width:390,height:844});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
      expect(errors).toEqual([]);
    });
  }
}
