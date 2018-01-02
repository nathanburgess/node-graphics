import Brush from "./BaseBrush.mjs";

/**
 * The Text Brush
 */
export default class Text extends Brush {
    constructor(options = {}) {
        super(options, {});
    }

    render() {
        super.preRender(this.context);

        super.postRender(this.context);
    }
}