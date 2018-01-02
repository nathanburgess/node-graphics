import Gradient from "./Gradient.mjs";

/**
 * The base class for all images
 */
export default class RadialGradient extends Gradient {
    constructor(options = {}) {
        super();

        let defaults = {};

        this.assignOptions(defaults, options);
    }

    render(context) {
        super.preRender(context);

        console.log("Rendering a Linear Gradient");

        super.postRender(context);
    }
}