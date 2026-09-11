"""Short explanations of each implementation's executed lesson."""
LESSON_NOTES = {
    'hello-world': {
        'pages': 'Page.main() declares one heading in Python. The FastAPI adapter delivers this Source recipe to the Gramlot browser runtime, which renders the HTML; this example needs no Data fields.',
        'pages-js': 'root.h1() adds a heading to the Source tree directly in JavaScript. The browser runtime renders it; edit the recipe and press Run to try another greeting, or Reset to restore the original.',
        'react': 'The component returns a single h1 element using JSX. The shared React entry mounts it into the page; no state or event handler is needed for a fixed greeting.',
        'vue': 'The single-file component contains only a template with an h1 element. The shared Vue entry mounts that component; this fixed greeting needs no reactive state.',
        'nicegui': 'The Python page function declares an HTML heading through ui.html(). NiceGUI delivers the interface through its FastAPI integration; this first example has no editable state.',
    },
    'data-binding': {
        'pages': 'Each textbox and heading use the same ^ pointer to a Data field. live=True commits the first textbox while you type; the second uses the default focus-out commit. The Python recipe declares these connections, and Gramlot handles the updates in the browser.',
        'pages-js': 'Two Data fields keep the pairs independent. Each ^ pointer connects a heading and textbox to its field; live: true enables immediate updates on the first textbox, while the second commits on focus out. Run rebuilds the example from your edited recipe.',
        'react': 'Two useState values hold the committed messages. The live input uses value and onChange; the other uses defaultValue and onBlur, keeping its draft in the input until focus leaves. Updating either state refreshes its corresponding heading.',
        'vue': 'Two refs hold the messages. v-model updates the first ref as you type, while an explicit blur handler updates the second when focus leaves. Template interpolation displays each ref in its own heading.',
        'nicegui': 'A dictionary created for this page holds the two messages. bind_value keeps the live input connected to its entry; a blur callback commits the other input. Each heading binds to its entry, with text escaped before rendering as HTML.',
    },
    'input-widgets': {
        'pages': 'The formlet arranges six labelled widgets in two columns; it does not own their values. Each ^ binding points to a separate Data field. Text-like inputs commit on focus out, the checkbox commits when toggled, and Gramlot preserves the widgets’ typed values.',
        'pages-js': 'A formlet lays out six widgets, with each value bound to its own Data path. The widget determines the editor and value type; the formlet only handles layout. Open the inspector to see Data values after editing and leaving a field.',
        'react': 'CSS Grid arranges native inputs and a textarea. A shared handler copies each committed value into local state by field name, converting the number and checkbox values. Text fields commit on blur; the checkbox commits on change.',
        'vue': 'A reactive object stores the field values. v-model.lazy commits text-like fields on change, .number converts the quantity, and the checkbox uses ordinary v-model. CSS Grid supplies the two-column layout.',
        'nicegui': 'NiceGUI creates the input widgets inside a CSS Grid container. Blur callbacks copy values into a page-local dictionary, while the checkbox uses value binding. Date and time use native browser editors and are kept as strings in this example.',
    },
    'contact-box': {
        'pages': 'The labledBox sets datapath="contact", so ^.first_name and the other relative bindings resolve inside that Data branch. Its inner formlet lays out the fields. The contact-box CSS class provides the rounded border and dark title bar.',
        'pages-js': 'The box establishes the contact Data scope once. All four fields use relative ^. paths, so they inherit that scope without repeating contact in each binding. Shared CSS styles the box; the recipe describes its structure and connections.',
        'react': 'One local contact object holds the committed field values. The blur handler updates the property named by the input, and a section with the contact-box CSS class groups the fields visually. React uses explicit object properties rather than inherited Data paths.',
        'vue': 'The fields bind to properties of one reactive contact object using v-model.lazy. A section and heading form the visual group, styled by the shared contact-box class. Each binding explicitly names its contact property.',
        'nicegui': 'The page function creates a contact dictionary and groups four inputs in a styled section. Each blur callback updates one dictionary entry. The shared CSS class supplies the title bar and border; the section itself does not establish a data scope.',
    },
    'repeated-contacts': {
        'pages': 'The outer formlet arranges cards created by a for loop. contact_box() builds each card with a distinct datapath, c1 through c6; its relative field bindings stay identical. This is where a separate method becomes useful because the same block is reused.',
        'pages-js': 'The loop calls contactBox() six times inside an outer formlet. Each call assigns its own c1–c6 Data scope, while the helper reuses the same relative bindings. Editing one card therefore changes only that card’s Data branch.',
        'react': 'The loop builds six keyed sections. State is grouped under c1–c6, and each card’s handler captures its key before updating that part of the state. Stable React keys identify the sections; CSS Grid arranges them.',
        'vue': 'A loop initializes six contact objects, then v-for renders one section for each index. Every binding names the corresponding c1–c6 object, and :key identifies the section. CSS Grid controls how many cards fit across the panel.',
        'nicegui': 'A Python loop creates six sections with separate dictionaries. Each callback captures its own contact through a default argument, so later edits update the intended dictionary rather than the final loop item. CSS Grid arranges the sections.',
    },
    'contact-colors': {
        'pages': 'Each card initializes its own color field. The picker and label_background both bind to ^.color, so live=True updates only that card’s title bar as a color is selected. The existing relative bindings for contact details remain unchanged.',
        'pages-js': 'The helper initializes c1.color through c6.color and connects each picker and title background to the relative ^.color path. live: true commits color changes immediately. The shared CSS supplies the default appearance without overriding the bound title color.',
        'react': 'Each contact object gains a color property. The native color input updates it through onChange, and the heading reads it through an inline backgroundColor style. All other presentation remains in shared CSS, and the card key keeps the state independent.',
        'vue': 'Each reactive contact starts with a dark color. The color input uses v-model, and the heading’s :style reads that same contact’s color. Vue updates the title background when the value changes, while shared CSS handles the rest of the card.',
        'nicegui': 'Each color input has a callback that captures its contact dictionary and heading. A color change updates both the stored color and that heading’s background style. The body of the card keeps its original background.',
    },
}

