"""The comparison shell is shared HTML; framework applications stay isolated."""
import pytest
from fastapi.testclient import TestClient

from backend.app import DemoServer


@pytest.mark.parametrize('variant', ['react', 'vue', 'pages', 'pages-js', 'nicegui'])
def test_shared_frame_routes_to_one_example(variant):
    client = TestClient(DemoServer(pages=False).app)
    response = client.get(f'/{variant}/')
    assert response.status_code == 200
    assert 'src="/shared/frame.js"' in response.text
    assert f'src="/examples/{variant}/hello-world/"' in response.text
    assert 'Lesson 01' in response.text
    assert 'Editable text' not in response.text
    assert '<input' not in response.text


def test_order_api_is_not_part_of_the_active_demo():
    client = TestClient(DemoServer(pages=False).app)
    assert client.get('/api/orders').status_code == 404
    assert client.get('/unknown/').status_code == 404


def test_overview_and_setup_are_in_the_shared_master():
    client = TestClient(DemoServer(pages=False).app)
    assert client.get('/').url.path == '/overview/'
    for variant in ['pages', 'pages-js', 'react', 'vue', 'nicegui', 'common']:
        response = client.get(f'/overview/{variant}/')
        assert response.status_code == 200
        assert 'Groups and lessons' in response.text
        assert 'Simple examples' in response.text
        assert 'overview-source' in response.text
    assert client.get('/overview/unknown/').status_code == 404


@pytest.mark.parametrize('variant', ['react', 'vue', 'pages', 'pages-js', 'nicegui'])
@pytest.mark.parametrize('example', ['hello-world', 'data-binding', 'input-widgets', 'contact-box', 'repeated-contacts', 'contact-colors'])
def test_each_lesson_has_its_own_implementation_note(variant, example):
    from html import escape
    from backend.lesson_notes import LESSON_NOTES
    client = TestClient(DemoServer(pages=False).app)
    document = client.get(f'/{variant}/{example}/').text
    assert f'How it works · {DemoServer.TITLES[variant]}' in document
    assert escape(LESSON_NOTES[example][variant]) in document
    assert document.index('class="lesson-note"') > document.index('class="rosetta-layout"')


@pytest.mark.parametrize('variant', ['react', 'vue', 'pages', 'pages-js', 'nicegui'])
@pytest.mark.parametrize('example', ['hello-world', 'data-binding', 'input-widgets', 'contact-box', 'repeated-contacts', 'contact-colors'])
def test_comparisons_are_specific_to_other_implementations(variant, example):
    from html import escape
    from backend.lesson_notes import LESSON_COMPARISONS
    client = TestClient(DemoServer(pages=False).app)
    document = client.get(f'/{variant}/{example}/').text
    if variant in ('react', 'vue', 'nicegui'):
        assert escape(LESSON_COMPARISONS[example][variant]) in document
        assert document.index('aria-label="How it compares"') > document.index('aria-label="How it works"')
    else:
        assert 'aria-label="How it compares"' not in document
