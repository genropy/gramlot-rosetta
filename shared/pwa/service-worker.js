/* Keep recipes, application state and runtime assets on the live server.
   An installed window gets a useful recovery page when that server is down. */
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
    if (event.request.mode !== 'navigate' || event.request.method !== 'GET') return;
    event.respondWith(fetch(event.request).catch(() => new Response(`<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rosetta · Server unavailable</title>
<style>body{margin:0;background:#f3f5f8;color:#26344b;font:16px/1.6 system-ui}main{max-width:520px;margin:15vh auto;padding:28px}h1{font-size:26px}a{color:#1d3eb1}</style>
<main><h1>Rosetta is waiting for its server</h1>
<p>Start the Rosetta server at the same address, then try again. Installing the app does not include the Python server.</p>
<p><a href="">Try again</a> · <a href="/overview/">Open overview</a></p></main></html>`,
        {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}})));
});
