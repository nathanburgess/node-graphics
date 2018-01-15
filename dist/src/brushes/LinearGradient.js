"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Gradient = require("./Gradient");

var _Gradient2 = _interopRequireDefault(_Gradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The base class for all images
 */
class LinearGradient extends _Gradient2.default {
    constructor(options = {}) {
        super(options, {
            x: 0, y: 0,
            center: {
                x: options.context.canvas.width * 0.5,
                y: options.context.canvas.height * 0.5
            }
        });
        this.resize(this.context.canvas.width, this.context.canvas.height);
    }
}
exports.default = LinearGradient;