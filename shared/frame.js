// Shared presentation controls; framework rendering remains inside its iframe.
function resizePane(grid, handle, first, property, key, initial, percent, minimum, reserve) {
    if (!grid || !handle) return;
    const bounds = () => [minimum, Math.max(minimum, Math.min(grid.clientWidth - reserve,
        percent ? Infinity : window.innerWidth * .35))];
    const width = () => first.getBoundingClientRect().width;
    function apply(value) {
        const [min, max] = bounds();
        const pixels = Math.min(max, Math.max(min, value));
        const setting = percent ? `${pixels / grid.clientWidth * 100}%` : `${pixels}px`;
        grid.style.setProperty(property, setting);
        handle.setAttribute('aria-valuemin', Math.round(min));
        handle.setAttribute('aria-valuemax', Math.round(max));
        handle.setAttribute('aria-valuenow', Math.round(pixels));
        handle.setAttribute('aria-valuetext', `${Math.round(pixels)} pixels`);
        try { localStorage.setItem(key, setting); } catch { /* Storage is optional. */ }
    }
    try {
        const saved = localStorage.getItem(key);
        if (saved && /^\d+(\.\d+)?(px|%)$/.test(saved)) grid.style.setProperty(property, saved);
    } catch { /* Storage is optional. */ }
    handle.title = 'Drag to resize · Arrow keys to adjust · Double-click to reset';
    handle.setAttribute('aria-valuemin', minimum);
    handle.setAttribute('aria-valuemax', Math.round(bounds()[1]));
    handle.setAttribute('aria-valuenow', Math.round(width()));
    let drag;
    handle.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        drag = {x: event.clientX, width: width()};
        handle.setPointerCapture(event.pointerId);
        document.body.classList.add('resizing');
        event.preventDefault();
    });
    handle.addEventListener('pointermove', event => {
        if (drag) apply(drag.width + event.clientX - drag.x);
    });
    function finish() { drag = null; document.body.classList.remove('resizing'); }
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('lostpointercapture', finish);
    handle.addEventListener('keydown', event => {
        const [min, max] = bounds();
        const step = event.shiftKey ? 40 : 10;
        const values = {ArrowLeft: width() - step, ArrowRight: width() + step, Home: min, End: max};
        if (!(event.key in values)) return;
        event.preventDefault();
        apply(values[event.key]);
    });
    handle.addEventListener('dblclick', () => {
        grid.style.setProperty(property, initial);
        try { localStorage.removeItem(key); } catch { /* Storage is optional. */ }
        handle.setAttribute('aria-valuenow', Math.round(width()));
    });
}
resizePane(document.querySelector('.master-layout'), document.querySelector('.tree-splitter'),
    document.querySelector('.lesson-tree'), '--tree-width', 'rosetta-tree-width', '195px', false, 140, 480);
resizePane(document.querySelector('.rosetta-layout'), document.querySelector('.example-splitter'),
    document.querySelector('.example-panel'), '--live-width', 'rosetta-live-width', '35%', true, 160, 240);

const inspectorButton = document.querySelector('.inspector-tool');
const exampleFrame = document.querySelector('.example-panel iframe');
let inspectorElement;
let inspectedApplication;
let opening;
let observer;

function disposeInspector() {
    inspectorElement?.dispose();
    inspectorElement?.remove();
    inspectorElement = null;
    inspectedApplication = null;
}
function watchExample() {
    observer?.disconnect();
    disposeInspector();
    const root = exampleFrame?.contentDocument?.getElementById('root');
    if (!root) return;
    observer = new MutationObserver(() => {
        if (inspectedApplication?._disposed) disposeInspector();
    });
    observer.observe(root, {childList: true, subtree: true});
}
async function openInspector() {
    if (inspectorElement && !inspectedApplication?._disposed) {
        inspectorElement.opened = !inspectorElement.opened;
        return;
    }
    const doc = exampleFrame?.contentDocument;
    const launcher = doc?.querySelector('.gramlot-inspector-launcher');
    if (!launcher) return;
    // Obtain the running application through the library's lazy inspector component.
    launcher.click();
    const original = await new Promise((resolve, reject) => {
        const existing = doc.querySelector('gramlot-inspector');
        if (existing) { resolve(existing); return; }
        const changes = new MutationObserver(() => {
            const component = doc.querySelector('gramlot-inspector');
            if (component) { clearTimeout(timeout); changes.disconnect(); resolve(component); }
        });
        const timeout = setTimeout(() => {
            changes.disconnect(); reject(new Error('Inspector is not available yet. Please try again.'));
        }, 5000);
        changes.observe(doc.body, {childList: true, subtree: true});
    });
    const application = original.application;
    await application.inspector.open();
    if (application._disposed) return;
    // Create in the example's realm so typed Bags and widgets keep their identity.
    // Connect to the master BEFORE initialization: moving an initialized component
    // would invoke its disposal lifecycle. Palette bounds now use the master document.
    const external = new original.constructor();
    external.application = application;
    external.setAttribute('presentation', 'floating');
    application.inspector.dispose();
    document.body.append(external);
    inspectorElement = external;
    inspectedApplication = application;
    try {
        await external.initialize();
        if (application._disposed) { disposeInspector(); return; }
        external.opened = true;
    } catch (error) { disposeInspector(); throw error; }
}
inspectorButton?.addEventListener('click', () => {
    if (opening) return;
    opening = openInspector().catch(error => {
        inspectorButton.title = error.message;
    }).finally(() => { opening = null; });
});
exampleFrame?.addEventListener('load', watchExample);
if (exampleFrame?.contentDocument?.readyState === 'complete') watchExample();
window.addEventListener('pagehide', () => { observer?.disconnect(); disposeInspector(); });
