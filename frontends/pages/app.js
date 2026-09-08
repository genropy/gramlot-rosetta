import {attachTools} from '/pages-common/tools.js';
import {Application} from 'genro-dom-js';
import {RosettaBuilder} from '/pages-common/builder.js';
import {fromTytx} from 'genro-tytx';

// Host integration: the application itself is the Python recipe.
async function start() {
    const response = await fetch(new URL('recipe', window.location.href));
    if (!response.ok) throw new Error(`Recipe request failed (${response.status}).`);
    const builder = new RosettaBuilder('main');
    builder.loadSource(fromTytx(await response.text(), 'json'));
    const application = new Application(document.getElementById('root'));
    application.mountBuilder(builder);
    attachTools(application);
    window.addEventListener('pagehide', event => {
        if (!event.persisted) application.dispose();
    });
}

start().catch(error => {
    const message = document.getElementById('bootstrap-error');
    message.hidden = false;
    message.textContent = error.message;
});
