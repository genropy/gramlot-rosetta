import {attachTools} from '/pages-common/tools.js';
import {Application, HtmlBuilder} from 'genro-dom-js';

let application;
function render(code) {
    const builder = new HtmlBuilder('main');
    let next;
    try {
        builder.main = new Function('root', code);
        const container = document.createElement('div');
        next = new Application(container);
        next.mountBuilder(builder);
        application?.dispose();
        document.getElementById('root').replaceChildren(container);
        application = next;
        attachTools(application);
    } catch (error) {
        next?.dispose();
        builder.dispose();
        throw error;
    }
}
window.addEventListener('message', event => {
    const editor = parent.document.querySelector('.source-frame-panel iframe');
    if (event.origin !== location.origin || event.source !== editor?.contentWindow || event.data?.type !== 'recipe') return;
    let error = null;
    try { render(event.data.code); } catch (failure) { error = failure.message; }
    event.source.postMessage({type: 'recipe-result', error}, location.origin);
});
fetch('/pages-js/recipe.js').then(response => response.text()).then(render).catch(error => {
    document.getElementById('bootstrap-error').textContent = error.message;
    document.getElementById('bootstrap-error').hidden = false;
});
window.addEventListener('pagehide', () => application?.dispose());
