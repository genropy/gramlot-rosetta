from pathlib import Path
from fastapi import FastAPI
from common.hosting import mount_react

app = FastAPI()
mount_react(app, Path(__file__).parent / 'dist')
