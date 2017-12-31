/**
 * The base class for all brushes
 */
export default class BaseBrush {
    constructor(options = {}) {
        this.color       = "white";
        this.borderColor = "transparent";
        this.borderSize  = 0;

        let defaults = {};
        Object.assign(this, defaults, options);
    }

    assignOptions(defaults, options) {
        this.context = options.context;
        Object.assign(this, defaults, options);
    }

    fill(color) {
        this.color = color;
        return this;
    }

    border(color, size) {
        this.borderColor = color;
        this.borderSize  = size;
        return this;
    }

    preRender(context) {
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.borderSize;
    }

    postRender(context) {
        context.restore();
    }
}