import Brush from "./BaseBrush.mjs";
import LinearGradient from "./LinearGradient.mjs";

/**
 * The base class for all images
 */
export default class Rectangle extends Brush {
    constructor(options = {}) {
        super();

        let defaults = {
            borderRadius : 0
        };

        this.assignOptions(defaults, options);
    }

    render() {
        super.preRender(this.context);

        this.context.beginPath();
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        super.postRender(this.context);
    }
}