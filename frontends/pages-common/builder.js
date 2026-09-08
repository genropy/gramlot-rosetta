import {GalleryBuilder} from '/pages/assets/pages/gallery.js';
import '/_assets/dom/collections/forms.js';

// Shared collection selection for Python source and native JavaScript recipes.
export class RosettaBuilder extends GalleryBuilder {
    static wc_requires = [...GalleryBuilder.wc_requires, 'forms'];
}
