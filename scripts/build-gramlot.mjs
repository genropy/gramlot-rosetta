import {createHash} from 'node:crypto';
import {chmod, cp, mkdir, mkdtemp, readFile, rename, rm, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(process.env.GRAMLOT_ROSETTA_OUTPUT || join(root, 'shared/gramlot'));
let packageRoot = process.env.GRAMLOT_ROSETTA_PACKAGE_ROOT;
if (!packageRoot) {
    const python = process.env.GRAMLOT_ROSETTA_PYTHON || join(root, '.venv/bin/python');
    const found = spawnSync(python, ['-c', 'import pathlib, gramlot; print(pathlib.Path(gramlot.__file__).resolve().parent)'], {encoding: 'utf8'});
    if (found.status !== 0) throw new Error(found.stderr || 'Cannot locate the installed Gramlot package.');
    packageRoot = found.stdout.trim();
}

const browserRoot = join(resolve(packageRoot), 'resources/browser');
const browserManifest = JSON.parse(await readFile(join(browserRoot, 'manifest.json'), 'utf8'));
if (browserManifest.schemaVersion !== 1 || !/^[0-9a-f]{16,64}$/.test(browserManifest.buildId)) {
    throw new Error('The installed Gramlot browser manifest is not supported.');
}

await mkdir(outputRoot, {recursive: true});
const staging = await mkdtemp(join(outputRoot, '.staging-'));
await cp(browserRoot, staging, {recursive: true});

// Rosetta owns these small consumers. Bare Gramlot imports are resolved by the
// copied framework import map, so the framework browser files remain byte-identical.
await mkdir(join(staging, 'consumer/builder'), {recursive: true});
await cp(join(root, 'frontends/pages-js/app.js'), join(staging, 'consumer/lab-app.js'));
await cp(join(root, 'shared/builder'), join(staging, 'consumer/builder'), {recursive: true});

for (const file of browserManifest.files) {
    const bytes = await readFile(join(staging, file.path));
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (digest !== file.sha256) throw new Error(`Copied Gramlot browser asset changed: ${file.path}`);
}

const entries = {
    ...browserManifest.entryPoints,
    startup: browserManifest.entryPoints['gramlot-page-startup'],
    'lab-app': 'consumer/lab-app.js',
    'builder-app': 'consumer/builder/app.js',
};
const version = browserManifest.buildId;
const versionDirectory = join(outputRoot, version);
await rm(versionDirectory, {recursive: true, force: true});
// mkdtemp creates a private root; the runtime container serves as uid 10001.
await chmod(staging, 0o755);
await rename(staging, versionDirectory);
const temporaryManifest = join(outputRoot, `.manifest-${process.pid}.json`);
await writeFile(temporaryManifest, JSON.stringify({version, entries}, null, 2) + '\n');
await rename(temporaryManifest, join(outputRoot, 'manifest.json'));
console.log(`Gramlot production assets: browser ${version}, plus Rosetta consumers`);
