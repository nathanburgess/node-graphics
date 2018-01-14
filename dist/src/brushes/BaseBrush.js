"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The base class for all brushes
 */
var BaseBrush = function () {
    /**
     * Construct a Brush
     *
     * @param {Object} options - The settings to apply to the Brush
     * @param {Object} defaults - Some default settings
     */
    function BaseBrush() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, BaseBrush);

        this.context = undefined;

        // Add some global brush defaults that may or may not be set in individual brushes
        defaults = Object.assign({
            x: 0,
            y: 0,
            color: "white"
        }, defaults);

        // Calculate the initial bounding box of this brush
        this.bounds = { top: undefined, right: undefined, bottom: undefined, left: undefined };

        this.borderSpec = {
            color: "transparent",
            type: "outer",
            size: 0,
            radius: 0,
            topLeft: 0,
            topRight: 0,
            bottomRight: 0,
            bottomLeft: 0
        };

        this.center = {
            x: options.context.canvas.width * 0.5,
            y: options.context.canvas.height * 0.5
        };

        // Jobs are operations that may take some undetermined amount of time to finish. These are tracked so
        // that they can be checked and waited on before performing a save
        this.jobs = [];

        // Due to the nature of transformations, certain operations must happen in a certain order. Separating
        // these operations out into their own specific arrays allows an easier way of ensuring proper order.
        this.rotations = [];

        // Lastly, run the final step of initialization on the Brush
        this.assignOptions(defaults, options);
    }

    /**
     * Create the options Object for the Brush, determine positioning, and calculate the bounding box
     *
     * @param {Object} defaults - Some default settings
     * @param {Object} options - The settings to apply to the Brush
     */


    _createClass(BaseBrush, [{
        key: "assignOptions",
        value: function assignOptions(defaults, options) {
            // Merge the options with this, save original options in this.options
            this.options = Object.assign(defaults, options);
            Object.assign(this, this.options);
            // Any cyclical references must be removed in order for deep copies to work later on
            delete this.options.context;

            // If no height was set, we assume that this brush is square
            if (!this.height) this.height = this.width;
            if (!this.width) this.width = this.height;

            // Calculate the Brush's position if X and/or Y are words

            // Calculate the bounding box
            var _getPositionFromWord = this.getPositionFromWord(this.x, this.y);

            var _getPositionFromWord2 = _slicedToArray(_getPositionFromWord, 2);

            this.x = _getPositionFromWord2[0];
            this.y = _getPositionFromWord2[1];
            this.calculateMaxBounds();

            // On construction, if a Gradient is passed in as the color, it's assigned before the width
            // and height are calculated. By reassigning here, the width and height are available and
            // the gradient can be sized to fit this brush.
            if (_typeof(this.color) === "object") this.color = this.color;

            // Determine the center point of the Brush
            var cx = this.x + this.bounds.width * 0.5;
            var cy = this.y + this.bounds.height * 0.5;
            if (!isNaN(cx)) this.center.x = cx;
            if (!isNaN(cy)) this.center.y = cy;
        }

        /**
         * fillStyle mutator
         *
         * @param {string|Gradient} value - The color as a word, hex, hsl, hsla, rgb, rgba value, or Gradient
         */

    }, {
        key: "copyTo",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(x, y) {
                var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var color, options, brush;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // Perform a deep-clone of the original brush's options
                                color = undefined;

                                if (_typeof(this.options.color) === "object") {
                                    color = this.options.color;
                                    delete this.options.color;
                                }
                                options = JSON.parse(JSON.stringify(this.options));

                                this.options.color = color;

                                Object.assign(options, config);
                                options.context = this.context;
                                options.x = x;
                                options.y = y;
                                options.height = this.height || this.width;
                                brush = new this.constructor(options);

                                if (color) brush.color = color;

                                if (!(brush.constructor.name === "Image")) {
                                    _context.next = 15;
                                    break;
                                }

                                brush.image = this.image;
                                _context.next = 15;
                                return brush.loadImage();

                            case 15:
                                return _context.abrupt("return", brush);

                            case 16:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function copyTo(_x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return copyTo;
        }()

        /**
         * Calculate the Brush's position on the canvas when the X and Y coordinates provided are not numeric.
         * The x and y variables may both be an array like [{number} x|y, {string} parent] where parent is the
         * parent object to use for relative positioning.
         *
         * @param {number|string|object} x - The Brush's X coordinate
         * @param {number|string|object} y - The Brush's Y coordinate
         * @returns {*[]}
         */

    }, {
        key: "getPositionFromWord",
        value: function getPositionFromWord(x, y) {
            var xPos = x,
                yPos = y;
            var offset = 0,
                xPlus = 0,
                yPlus = 0;
            var width = this.width;
            var height = this.height;
            var xParent = void 0,
                yParent = void 0;

            // Check to see if a parent object was passed in with the X position
            if (typeof x !== "number" && typeof x !== "string") {
                xParent = x[1];
                x = x[0];
            }
            // Check to see if a parent object was passed in with the Y position
            if (typeof y !== "number" && typeof y !== "string") {
                yParent = y[1];
                y = y[0];
            }
            if (this.bounds.width) width = this.bounds.width;
            if (this.bounds.height) height = this.bounds.height;
            if (this.borderSpec.size) offset = this.borderSpec.size * 0.5;

            if (!xParent) xParent = this.context.canvas;
            if (!yParent) yParent = this.context.canvas;

            if (typeof x === "string") {
                x = x.toLowerCase();
                var t = x.split(/([+-])/);
                x = t[0];
                if (t.length === 3) xPlus = Number.parseInt(t[1] + t[2]);
            }
            if (typeof y === "string") {
                y = y.toLowerCase();
                var _t = y.split(/([+-])/);
                y = _t[0];
                if (_t.length === 3) yPlus = Number.parseInt(_t[1] + _t[2]);
            }

            if (x === "center") xPos = xParent.width * 0.5 - width * 0.5 - offset;else if (x === "right") xPos = xParent.bounds.right - this.width;

            if (y === "center") yPos = (yParent.bounds.top + yParent.bounds.height) * 0.5 - height * 0.5 - offset;else if (y === "bottom") yPos = yParent.height - height - offset;

            if (y === "top") yPos = offset;
            if (x === "left") xPos = offset;

            return [xPos + xPlus, yPos + yPlus];
        }
    }, {
        key: "calculateMaxBounds",
        value: function calculateMaxBounds() {
            var offset = 0;
            if (this.borderSpec.size) offset = this.borderSpec.size * 0.5;

            var bounds = {
                top: this.y - offset,
                right: this.x + this.width + offset,
                bottom: this.y + this.height + offset,
                left: this.x - offset
            };

            // Ignore any brushes that are off canvas
            if (bounds.right < 0) return;
            if (bounds.left > this.context.canvas.width) return;
            if (bounds.bottom < 0) return;
            if (bounds.top > this.context.canvas.width) return;

            // Make sure the bounds are set to sensible values
            if (isNaN(bounds.top)) bounds.top = 0;
            if (bounds.right > this.context.canvas.width) bounds.right = this.context.canvas.width;else if (isNaN(bounds.right)) bounds.right = 0;
            if (bounds.bottom > this.context.canvas.height) bounds.bottom = this.context.canvas.height;else if (isNaN(bounds.bottom)) bounds.bottom = 0;
            if (isNaN(bounds.left)) bounds.left = 0;

            // Update the width and height
            bounds.width = bounds.right - bounds.left;
            bounds.height = bounds.bottom - bounds.top;
            if (!bounds.width) bounds.width = this.width;
            if (!bounds.height) bounds.height = bounds.width;

            // Apply the bounds
            this.bounds = bounds;
        }
    }, {
        key: "border",
        value: function border(color, size, radius) {
            var _this = this;

            var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "outer";

            if (typeof radius === "number") Object.keys(this.borderSpec).forEach(function (v) {
                return _this.borderSpec[v] = radius;
            });else this.calculateRadii(radius);
            this.borderSpec.color = color;
            this.borderSpec.size = size;
            this.borderSpec.type = type;
            this.calculateMaxBounds();
            if (this.bounds.top < 0) this.y -= this.bounds.top;
            if (this.bounds.left < 0) this.x -= this.bounds.left;
            return this;
        }
    }, {
        key: "calculateRadii",
        value: function calculateRadii(style) {
            var radii = style.split(" ").map(function (x) {
                return Number.parseInt(x);
            });

            var tRight = void 0,
                bRight = void 0,
                bLeft = void 0;
            if (radii.length === 1) tRight = bRight = bLeft = radii[0];else if (radii.length === 2) {
                bRight = radii[0];
                tRight = bLeft = radii[1];
            } else if (radii.length === 3) {
                tRight = bLeft = radii[1];
                bRight = radii[2];
            } else if (radii.length === 4) {
                tRight = radii[1];
                bRight = radii[2];
                bLeft = radii[3];
            }

            this.borderSpec.topLeft = radii[0];
            this.borderSpec.topRight = tRight;
            this.borderSpec.bottomRight = bRight;
            this.borderSpec.bottomLeft = bLeft;
        }
    }, {
        key: "rotate",
        value: function rotate(angle) {
            this.rotations.push(angle * 0.017453292519943295);
        }
    }, {
        key: "preRender",
        value: function preRender() {
            var _this2 = this;

            this.context.save();

            // Apply the rotations
            this.rotations.forEach(function (angle) {
                _this2.context.translate(_this2.center.x, _this2.center.y);
                _this2.context.rotate(angle);
                _this2.context.translate(-_this2.center.x, -_this2.center.y);
            });

            // Set the fill style
            this.context.fillStyle = this.color;
            if (this.color.constructor.name.indexOf("Gradient") !== -1) this.context.fillStyle = this.color.generate();

            // Establish the drawing space
            this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);

            // Set the line/border styles
            this.context.strokeStyle = this.borderSpec.color;
            this.context.lineWidth = this.borderSpec.size;
            if (this.borderSpec.type === "inner") {
                this.context.fill();
                this.context.stroke();
            } else {
                this.context.stroke();
                this.context.fill();
            }
        }
    }, {
        key: "render",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.preRender();
                                _context2.next = 3;
                                return this.paint();

                            case 3:
                                this.postRender();

                            case 4:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function render() {
                return _ref2.apply(this, arguments);
            }

            return render;
        }()
    }, {
        key: "postRender",
        value: function postRender() {
            this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);
            this.context.restore();
        }
    }, {
        key: "color",
        set: function set(value) {
            if (value.constructor.name.indexOf("Gradient") !== -1) {
                value = value.clone();
                value.width = this.width;
                value.height = this.height;
                value.resize();
                value.parent = this;
            }
            this.fillStyle = value;
        }

        /**
         * fillStyle accessor
         *
         * @returns {string|Gradient}
         */
        ,
        get: function get() {
            return this.fillStyle;
        }
    }]);

    return BaseBrush;
}();

exports.default = BaseBrush;