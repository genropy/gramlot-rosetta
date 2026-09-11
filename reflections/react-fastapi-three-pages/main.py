from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
app = FastAPI()
dist = Path(__file__).parent / 'frontend/dist'
app.mount('/page/assets', StaticFiles(directory=dist / 'assets'), name='page-assets')
@app.get('/page/')
def page_index():
    return FileResponse(dist / 'index.html')
@app.get('/page/{name}/')
def page_document(name: str):
    if name not in {'hello', 'alfa', 'beta'}:
        raise HTTPException(status_code=404)
    return FileResponse(dist / 'index.html')
