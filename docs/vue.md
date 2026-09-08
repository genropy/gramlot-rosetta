# Vue implementation

The Vue variant is a small Vite application using Vue's Composition API and a
single-file component. It is built with a `/vue/` base path so the shared FastAPI
server can serve `frontends/vue/dist` at `/vue/`.

## Install and build

From the repository root:

```sh
cd frontends/vue
npm ci
npm run build
```

Then return to the repository root and run the integrated demo:

```sh
./scripts/run.sh
```

Open `http://127.0.0.1:8026/vue/`. For frontend development, keep the shared
FastAPI server running on port 8026 and run `npm run dev` in `frontends/vue`.
Vite proxies `/api` and `/shared` to that server.

## Dependencies and limitations

Exact dependency versions are recorded in `package.json` and
`package-lock.json`. The implementation uses ordinary native form controls and
the shared `/shared/style.css`; it adds no router or UI component library.

The three variants intentionally share one in-memory backend, so saving or
resetting in one variant affects the others. Data persists only for the lifetime
of the FastAPI process. The Vite development command depends on the shared
FastAPI server running at `http://127.0.0.1:8026`.
