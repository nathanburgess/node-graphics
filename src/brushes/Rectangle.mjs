import Brush from "./BaseBrush.mjs";
import LinearGradient from "./LinearGradient.mjs";

/**
 * The Rectangle Brush
 */
export default class Rectangle extends Brush {
    constructor(options = {}) {
        super(options, {});
    }

    paint() {
        this.context.beginPath();
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
        this.context.closePath();
    }
}