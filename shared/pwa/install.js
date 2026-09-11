const button = document.getElementById('install-app');
let installPrompt;
window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    button.hidden = false;
});
button.addEventListener('click', async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    button.hidden = true;
    await prompt.prompt();
    await prompt.userChoice;
});
window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', {scope: '/', updateViaCache: 'none'})
        .catch(error => console.warn('App registration failed:', error));
}
