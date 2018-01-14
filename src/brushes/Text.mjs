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
        console.log(bounds);
        this.width  = bounds.width;
        this.height = bounds.emHeightAscent + bounds.emHeightDescent;
    }

    at(x, y) {
        // Calculate the logical size of this text
        this.calculateSize();
        let yObj = undefined;

        if (typeof y !== "number" && typeof y !== "string") {
            yObj = y[1];
            y    = y[0];
        }

        // Calculate the Brush's position if X and/or Y are words
        [this.x, this.y] = this.getPositionFromWord(x, y, yObj);

        // Calculate the bounding box
        this.calculateMaxBounds();

        return this;
    }

    paint() {
        this.context.font = this.font;
        this.context.fillText(this.string, this.x, this.y);
    }
}