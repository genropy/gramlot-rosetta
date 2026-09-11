import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for (const variant of ['react','vue','pages','pages-js']) {
  test(`${variant}: six independent repeated panels`, async ({page}) => {
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`/${variant}/repeated-panels/`);
    const frame=page.frameLocator('.example-panel iframe');
    const panels=frame.locator('.scoped-example');
    await expect(panels).toHaveCount(6);
    for(let index=0;index<6;index++) {
      await expect(panels.nth(index).locator('.demo-output input')).toHaveValue('Hello World');
    }
    await panels.nth(2).getByLabel('Text',{exact:true}).fill('Panel three');
    await panels.nth(2).getByRole('slider').fill('28');
    await panels.nth(2).getByLabel('Bold',{exact:true}).check();
    await panels.nth(2).getByLabel('Text color',{exact:true}).fill('#ff0000');
    for(let index=0;index<6;index++) {
      const output=panels.nth(index).locator('.demo-output input');
      await expect(output).toHaveValue(index===2?'Panel three':'Hello World');
      await expect(output).toHaveCSS('font-size',index===2?'28px':'14px');
      await expect(output).toHaveCSS('font-weight',index===2?'700':'400');
      await expect(output).toHaveCSS('color',index===2?'rgb(255, 0, 0)':'rgb(34, 48, 68)');
    }
    const chooser=frame.getByLabel('Label position',{exact:true});
    for(const position of ['L','R','TL','TC','TR','BL','BC','BR']) {
      if(variant.startsWith('pages')) {
        await chooser.fill(position);
        await chooser.press('Enter');
        for(let index=0;index<6;index++) {
          await expect(panels.nth(index)).toHaveAttribute('lbl_position',position);
          for(const widget of await panels.nth(index).locator('gnr-textbox, gnr-colorpicker, gnr-horizontalslider, gnr-filteringselect, gnr-checkbox').all()) {
            await expect(widget).toHaveAttribute('lbl_position',position);
          }
        }
      } else {
        await chooser.selectOption(position);
        for(let index=0;index<6;index++) await expect(panels.nth(index)).toHaveAttribute('data-label-position',position);
      }
      await expect(panels.nth(2).locator('.demo-output input')).toHaveValue('Panel three');
      await expect(panels.nth(0).locator('.demo-output input')).toHaveValue('Hello World');
    }
    if(variant.startsWith('pages')) {
      await page.getByRole('button',{name:'Inspector',exact:true}).click();
      const data=await frame.locator('[data-inspector="data"]').evaluate(el=>{
        const bag=el.storeBag;
        return {branches:bag.getItem('panels').getNodes().map(n=>n.label),
          text:bag.getItem('panels.panel_2.text'), size:bag.getItem('panels.panel_2.sizeCss'),
          position:bag.getItem('common.position'),other:bag.getItem('panels.panel_0.text'),leak:Boolean(bag.getNode('text'))};
      });
      expect(data).toEqual({branches:Array.from({length:6},(_,i)=>`panel_${i}`),text:'Panel three',size:'28px',position:'BR',other:'Hello World',leak:false});
    }
    const sources=page.frameLocator('.source-frame-panel iframe');
    const ext={react:'jsx',vue:'vue',pages:'py','pages-js':'js'}[variant];
    await expect(sources.locator('#source-code')).toHaveText(readFileSync(`frontends/${variant}/${['react','vue'].includes(variant)?'src/':''}examples/repeated-panels.${ext}`,'utf8'));
    if(variant==='vue') {
      await sources.getByRole('link',{name:'Repeated panel · Vue SFC',exact:true}).click();
      await expect(sources.locator('#source-code')).toHaveText(readFileSync('frontends/vue/src/examples/repeated-panel.vue','utf8'));
    }
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(errors).toEqual([]);
  });
}
