import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const examples = ['editable-text','text-color','background-color','font-size','font-family','font-style','local-scope'];
for (const variant of ['react','vue','pages','pages-js']) {
  for (const [stage, example] of examples.entries()) {
    test(`${variant} ${example}: cumulative behavior and actual source`, async ({page}) => {
      const errors=[]; page.on('pageerror', e=>errors.push(e.message));
      await page.goto(`/${variant}/${example}/`);
      const frame=page.frameLocator('.example-panel iframe');
      const output=frame.locator('.demo-output input');
      await expect(output).toHaveValue('Hello World');
      const input=frame.getByLabel('Text', {exact:true});
      await input.fill('Hello People');
      await expect(output).toHaveValue('Hello World');
      await frame.getByRole('heading').click();
      await expect(output).toHaveValue('Hello People');
      if(stage>=1) {
        await frame.getByLabel('Text color',{exact:true}).fill('#ff0000');
        await expect(output).toHaveCSS('color','rgb(255, 0, 0)');
      }
      if(stage>=2) {
        await frame.getByLabel('Background color',{exact:true}).fill('#00ff00');
        await expect(['pages','pages-js'].includes(variant) ? frame.locator('.demo-output') : output).toHaveCSS('background-color','rgb(0, 255, 0)');
      }
      if(stage>=3) {
        const slider=frame.getByRole('slider');
        await expect(slider).toHaveAttribute('min', '10');
        await expect(slider).toHaveAttribute('max', '48');
        await expect(slider).toHaveAttribute('step', '1');
        await slider.fill('28');
        await expect(output).toHaveCSS('font-size','28px');
      }
      if(stage>=4) {
        if (['pages','pages-js'].includes(variant)) {
          await frame.getByLabel('Font family',{exact:true}).fill('monospace');
          await frame.getByLabel('Font family',{exact:true}).press('Enter');
        } else {
          await frame.getByLabel('Font family',{exact:true}).selectOption('monospace');
        }
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

for (const variant of ['pages','pages-js']) {
  test(`${variant}: inspector edits the same Data used by widgets`, async ({page}) => {
    await page.goto(`/${variant}/editable-text/`);
    await page.getByRole('button',{name:'Inspector',exact:true}).click();
    const frame=page.frameLocator('.example-panel iframe');
    await frame.locator('[data-inspector="data"]').getByText('text',{exact:true}).click();
    const editor=frame.locator('[data-inspector="data-editor"]');
    await editor.getByRole('textbox',{name:'Value',exact:true}).fill('From Data');
    await editor.getByRole('button',{name:'Apply',exact:true}).click();
    await expect(frame.locator('.demo-output input')).toHaveValue('From Data');
    await expect(frame.getByLabel('Text',{exact:true})).toHaveValue('From Data');
  });
}

for (const variant of ['pages','pages-js']) {
  test(`${variant} local-scope: relative state and formulas stay in sample`, async ({page}) => {
    await page.goto(`/${variant}/local-scope/`);
    const frame=page.frameLocator('.example-panel iframe');
    await frame.getByLabel('Text',{exact:true}).fill('Scoped text');
    await frame.getByRole('heading').click();
    await frame.getByRole('slider').fill('28');
    await frame.getByLabel('Bold',{exact:true}).check();
    await page.getByRole('button',{name:'Inspector',exact:true}).click();
    const tree=frame.locator('[data-inspector="data"]');
    const values=await tree.evaluate(el=>{
      const bag=el.storeBag;
      return {
        text:bag.getItem('sample.text'), size:bag.getItem('sample.size'),
        sizeCss:bag.getItem('sample.sizeCss'), weight:bag.getItem('sample.weight'),
        leaked:['text','color','background','size','font','bold','italic','sizeCss','weight','slant']
          .filter(path=>Boolean(bag.getNode(path))),
      };
    });
    expect(values).toEqual({text:'Scoped text',size:28,sizeCss:'28px',weight:'bold',leaked:[]});
    await tree.getByText('sample',{exact:true}).click();
    await tree.getByText('text',{exact:true}).click();
    const editor=frame.locator('[data-inspector="data-editor"]');
    await editor.getByRole('textbox',{name:'Value',exact:true}).fill('From sample');
    await editor.getByRole('button',{name:'Apply',exact:true}).click();
    await expect(frame.locator('.demo-output input')).toHaveValue('From sample');
    await expect(frame.getByLabel('Text',{exact:true})).toHaveValue('From sample');
  });
}
