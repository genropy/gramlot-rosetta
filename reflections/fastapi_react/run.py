"""Combined demonstration; each application can also run independently."""
from pathlib import Path
from fastapi import FastAPI
from common.hosting import mount_react

app = FastAPI()
root = Path(__file__).parent
mount_react(app, root / 'applications/example/dist')
mount_react(app, root / 'applications/other/dist')
