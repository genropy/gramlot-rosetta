import {Application} from 'gramlot-dom';
import {GramlotBuilder} from 'gramlot-builder';

let application;
function render(code) {
    const builder = new GramlotBuilder('main');
    let next;
    try {
        builder.main = new Function('root', code);
        const container = document.createElement('div');
        next = new Application(container);
        next.mountBuilder(builder);
        application?.dispose();
        document.getElementById('root').replaceChildren(container);
        application = next;
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
const recipes = {'hello-world': 'recipe.js', 'data-binding': 'data-binding.js', 'input-widgets': 'input-widgets.js', 'contact-box': 'contact-box.js', 'repeated-contacts': 'repeated-contacts.js', 'contact-colors': 'contact-colors.js'};
const recipe = recipes[location.pathname.split('/').filter(Boolean).at(-1)];
fetch(`/gramlot-js/${recipe}`).then(response => response.text()).then(render).catch(error => {
    document.getElementById('bootstrap-error').textContent = error.message;
    document.getElementById('bootstrap-error').hidden = false;
});
window.addEventListener('pagehide', () => application?.dispose());
