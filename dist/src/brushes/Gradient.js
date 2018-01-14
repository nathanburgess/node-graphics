"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _LinearGradient = require("./LinearGradient");

var _LinearGradient2 = _interopRequireDefault(_LinearGradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The base class for all images
 */
var Gradient = function (_Brush) {
    _inherits(Gradient, _Brush);

    function Gradient() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Gradient);

        var _this = _possibleConstructorReturn(this, (Gradient.__proto__ || Object.getPrototypeOf(Gradient)).call(this, options, {
            angle: 0,
            x: 0,
            y: 0,
            stops: []
        }));

        _this.gradient = undefined;
        _this.convertAngle();
        return _this;
    }

    /**
     * Convert the angle into radians
     */


    _createClass(Gradient, [{
        key: "convertAngle",
        value: function convertAngle() {
            var angle = this.angle;

            if (angle === "east" || angle === "e") angle = 0;else if (angle === "eastnortheast" || angle === "ene") angle = 30;else if (angle === "northeast" || angle === "ne") angle = 45;else if (angle === "northnorthast" || angle === "nne") angle = 60;else if (angle === "north" || angle === "n") angle = 90;else if (angle === "northnorthwest" || angle === "nnw") angle = 120;else if (angle === "northwest" || angle === "nw") angle = 135;else if (angle === "westnorthwest" || angle === "wnw") angle = 150;else if (angle === "west" || angle === "w") angle = 180;else if (angle === "westsouthwest" || angle === "wsw") angle = 210;else if (angle === "southwest" || angle === "sw") angle = 225;else if (angle === "southsouthwest" || angle === "ssw") angle = 240;else if (angle === "south" || angle === "s") angle = 270;else if (angle === "southsoutheast" || angle === "sse") angle = 300;else if (angle === "southeast" || angle === "se") angle = 315;else if (angle === "eastsoutheast" || angle === "ese") angle = 330;

            this.angle = angle * -(Math.PI / 180);
            return this;
        }

        /**
         * Add a color stop to the gradient
         *
         * @param {number} percent - A value between 0 and 1 for where to add the stop
         * @param {string} color - The color of the gradient at this stop
         */

    }, {
        key: "add",
        value: function add(percent, color) {
            this.stops.push([percent, color]);
            return this;
        }
    }, {
        key: "setAngle",
        value: function setAngle(value) {
            this.angle = value;
            this.convertAngle();
            this.next = true;
            this.resize();
            return this;
        }
    }, {
        key: "resize",
        value: function resize() {
            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.height;

            this.width = width;
            this.height = height;
            this.center.x = this.width * 0.5;
            this.center.y = this.height * 0.5;

            if (this.parent) {
                this.x = this.parent.x;
                this.y = this.parent.y;
                this.width = this.parent.width;
                this.height = this.parent.height;
                this.center = this.parent.center;
            }

            var x = void 0,
                y = void 0,
                ix = void 0,
                iy = void 0;

            var _getPointOnRect = this.getPointOnRect();

            var _getPointOnRect2 = _slicedToArray(_getPointOnRect, 2);

            x = _getPointOnRect2[0];
            y = _getPointOnRect2[1];

            var _getPointOnRect3 = this.getPointOnRect(true);

            var _getPointOnRect4 = _slicedToArray(_getPointOnRect3, 2);

            ix = _getPointOnRect4[0];
            iy = _getPointOnRect4[1];


            if (this.constructor.name === "LinearGradient") this.gradient = this.context.createLinearGradient(x, y, ix, iy);
            return this;
        }

        /**
         * Get the point on the rect that corresponds to a terminus of the gradient
         *
         * @param {boolean} [inverse] - Setting to true will get the opposite points
         * @returns {[number, number]}
         */

    }, {
        key: "getPointOnRect",
        value: function getPointOnRect() {
            var inverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var angle = -this.angle,
                magnitude = void 0;
            var cosA = Math.abs(Math.cos(this.angle));
            var sinA = Math.abs(Math.sin(this.angle));
            var w2ca = this.width / 2 / cosA;
            var h2sa = this.height / 2 / sinA;

            if (w2ca <= h2sa) magnitude = Math.abs(w2ca);else magnitude = Math.abs(h2sa);

            return [this.center.x + Math.cos(inverse ? angle - Math.PI : angle) * magnitude, this.center.y + Math.sin(inverse ? angle - Math.PI : angle) * magnitude];
        }
    }, {
        key: "generate",
        value: function generate() {
            var _this2 = this;

            this.stops.forEach(function (stop) {
                _this2.gradient.addColorStop(stop[0], stop[1]);
            });
            return this.gradient;
        }
    }, {
        key: "paint",
        value: function paint() {
            this.generate();
            this.context.fillStyle = this.gradient;
            if (!this.parent) this.context.fillRect(this.x, this.y, this.width, this.height);
        }
    }, {
        key: "clone",
        value: function clone() {
            var gradient = {};
            var options = {
                angle: this.angle,
                stops: this.stops,
                context: this.context
            };
            if (this.constructor.name === "LinearGradient") gradient = new _LinearGradient2.default(options);
            return gradient;
        }
    }]);

    return Gradient;
}(_BaseBrush2.default);

exports.default = Gradient;