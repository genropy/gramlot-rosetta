"""Report physical, nonblank source lines and bytes with explicit cost boundaries.

This is an inventory, not a readability score or a performance benchmark.
Generated output, lockfiles, dependencies and framework internals are excluded.
"""
import json
from pathlib import Path


def measure(root, names):
    entries = []
    for name in names:
        path = root / name
        text = path.read_text()
        entries.append({
            'file': name,
            'nonblank_lines': sum(bool(line.strip()) for line in text.splitlines()),
            'bytes': len(text.encode()),
        })
    return {'files': entries,
            'nonblank_lines': sum(item['nonblank_lines'] for item in entries),
            'bytes': sum(item['bytes'] for item in entries)}


def report(root):
    groups = {
        'react_application': ['frontends/react/src/App.jsx'],
        'vue_application': ['frontends/vue/src/App.vue'],
        'pages_js_recipe': ['frontends/pages-js/recipe.js'],
        'pages_js_bootstrap': ['frontends/pages-js/app.js'],
        'shared_live_editor': ['shared/editor/editor.js'],
        'pages_recipe': ['frontends/pages/recipe.py'],
        'pages_bootstrap': ['frontends/pages/app.js'],
        'pages_host_adapter': ['backend/pages_host.py'],
        'pages_browser_adapter': ['frontends/pages/module.js'],
        'shared_backend': ['backend/app.py'],
        'shared_frame': ['backend/templates/frame.html', 'shared/frame.css'],
        'shared_style': ['shared/style.css', 'shared/example.css'],
        'shared_source_viewer': ['backend/source_browser.py',
                                 'backend/templates/sources.html', 'shared/sources.css'],
        'react_setup': ['frontends/react/src/main.jsx', 'frontends/react/index.html', 'frontends/react/vite.config.js',
                        'frontends/react/package.json'],
        'vue_setup': ['frontends/vue/src/main.js', 'frontends/vue/index.html', 'frontends/vue/vite.config.js',
                      'frontends/vue/package.json'],
        'pages_setup': ['frontends/pages/index.html'],
    }
    return {name: measure(root, paths) for name, paths in groups.items()}


if __name__ == '__main__':
    print(json.dumps(report(Path(__file__).resolve().parents[1]), indent=2))
