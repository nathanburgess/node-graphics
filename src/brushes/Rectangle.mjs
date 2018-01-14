import Brush from "./BaseBrush";
import LinearGradient from "./LinearGradient";

/**
 * The Rectangle Brush
 */
export default class Rectangle extends Brush {
    constructor(options = {}) {
        super(options, {});
    }

    paint() {
        this.context.beginPath();
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);
        this.context.closePath();
    }
}