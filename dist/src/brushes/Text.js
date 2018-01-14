"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseBrush = require("./BaseBrush.mjs");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Text Brush
 */
var Text = function (_Brush) {
    _inherits(Text, _Brush);

    function Text() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Text);

        return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, options, {}));
    }

    _createClass(Text, [{
        key: "calculateSize",
        value: function calculateSize() {
            this.context.font = this.font;
            var bounds = this.context.measureText(this.string);
            console.log(bounds);
            this.width = bounds.width;
            this.height = bounds.emHeightAscent + bounds.emHeightDescent;
        }
    }, {
        key: "at",
        value: function at(x, y) {
            // Calculate the logical size of this text
            this.calculateSize();
            var yObj = undefined;

            if (typeof y !== "number" && typeof y !== "string") {
                yObj = y[1];
                y = y[0];
            }

            // Calculate the Brush's position if X and/or Y are words

            // Calculate the bounding box
            var _getPositionFromWord = this.getPositionFromWord(x, y, yObj);

            var _getPositionFromWord2 = _slicedToArray(_getPositionFromWord, 2);

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