# Compare the displayed recipes, not the full capabilities of each ecosystem.
LESSON_COMPARISONS = {
    'hello-world': {
        'react': 'There is no meaningful semantic advantage for Gramlot in this example: both declare one heading. JSX expresses the result directly. Differences in imports, startup or syntax do not make this fixed page simpler in a substantive way.',
        'vue': 'There is no clear simplicity advantage for Gramlot here. Vue’s template and Gramlot’s heading declaration both describe the same static element. This lesson does not exercise Data scopes, bindings or other features that could distinguish their semantics.',
        'nicegui': 'Both examples declare a heading from Python, with very little page code. This static example provides no evidence that Gramlot is semantically simpler; differences in hosting belong to the shared setup rather than to the heading itself.',
    },
    'data-binding': {
        'react': 'Gramlot uses one Data pointer for reading and writing, with live=True selecting the commit timing. This removes the explicit setter callbacks used by this React recipe. React can package those callbacks in reusable components, but those components must be written or adopted. Gramlot includes this binding and commit policy out of the box; no additional component is needed.',
        'vue': 'Vue already offers concise declarative binding through v-model. Gramlot adds a uniform Data-path notation and a widget-level live option; the displayed Vue recipe uses a blur handler for the second field. This is a modest difference in how commit policy is expressed, not a general advantage over Vue reactivity.',
        'nicegui': 'NiceGUI already provides declarative value and content bindings. Gramlot uses the same ^ path notation for the input and heading, and makes focus-out versus live editing a widget setting. That avoids the custom blur callback in this recipe; it does not make NiceGUI’s binding facilities less capable.',
    },
    'input-widgets': {
        'react': 'Gramlot’s widgets supply value typing, commit behavior and label decoration alongside formlet layout. The displayed React recipe implements conversion and commit handling around native inputs. This integration reduces page-level policy code in Gramlot; a React form library or shared components could supply comparable abstractions, but they are additional code or dependencies to choose and maintain. Gramlot supplies these behaviors out of the box.',
        'vue': 'Vue’s v-model modifiers already handle much of the input binding concisely. Gramlot combines typed widgets, labels and formlet layout in one authoring model. The concrete difference here is that integrated widget contract; fewer declarations alone would not establish a semantic advantage. The date/time representations also differ between these recipes.',
        'nicegui': 'Both provide Python-authored widgets, so widget availability is not a Gramlot advantage here. Gramlot combines Data-path binding and the default commit policy with a formlet layout. The displayed NiceGUI version uses a grid and explicit blur callbacks; those callbacks can be factored into reusable application code, but Gramlot’s scope and commit policy do not require that extra code.',
    },
    'contact-box': {
        'react': 'Gramlot’s container establishes a Data scope: its children can use relative paths without naming the contact object. This React recipe names state properties and uses a commit handler. A reusable React component could accept a contact and an update callback, but that abstraction must be added. Gramlot includes scope inheritance in the container model, so the page needs no extra component to obtain it.',
        'vue': 'Both group fields around one contact. Gramlot declares the scope on the box and resolves relative bindings beneath it; this Vue template refers to contact properties explicitly. Vue could encapsulate the group as a component, but that is an additional abstraction to author. Gramlot already supplies inherited Data scope through the container; visual grouping and CSS alone are not the advantage.',
        'nicegui': 'The NiceGUI section groups the UI, while callbacks separately identify the contact dictionary. In Gramlot, the box also establishes the Data scope used by all children. This joins visual composition and relative binding in one declaration; NiceGUI can hide its explicit dictionary wiring in a reusable function, but that function is additional application code. Gramlot includes the scope behavior directly in the container.',
    },
    'repeated-contacts': {
        'react': 'The Gramlot helper reuses unchanged relative bindings because each call supplies a new container datapath. This React recipe captures a key and explicitly updates the corresponding nested state. A React Contact component could encapsulate that work, but it would be an additional component to implement. Gramlot’s helper only composes widgets: scope propagation already comes from the framework and requires no custom binding component.',
        'vue': 'Vue’s v-for already makes repeated UI concise. Gramlot’s relative field paths stay unchanged as each card receives a different datapath; this Vue recipe indexes the contact object in each binding. Extracting a Vue card component could remove that repetition, but would add a component and its data interface. Gramlot provides inherited scope out of the box; its card helper only groups declarations. Vue already includes repetition through v-for.',
        'nicegui': 'Both use a Python loop. In this NiceGUI recipe, callbacks must capture the correct dictionary for each iteration; Gramlot’s helper declares the card’s datapath and its fields inherit it. That removes per-field callback capture here. A shared NiceGUI card function could centralize the same wiring, but the capture and update logic would remain application code. Gramlot supplies that binding behavior directly; its helper only composes the card.',
    },
    'contact-colors': {
        'react': 'Gramlot connects the picker and title background with the same relative Data path, without a color-specific callback. React combines a state update with a declarative backgroundColor style. Both are reactive; Gramlot’s simpler point here is the uniform binding notation across widget values and presentation attributes.',
        'vue': 'This example shows close semantic parity: Vue binds the picker with v-model and the heading with :style, while Gramlot binds both through ^.color. Gramlot preserves the same relative scope notation, but neither recipe needs an explicit color-change callback. There is no strong simplicity advantage to claim here.',
        'nicegui': 'The displayed NiceGUI callback updates both the stored color and the heading style. Gramlot declares a shared Data binding for the picker and label background, so the dependency is expressed once as a path rather than maintained by a callback. In Gramlot this is built-in behavior, with no extra callback or custom component to maintain. This comparison concerns the displayed recipe, not every binding approach available in NiceGUI.',
    },
}
