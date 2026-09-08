# Active baseline: progressive binding gallery

Seven autonomous cumulative examples are available in React, Vue, Pages Python
and Pages JS: static Hello World, editable text, text color, background color,
font size, font family, and bold/italic. Text commits on blur; visual controls
update during interaction. Each example includes its actual source.

The shared HTML frame preserves example selection across implementations.
Page, Boilerplate and Common separate application code from shared context.
Pages JS retains the dark CodeMirror editor with Live, Focus out and Manual
modes. Both Pages variants retain the library Inspector and include a brief
invitation to observe Data in the interactive examples.

Validation: both frontend production builds, 15 Python tests, Ruff and 37 browser
tests passed. Browser coverage checks every progressive example's behavior,
source text, mobile overflow, and existing editor/inspector contracts. A direct
inspection also verified that the Data tree holds the value committed by input.

No library changes or new widgets were introduced by the demo. Pages now consumes
the coordinator-verified widget lbl contract and editable inspector from the local
assembly. textBox/colorpicker/filteringSelect/checkbox replace native controls;
the range remains native because horizontalSlider lacks min/max/step forwarding.
Orders remains in standby. Dual-view state sharing, minimal Genro ASGI hosting
and remote examples are later work.
