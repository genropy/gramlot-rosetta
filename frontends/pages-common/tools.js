import {fromTytx} from 'genro-tytx';
import {mountInspector} from '/pages/assets/pages/inspector.js';

// Shared Pages tooling: inspect the current application, never the recipe code.
export async function attachTools(application) {
    const toolbar = parent.document.getElementById('pages-tools');
    if (!toolbar) return;
    const button = parent.document.createElement('button');
    button.textContent = 'Inspector';
    button.type = 'button';
    button.disabled = true;
    toolbar.replaceChildren(button);
    const host = document.createElement('div');
    document.body.append(host);
    try {
        const response = await fetch('/pages/inspector-recipe');
        if (!response.ok) throw new Error('Inspector unavailable');
        if (application._disposed) { host.remove(); return; }
        const tool = mountInspector(host, fromTytx(await response.text(), 'json'), application);
        const launcher = host.querySelector('[data-inspector="toggle"]');
        launcher.hidden = true;
        const palette = host.querySelector('gnr-palette');
        palette.style.left = '8px';
        palette.style.top = '8px';
        button.disabled = false;
        button.onclick = () => launcher.click();
        const dispose = application.dispose.bind(application);
        application.dispose = () => {
            tool.dispose();
            host.remove();
            button.remove();
            dispose();
        };
    } catch (error) {
        host.remove();
        button.textContent = error.message;
    }
}
