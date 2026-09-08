# React implementation

The React variant is a small Vite application served by the shared FastAPI process at `/react/`. It uses native form controls, React hooks for saved and draft state, and the shared `/shared/style.css` stylesheet.

## Install and build

From `frontends/react`:

```sh
npm install
npm run build
```

The production output is `frontends/react/dist`. The Vite base is `/react/`, so FastAPI can mount that directory at the matching URL. For development, start the shared FastAPI server on port 8000, then run:

```sh
npm run dev
```

Vite proxies `/api` and `/shared` to `http://127.0.0.1:8000`.

## Scope and limitations

This implementation intentionally has no router, grid, editable rows, WebSocket connection, authentication, or client-side validation. Validation messages come from the shared server. Draft edits live only in component state until a successful save, and navigation between the three variants performs a normal page load.
