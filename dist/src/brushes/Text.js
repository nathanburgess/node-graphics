"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Text Brush
 */
var Text = function (_Brush) {
    (0, _inherits3.default)(Text, _Brush);

    function Text() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Text);
        return (0, _possibleConstructorReturn3.default)(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, options, {}));
    }

    (0, _createClass3.default)(Text, [{
        key: "calculateSize",
        value: function calculateSize() {
            this.context.font = this.font;
            var bounds = this.context.measureText(this.string);
            this.width = bounds.width;
            this.height = bounds.emHeightAscent + bounds.emHeightDescent;
        }
    }, {
        key: "at",
        value: function at(x, y) {
            // Calculate the logical size of this text
            this.calculateSize();

            // Calculate the Brush's position if X and/or Y are words

            // Calculate the bounding box
            var _getPositionFromWord = this.getPositionFromWord(x, y);

            var _getPositionFromWord2 = (0, _slicedToArray3.default)(_getPositionFromWord, 2);

            this.x = _getPositionFromWord2[0];
            this.y = _getPositionFromWord2[1];
            this.calculateMaxBounds();

            return this;
        }
    }, {
        key: "paint",
        value: function paint() {
            this.context.font = this.font;
            this.context.fillText(this.string, this.x, this.y);
        }
    }]);
    return Text;
}(_BaseBrush2.default);

exports.default = Text;