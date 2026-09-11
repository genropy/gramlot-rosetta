"""Active lessons and their shared teaching descriptions."""
EXAMPLES = {'hello-world': 'Hello World', 'data-binding': 'Data binding', 'input-widgets': 'Input widgets', 'contact-box': 'Contact box', 'repeated-contacts': 'Repeated contacts', 'contact-colors': 'Contact colors'}
DESCRIPTIONS = {
    'contact-colors': 'Each contact now has a Title background color picker. Its value and the title bar background subscribe to the same relative Data field, ^.color. Choose a color to update that title bar immediately; every contact keeps its own color.',
    'repeated-contacts': 'An outer formlet arranges six contact boxes created by a loop. Each box owns a separate Data branch: c1, c2, through c6. The relative field bindings stay identical, so editing one contact leaves the others unchanged.',
    'contact-box': 'Group contact fields inside a labelled box. In Gramlot, the box sets datapath=contact and its fields use relative bindings such as ^.first_name. All four values belong to the contact branch of Data and update on focus out.',
    'input-widgets': 'Try text, number, date, time, checkbox and multiline inputs. Gramlot’s formlet arranges labelled widgets in two fixed columns; each widget binds to its own Data field. Text fields commit on focus out, and the checkbox commits when toggled. This lesson covers field layout and editing, without submission or persistence.',
    'hello-world': 'Start with a single heading. Compare how each framework declares the same page.',
    'data-binding': 'Compare the two independent fields: Live updates its heading as you type; On focus out updates only when you leave the field. In Gramlot, each heading subscribes to the same Data field as its textbox. Only the first textbox sets live=True.',
}
