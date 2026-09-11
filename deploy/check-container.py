"""Probe the actual image before publishing it; no optional demo assumptions."""
import json
import sys
import time
import urllib.error
import urllib.request

base = sys.argv[1].rstrip('/')
for attempt in range(30):
    try:
        with urllib.request.urlopen(base + '/health', timeout=2) as response:
            health = json.load(response)
        assert health['status'] == 'ok'
        assert health['runtime']['channel'] == 'unpublished-wheel'
        break
    except (OSError, ValueError):
        if attempt == 29:
            raise
        time.sleep(1)
for path in ('/overview/', '/pages/hello-world/', '/pages-js/hello-world/',
             '/react/hello-world/', '/vue/hello-world/', '/nicegui/hello-world/'):
    with urllib.request.urlopen(base + path, timeout=5) as response:
        assert response.status == 200, path
        assert 'text/html' in response.headers['Content-Type'], path
for path in ('/.env', '/server.py', '/_server/'):
    try:
        urllib.request.urlopen(base + path, timeout=5)
    except urllib.error.HTTPError as error:
        assert error.code == 404, path
    else:
        raise AssertionError('Private path is public: ' + path)
print('PASS container health, six public pages and private-path boundaries')
