import {EditorView, basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';

const source = document.getElementById('source-code');
const initial = source.textContent;
const holder = document.createElement('div');
source.before(holder);
source.hidden = true;
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.textContent = 'Edit the recipe to update the preview. Changes are not saved.';
holder.after(status);
const preview = () => parent.document.querySelector('.example-panel iframe');
let timer;
const editor = new EditorView({
    doc: initial,
    parent: holder,
    extensions: [basicSetup, javascript(), EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
            if (!update.docChanged) return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!preview()) { status.textContent = 'Open the demo to see the live preview.'; return; }
                preview().contentWindow.postMessage({type: 'recipe', code: update.state.doc.toString()}, location.origin);
            }, 250);
        }),
    ],
});
window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== preview()?.contentWindow || event.data?.type !== 'recipe-result') return;
    status.textContent = event.data.error ? `Error: ${event.data.error}` : 'Preview updated. Changes are not saved.';
});
window.addEventListener('pagehide', () => { clearTimeout(timer); editor.destroy(); });
