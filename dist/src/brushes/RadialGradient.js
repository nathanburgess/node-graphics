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
class RadialGradient extends _Gradient2.default {
    constructor(options = {}) {
        super(options, {});
    }
}
exports.default = RadialGradient;