import Brush from "./BaseBrush.mjs";

/**
 * The base class for all images
 */
export default class Rectangle extends Brush {
    constructor(options = {}) {
        super();

        let defaults = {};

        this.assignOptions(defaults, options);
    }

    render(context) {
        super.preRender(context);

        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
        context.stroke();

        super.postRender(context);
    }
}