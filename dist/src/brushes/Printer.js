"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _Text = require("./Text");

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Rectangle Brush
 */
var Printer = function (_Brush) {
    _inherits(Printer, _Brush);

    function Printer() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Printer);

        var _this = _possibleConstructorReturn(this, (Printer.__proto__ || Object.getPrototypeOf(Printer)).call(this, options, {}));

        _this.texts = [];
        _this.font = _this.size + "px " + _this.family;
        return _this;
    }

    _createClass(Printer, [{
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