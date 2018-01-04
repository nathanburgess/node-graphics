import Brush from "./BaseBrush.mjs";

/**
 * The Text Brush
 */
export default class Text extends Brush {
    constructor(options = {}) {
        super(options, {});
    }

    calculateSize() {
        this.context.font = this.font;
        let bounds        = this.context.measureText(this.string);
        this.width        = bounds.width;
        this.height       = bounds.actualBoundingBoxDescent - bounds.actualBoundingBoxAscent;
    }

    at(x, y) {
        this.x = x;
        this.y = y;

        this.calculateSize();

        // Calculate the Brush's position if X and/or Y are words
        [this.x, this.y] = this.getPositionFromWord(this.x, this.y);

        // Calculate the bounding box
        this.calculateMaxBounds();

        return this;
    }

    paint() {
        this.context.font = this.font;
        this.context.fillText(this.string, this.x, this.y);
    }
}