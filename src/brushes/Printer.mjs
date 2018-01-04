import Brush from "./BaseBrush.mjs";
import Text from "./Text.mjs";

/**
 * The Rectangle Brush
 */
export default class Printer extends Brush {
    constructor(options = {}) {
        super(options, {});
        this.texts = [];
        this.font = `${this.size}px ${this.family}`;
    }

    text(string, options = {}) {
        options.string  = string;
        options.context = this.context;
        options.font = this.font;
        this.texts.unshift(new Text(options));
        return this.texts[0];
    }

    paint() {
        this.texts.reverse();
        this.texts.forEach(text => {
            text.paint();
        });
    }
}