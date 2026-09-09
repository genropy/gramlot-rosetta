import {GramlotBuilder} from '/pages/assets/pages/builder.js';
import '/_assets/dom/collections/forms.js';

// Shared collection selection for Python source and native JavaScript recipes.
export class RosettaBuilder extends GramlotBuilder {
    static wc_requires = [...GramlotBuilder.wc_requires, 'forms'];
}
