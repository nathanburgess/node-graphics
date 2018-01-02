import Brush from "./BaseBrush.mjs";

/**
 * The Rectangle Brush
 */
export default class Printer extends Brush {
    constructor(options = {}) {
        super(options, {});
    }

    render() {
        super.preRender(this.context);

        super.postRender(this.context);
    }
}