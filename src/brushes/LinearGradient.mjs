import Gradient from "./Gradient";

/**
 * The base class for all images
 */
export default class LinearGradient extends Gradient {
    constructor(options = {}) {
        super(options, {
            x      : 0, y : 0,
            center : {
                x : options.context.canvas.width * 0.5,
                y : options.context.canvas.height * 0.5
            },
        });
        this.resize(this.context.canvas.width, this.context.canvas.height);
    }
}