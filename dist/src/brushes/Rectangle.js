"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _LinearGradient = require("./LinearGradient");

var _LinearGradient2 = _interopRequireDefault(_LinearGradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Rectangle Brush
 */
class Rectangle extends _BaseBrush2.default {
    constructor(options = {}) {
        super(options, {});
    }

    paint() {
        this.context.beginPath();
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);
        this.context.closePath();
    }
}
exports.default = Rectangle;