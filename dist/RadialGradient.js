"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _Gradient2 = require("./Gradient");

var _Gradient3 = _interopRequireDefault(_Gradient2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * The base class for all images
 */
var RadialGradient = function (_Gradient) {
    (0, _inherits3.default)(RadialGradient, _Gradient);

    function RadialGradient() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, RadialGradient);
        return (0, _possibleConstructorReturn3.default)(this, (RadialGradient.__proto__ || Object.getPrototypeOf(RadialGradient)).call(this, options, {}));
    }

    return RadialGradient;
}(_Gradient3.default);

exports.default = RadialGradient;