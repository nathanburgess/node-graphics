"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Text Brush
 */
class Text extends _BaseBrush2.default {
    constructor(options = {}) {
        super(options, {});
    }

    calculateSize() {
        this.context.font = this.font;
        let bounds = this.context.measureText(this.string);
        this.width = bounds.width;
        this.height = bounds.emHeightAscent + bounds.emHeightDescent;
    }

    at(x, y) {
        // Calculate the logical size of this text
        this.calculateSize();

        // Calculate the Brush's position if X and/or Y are words
        [this.x, this.y] = this.getPositionFromWord(x, y);

        // Calculate the bounding box
        this.calculateMaxBounds();

        return this;
    }

    paint() {
        this.context.font = this.font;
        this.context.fillText(this.string, this.x, this.y);
    }
}
exports.default = Text;