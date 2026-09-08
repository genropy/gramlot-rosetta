import {EditorView, basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {oneDark} from '@codemirror/theme-one-dark';

const source = document.getElementById('source-code');
const initial = source.textContent;
const holder = document.createElement('div');
source.before(holder);
source.hidden = true;
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.textContent = 'Edit the recipe, then Apply. Changes are not saved.';
holder.after(status);
const preview = () => parent.document.querySelector('.example-panel iframe');

const controls = document.createElement('div');
const mode = document.createElement('select');
for (const [value, text] of [['manual', 'Manual'], ['live', 'Live'], ['focusout', 'Focus out']]) {
    mode.add(new Option(text, value));
}
const label = document.createElement('label');
label.append('Update mode ', mode);
const apply = document.createElement('button');
apply.type = 'button';
apply.textContent = 'Apply';
controls.append(label, apply);
controls.style.cssText = 'display:flex;align-items:center;gap:24px;margin-bottom:12px';
holder.before(controls);
function applyRecipe() {
    if (!preview()) { status.textContent = 'Open the demo to see the preview.'; return; }
    preview().contentWindow.postMessage({type: 'recipe', code: editor.state.doc.toString()}, location.origin);
}
apply.addEventListener('click', applyRecipe);
mode.addEventListener('change', () => {
    if (mode.value === 'live') applyRecipe();
});
const editor = new EditorView({
    doc: initial,
    parent: holder,
    extensions: [basicSetup, javascript(), oneDark, EditorView.lineWrapping,
        EditorView.theme({
            '&': {fontSize: '12px'},
            '.cm-content': {fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'},
        }),
        EditorView.domEventHandlers({
            blur() { if (mode.value === 'focusout') applyRecipe(); },
        }),
        EditorView.updateListener.of(update => {
            if (!update.docChanged) return;
            status.textContent = 'Unapplied changes. Changes are not saved.';
            if (mode.value === 'live') applyRecipe();
        }),
    ],
});
window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== preview()?.contentWindow || event.data?.type !== 'recipe-result') return;
    status.textContent = event.data.error ? `Error: ${event.data.error}` : 'Preview updated. Changes are not saved.';
});
window.addEventListener('pagehide', () => editor.destroy());
