"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Gradient2 = require("./Gradient.mjs");

var _Gradient3 = _interopRequireDefault(_Gradient2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The base class for all images
 */
var LinearGradient = function (_Gradient) {
    _inherits(LinearGradient, _Gradient);

    function LinearGradient() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LinearGradient);

        var _this = _possibleConstructorReturn(this, (LinearGradient.__proto__ || Object.getPrototypeOf(LinearGradient)).call(this, options, {
            x: 0, y: 0,
            center: {
                x: options.context.canvas.width * 0.5,
                y: options.context.canvas.height * 0.5
            }
        }));

        _this.resize(_this.context.canvas.width, _this.context.canvas.height);
        return _this;
    }

    return LinearGradient;
}(_Gradient3.default);

exports.default = LinearGradient;