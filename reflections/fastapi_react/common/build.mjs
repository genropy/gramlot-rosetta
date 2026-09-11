import {build} from 'vite';
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {dirname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const applications = resolve(root, 'applications');
const selected = process.argv.slice(2);
const names = selected.length ? selected : (await readdir(applications, {withFileTypes:true})).filter(e => e.isDirectory()).map(e => e.name);
for (const name of names) {
  if (!/^[a-z][a-z0-9_-]*$/.test(name)) throw Error(`Invalid application name: ${name}`);
  const directory = resolve(applications, name);
  const config = JSON.parse(await readFile(resolve(directory, 'application.json'), 'utf8'));
  if (!/^\/[a-z][a-z0-9_/-]*[a-z0-9]$/.test(config.prefix) || config.prefix.includes('//')) throw Error('Use an absolute prefix without a trailing slash');
  const entries = Object.entries(config.pages);
  if (!entries.length) throw Error('At least one page is required');
  const imports = entries.map(([key, page], i) => {
    if (!/^[a-z][a-z0-9_-]*$/.test(key) || key === 'assets') throw Error(`Invalid page: ${key}`);
    const source = resolve(directory, page.source);
    if (!source.startsWith(directory + sep)) throw Error('Page source must belong to the application');
    return `import Page${i} from ${JSON.stringify(source)};`;
  }).join('\n');
  const virtual = '\0virtual:application';
  const output = resolve(directory, 'dist');
  await build({root:resolve(root, 'common/frontend'), configFile:false, base:config.prefix+'/',
    plugins:[{name:'application-registry',
      resolveId(id) { if (id === 'virtual:application') return virtual; },
      load(id) { if (id === virtual) return imports + `\nexport const config=${JSON.stringify(config)};\nexport const pages={${entries.map(([key],i)=>JSON.stringify(key)+':Page'+i).join(',')}};`; }
    }],
    build:{outDir:output, emptyOutDir:true}
  });
  await writeFile(resolve(output, 'application.json'), JSON.stringify({prefix:config.prefix,pages:entries.map(([key])=>key)},null,2)+'\n');
}
