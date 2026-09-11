# Reflections and standalone experiments

Working examples and design notes for understanding framework authoring and host
integration. These experiments are separate from the main Rosetta gallery: they
have their own dependencies, commands and lifecycle, and add no gallery routes.
They are evidence for discussion, not automatically approved framework APIs.

- [React + FastAPI: three pages](react-fastapi-three-pages/README.md): the complete
  runnable baseline for comparing the work required of a FastAPI developer.

Keep application-specific code, shared bootstrap and generated artifacts distinct
when comparing implementations. Record what runs, what was verified and what is
still a proposal. Do not interpret this one minimal implementation as the only
way to use React.

- [Shared FastAPI + React integration](fastapi_react/README.md): common hosting,
  bootstrap and build reused by two independent applications, with one page
  registry per application.

- [Shared FastAPI + Gramlot integration](fastapi_gramlot/README.md): the parallel
  Python-page example using the installed optional Gramlot adapter and automatic
  discovery, without per-application main.py or JSON.
