import Gradient from "./Gradient.mjs";

/**
 * The base class for all images
 */
export default class LinearGradient extends Gradient {
    constructor(options = {}) {
        super();

        let defaults = {
            x      : 0, y : 0,
            center : {
                x : options.context.canvas.width * 0.5,
                y : options.context.canvas.height * 0.5
            },
        };

        this.assignOptions(defaults, options);
        this.width  = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.resize();
    }

    recenter(x, y) {
        this.center.x = x;
        this.center.y = y;
        return this;
    }

    resize(width, height) {
        this.width         = width || this.width;
        this.height        = height || this.width;
        [this.x, this.y]   = this.getPointOnRect(this.width, this.height);
        [this.ix, this.iy] = this.getPointOnRect(this.width, this.height, true);
        this.gradient      = this.context.createLinearGradient(this.x, this.y, this.ix, this.iy);
        return this;
    }
}