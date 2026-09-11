import {createHash} from 'node:crypto';
import {chmod, cp, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(process.env.GRAMLOT_ROSETTA_OUTPUT || join(root, 'shared/gramlot'));
let packageRoot = process.env.GRAMLOT_ROSETTA_PACKAGE_ROOT;
if (!packageRoot) {
    const python = process.env.GRAMLOT_ROSETTA_PYTHON || join(root, '.venv/bin/python');
    const found = spawnSync(python, ['-c', 'import pathlib, gramlot; print(pathlib.Path(gramlot.__file__).resolve().parent)'], {encoding: 'utf8'});
    if (found.status !== 0) throw new Error(found.stderr || 'Cannot locate the installed Gramlot package.');
    packageRoot = found.stdout.trim();
}
packageRoot = resolve(packageRoot);
const resources = join(packageRoot, 'resources');
const pages = join(resources, 'pages');
const dom = join(resources, 'gramlot-dom/src');
const bag = join(resources, 'genro-bag-js/src');
const tytx = join(resources, 'genro-tytx/js/src');
const msgpack = join(resources, 'genro-tytx/js/node_modules/@msgpack/msgpack/dist.esm');

const aliases = new Map([
    ['gramlot-dom', join(dom, 'index.js')],
    ['gramlot-builder', join(pages, 'builder.js')],
    ['genro-bag-js', join(bag, 'index.js')],
    ['#uuid', join(bag, 'browser-uuid.js')],
    ['genro-tytx', join(tytx, 'index.js')],
    ['decimal.js', join(resources, 'decimal.js/decimal.mjs')],
    ['@msgpack/msgpack', join(msgpack, 'index.mjs')],
    ['@xmldom/xmldom', join(pages, 'xmldom.js')],
    ['module', join(packageRoot, 'contrib/fastapi/frontend/module.js')],
]);
const aliasPlugin = {
    name: 'installed-gramlot',
    setup(builder) {
        builder.onResolve({filter: /.*/}, args => {
            if (args.path.startsWith('/_assets/dom/')) return {path: join(dom, args.path.slice('/_assets/dom/'.length))};
            if (args.path.startsWith('genro-tytx/')) return {path: join(tytx, args.path.slice('genro-tytx/'.length))};
            const path = aliases.get(args.path);
            return path ? {path} : null;
        });
    },
};

await mkdir(outputRoot, {recursive: true});
const staging = await mkdtemp(join(outputRoot, '.staging-'));
const entries = {
    startup: join(packageRoot, 'contrib/fastapi/frontend/entry.js'),
    'lab-app': join(root, 'frontends/pages-js/app.js'),
    'builder-app': join(root, 'shared/builder/app.js'),
    'gramlot-dom': aliases.get('gramlot-dom'),
    'gramlot-builder': aliases.get('gramlot-builder'),
    'genro-bag-js': aliases.get('genro-bag-js'),
    'genro-tytx': aliases.get('genro-tytx'),
    decimal: aliases.get('decimal.js'),
    msgpack: aliases.get('@msgpack/msgpack'),
    module: aliases.get('module'),
    'inspector-component': join(pages, 'inspector-component.js'),
    'inspector-editor': join(pages, 'inspector-editor.js'),
};
await build({entryPoints: entries, outdir: staging, bundle: true, splitting: true, format: 'esm',
    platform: 'browser', target: ['es2022'], minify: true, keepNames: true, sourcemap: false,
    entryNames: '[name]', chunkNames: 'chunks/[name]-[hash]', assetNames: 'assets/[name]-[hash]',
    plugins: [aliasPlugin], logLevel: 'info'});
await mkdir(join(staging, 'chunks'), {recursive: true});
for (const name of ['inspector.tytx', 'inspector-embedded.tytx', 'inspector.css', 'inspector-theme.css']) {
    await cp(join(pages, name), join(staging, name));
    // esbuild may place a shared class containing import.meta.url in chunks/.
    // Keeping the fixed adapter resources at both bases preserves that URL contract.
    await cp(join(pages, name), join(staging, 'chunks', name));
}

async function files(directory, prefix = '') {
    const result = [];
    for (const entry of await readdir(directory, {withFileTypes: true})) {
        const relative = join(prefix, entry.name);
        if (entry.isDirectory()) result.push(...await files(join(directory, entry.name), relative));
        else result.push(relative);
    }
    return result;
}
const built = (await files(staging)).sort();
const hash = createHash('sha256');
for (const name of built) hash.update(name).update('\0').update(await readFile(join(staging, name)));
const version = hash.digest('hex').slice(0, 16);
const versionDirectory = join(outputRoot, version);
await rm(versionDirectory, {recursive: true, force: true});
// mkdtemp uses 0700; the final container serves files as an unprivileged user.
await chmod(staging, 0o755);
await rename(staging, versionDirectory);
const entryMap = Object.fromEntries(Object.keys(entries).map(name => [name, `${name}.js`]));
const temporaryManifest = join(outputRoot, `.manifest-${process.pid}.json`);
await writeFile(temporaryManifest, JSON.stringify({version, entries: entryMap}, null, 2) + '\n');
await rename(temporaryManifest, join(outputRoot, 'manifest.json'));
console.log(`Gramlot production assets: ${built.length} files, version ${version}`);
