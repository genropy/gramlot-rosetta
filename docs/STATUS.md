# Active baseline: Hello World

React, Vue and Genro Pages each render a title and a greeting inside the same
plain HTML frame. Navigation, the example menu and source links belong to the
frame. The source viewer shows each application and exposes shared files
separately.

Validation: both frontend production builds, 14 Python tests, Ruff and 6 browser
tests passed. Browser contracts cover every implementation, source display,
frame isolation and mobile overflow.

Orders is on standby in standby/orders, including its source, seed data, tests
and earlier reports. The active server does not expose its API.

Next directions are recorded in EVOLUTION.md. Input and style examples, the
minimal Genro ASGI host, and a library-shipped FastAPI adapter are not implemented
in this baseline.
