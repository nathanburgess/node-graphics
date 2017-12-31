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

    fill(color) {
        this.fillColor = color;
        return this;
    }

    render(context) {
        context.save();
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}