"""Serve a built React application using its generated route manifest."""
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


def mount_react(app, directory):
    directory = Path(directory).resolve()
    config = json.loads((directory / 'application.json').read_text())
    prefix = config['prefix']
    pages = set(config['pages'])
    app.mount(prefix + '/assets', StaticFiles(directory=directory / 'assets'),
              name=prefix + '-assets')
    router = APIRouter(prefix=prefix)

    @router.get('/')
    def index():
        return FileResponse(directory / 'index.html')

    @router.get('/{name}/')
    def page(name: str):
        if name not in pages:
            raise HTTPException(status_code=404)
        return FileResponse(directory / 'index.html')

    app.include_router(router)
