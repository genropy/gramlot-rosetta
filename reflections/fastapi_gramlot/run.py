"""Optional demonstration: two discovered page collections on existing FastAPI."""
from pathlib import Path

from fastapi import FastAPI
from gramlot.contrib.fastapi import mount_gramlot

app = FastAPI()
directory = Path(__file__).parent / 'applications'
mount_gramlot(app, directory / 'example')
mount_gramlot(app, directory / 'other', prefix='/other')
