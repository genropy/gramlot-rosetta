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
        'react_application': [
            'frontends/react/src/App.jsx', 'frontends/react/src/DataBinding.jsx',
            'frontends/react/src/InputWidgets.jsx', 'frontends/react/src/ContactBox.jsx',
            'frontends/react/src/RepeatedContacts.jsx', 'frontends/react/src/ContactColors.jsx',
        ],
        'vue_application': [
            'frontends/vue/src/App.vue', 'frontends/vue/src/DataBinding.vue',
            'frontends/vue/src/InputWidgets.vue', 'frontends/vue/src/ContactBox.vue',
            'frontends/vue/src/RepeatedContacts.vue', 'frontends/vue/src/ContactColors.vue',
        ],
        'pages_js_recipe': [
            'frontends/pages-js/recipe.js', 'frontends/pages-js/data-binding.js',
            'frontends/pages-js/input-widgets.js', 'frontends/pages-js/contact-box.js',
            'frontends/pages-js/repeated-contacts.js', 'frontends/pages-js/contact-colors.js',
        ],
        'pages_js_bootstrap': ['frontends/pages-js/app.js'],
        'shared_live_editor': ['shared/editor/editor.js'],
        'pages_recipe': [
            'frontends/pages/pages/hello-world.py', 'frontends/pages/pages/data-binding.py',
            'frontends/pages/pages/input-widgets.py', 'frontends/pages/pages/contact-box.py',
            'frontends/pages/pages/repeated-contacts.py', 'frontends/pages/pages/contact-colors.py',
        ],
        'pages_host_adapter': ['backend/pages_host.py'],
        'shared_backend': ['backend/app.py', 'backend/lesson_notes.py'],
        'shared_frame': ['backend/templates/frame.html', 'backend/templates/lesson.html',
                         'backend/templates/overview.html', 'shared/frame.css', 'shared/frame.js'],
        'shared_style': ['shared/style.css', 'shared/example.css', 'shared/contacts.css'],
        'shared_source_viewer': ['backend/source_browser.py',
                                 'backend/templates/sources.html', 'shared/sources.css'],
        'react_setup': ['frontends/react/src/main.jsx', 'frontends/react/index.html', 'frontends/react/vite.config.js',
                        'frontends/react/package.json'],
        'vue_setup': ['frontends/vue/src/main.js', 'frontends/vue/index.html', 'frontends/vue/vite.config.js',
                      'frontends/vue/package.json'],
        'nicegui_page': [
            'frontends/nicegui/page.py', 'frontends/nicegui/data_binding.py',
            'frontends/nicegui/input_widgets.py', 'frontends/nicegui/contact_box.py',
            'frontends/nicegui/repeated_contacts.py', 'frontends/nicegui/contact_colors.py',
        ],
        'nicegui_host': ['backend/nicegui_host.py'],
    }
    groups['shared_example_catalog'] = ['backend/examples.py']
    return {name: measure(root, paths) for name, paths in groups.items()}


if __name__ == '__main__':
    print(json.dumps(report(Path(__file__).resolve().parents[1]), indent=2))
