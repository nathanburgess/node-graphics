"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _LinearGradient = require("./LinearGradient");

var _LinearGradient2 = _interopRequireDefault(_LinearGradient);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * The Rectangle Brush
 */
var Rectangle = function (_Brush) {
    (0, _inherits3.default)(Rectangle, _Brush);

    function Rectangle() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Rectangle);
        return (0, _possibleConstructorReturn3.default)(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, options, {}));
    }

    (0, _createClass3.default)(Rectangle, [{
        key: "paint",
        value: function paint() {
            this.context.beginPath();
            this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);
            this.context.closePath();
        }
    }]);
    return Rectangle;
}(_BaseBrush2.default);

exports.default = Rectangle;