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

var _Text = require("./Text");

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Rectangle Brush
 */
var Printer = function (_Brush) {
    (0, _inherits3.default)(Printer, _Brush);

    function Printer() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Printer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Printer.__proto__ || Object.getPrototypeOf(Printer)).call(this, options, {}));

        _this.texts = [];
        _this.font = _this.size + "px " + _this.family;
        return _this;
    }

    (0, _createClass3.default)(Printer, [{
        key: "text",
        value: function text(string) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            options.string = string;
            options.context = this.context;
            options.font = this.font;
            this.texts.unshift(new _Text2.default(options));
            return this.texts[0];
        }
    }, {
        key: "paint",
        value: function paint() {
            this.texts.reverse();
            this.texts.forEach(function (text) {
                text.paint();
            });
        }
    }]);
    return Printer;
}(_BaseBrush2.default);

exports.default = Printer;