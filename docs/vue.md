# Vue implementation

The Vue variant is a small Vite application using Vue's Composition API and a
single-file component. It is built with a `/vue/` base path so the shared FastAPI
server can serve `frontends/vue/dist` at `/vue/`.

## Install and build

From the repository root:

```sh
cd frontends/vue
npm install
npm run build
```

Then return to the repository root and run the integrated demo:

```sh
./scripts/run.sh
```

Open `http://127.0.0.1:8026/vue/`. For frontend-only development, run
`npm run dev`. The Vite development server still expects the shared API at
`/api`; configure a local proxy or use the built application through FastAPI.

## Dependencies and limitations

Exact dependency versions are recorded in `package.json` and
`package-lock.json`. The implementation uses ordinary native form controls and
the shared `/shared/style.css`; it adds no router or UI component library.

The three variants intentionally share one in-memory backend, so saving or
resetting in one variant affects the others. Data persists only for the lifetime
of the FastAPI process. The standalone Vite development command does not provide
or automatically proxy that backend.
