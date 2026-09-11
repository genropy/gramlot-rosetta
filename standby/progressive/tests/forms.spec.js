import {test, expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';

const save = "this.getFormHandler().save().then(result => genro.live(() => this.setRelativeData('result', result.status)));";
const restore = "this.getFormHandler().restoreBaseline();";
const javascript = `
root.data('draft.contact.name', 'Alice');
root.data('result', '');
const form = root.form({formId:'contact', datapath:'draft'});
const fields = form.formlet({col_min_width:'180px', gap:'12px', fld_font_size:'16px'});
const box = fields.labledBox({label:'Contact', datapath:'.contact'});
box.textBox({value:'^.name', lbl:'Name', validate_notnull:true});
fields.textBox({value:'^.note', lbl:'Notes'});
form.button('Save', {action:${JSON.stringify(save)}});
form.button('Restore', {action:${JSON.stringify(restore)}});
root.div('^result', {class:'save-result'});
`;

function pythonRecipe() {
  return execFileSync('.venv/bin/python', ['-c', `
from gramlot.transport import to_tytx
from gramlot.builder import GramlotBuilder
builder = GramlotBuilder('main')
root = builder.root
root.data('draft.contact.name', 'Alice')
root.data('result', '')
form = root.form(formId='contact', datapath='draft')
fields = form.formlet(col_min_width='180px', gap='12px', fld_font_size='16px')
box = fields.labledBox(label='Contact', datapath='.contact')
box.textBox(value='^.name', lbl='Name', validate_notnull=True)
fields.textBox(value='^.note', lbl='Notes')
form.button('Save', action=${JSON.stringify(save)})
form.button('Restore', action=${JSON.stringify(restore)})
root.div('^result', class_='save-result')
print(to_tytx(builder.source, transport='json'))
`], {encoding:'utf8'}).trim();
}

// Test-only recipes exercise each real bootstrap without adding gallery examples.
for (const variant of ['pages', 'pages-js']) {
  test(`${variant}: labeled memory form validates, saves and restores`, async ({page}) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const url = variant === 'pages' ? '**/examples/pages/hello-world/recipe' : '**/pages-js/recipe.js';
    await page.route(url, route => route.fulfill({
      contentType: variant === 'pages' ? 'application/vnd.tytx+json' : 'text/javascript',
      body: variant === 'pages' ? pythonRecipe() : javascript,
    }));
    await page.goto(`/${variant}/`);
    const frame = page.frameLocator('.example-panel iframe');
    const field = frame.getByRole('textbox', {name:'Name', exact:true});
    await expect(field).toHaveValue('Alice');
    await expect(frame.getByText('Contact', {exact:true})).toBeVisible();
    await field.fill('');
    await field.press('Tab');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await frame.getByRole('button', {name:'Save', exact:true}).click();
    await expect(frame.locator('.save-result')).toHaveText('blocked');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await field.fill('Bob');
    await field.press('Tab');
    await expect(field).toHaveAttribute('aria-invalid', 'false');
    await frame.getByRole('button', {name:'Save', exact:true}).click();
    await expect(frame.locator('.save-result')).toHaveText('saved');
    await field.fill('Later');
    await field.press('Tab');
    await frame.getByRole('button', {name:'Restore', exact:true}).click();
    await expect(field).toHaveValue('Bob');
    const grid = frame.locator('gnr-formlet .fields');
    const columns = () => grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    await expect.poll(columns).toBe(2);
    await page.setViewportSize({width:390, height:844});
    await expect.poll(columns).toBe(1);
    await expect(field).toHaveValue('Bob');
    expect(errors).toEqual([]);
  });
}
