import {EditorView, basicSetup} from 'codemirror';
import {EditorState} from '@codemirror/state';
import {javascript} from '@codemirror/lang-javascript';
import {python} from '@codemirror/lang-python';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {vue} from '@codemirror/lang-vue';

const source = document.getElementById('source-code');
const initial = source.textContent;
const editable = source.dataset.editable === 'true';
const languages = {python, javascript, jsx: () => javascript({jsx: true}), html, css, vue};
const holder = document.createElement('div');
source.before(holder);
source.hidden = true;
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.textContent = editable ? 'Change the code and press Run to see your version.' : 'Read-only source';
holder.after(status);
const preview = () => parent.document.querySelector('.example-panel iframe');
const editor = new EditorView({
    doc: initial,
    parent: holder,
    extensions: [basicSetup, languages[source.dataset.language]?.() ?? [],
        EditorState.readOnly.of(!editable), EditorView.editable.of(editable),
        EditorView.contentAttributes.of({'aria-label': editable ? 'Recipe editor' : 'Read-only source'}),
        EditorView.lineWrapping,
        EditorView.theme({
            '&': {fontSize: '13px', backgroundColor: '#fcfdff'},
            '.cm-content': {fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'},
            '.cm-gutters': {backgroundColor: '#f5f7fb', border: 'none'},
        }),
        EditorView.updateListener.of(update => {
            if (editable && update.docChanged) status.textContent = 'Changes ready to run.';
        }),
    ],
});
function applyRecipe() {
    if (!preview()) { status.textContent = 'Open the demo to see the preview.'; return; }
    status.textContent = 'Running…';
    preview().contentWindow.postMessage({type: 'recipe', code: editor.state.doc.toString()}, location.origin);
}
if (editable) {
    const controls = document.createElement('div');
    controls.className = 'lab-controls';
    for (const [text, action] of [
        ['Run', applyRecipe],
        ['Reset', () => {
            editor.dispatch({changes: {from: 0, to: editor.state.doc.length, insert: initial}});
            applyRecipe();
        }],
    ]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.addEventListener('click', action);
        controls.append(button);
    }
    holder.after(controls);
    window.addEventListener('message', event => {
        if (event.origin !== location.origin || event.source !== preview()?.contentWindow || event.data?.type !== 'recipe-result') return;
        status.textContent = event.data.error ? `Error: ${event.data.error}` : 'Preview updated. Changes are not saved.';
    });
}
window.addEventListener('pagehide', () => editor.destroy());
