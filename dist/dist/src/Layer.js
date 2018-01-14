"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _canvas = require("canvas");

var _canvas2 = _interopRequireDefault(_canvas);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

var _Brushes = require("./Brushes");

var Brushes = _interopRequireWildcard(_Brushes);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * The base class for all images
 */
var Layer = function () {
    /**
     * Constructor for a layer
     *
     * @param {string} name - The name of this layer
     * @param {Canvas} canvas -
     * @param {CanvasRenderingContext2D} context
     */
    function Layer(name, canvas, context) {
        (0, _classCallCheck3.default)(this, Layer);

        this.name = name;
        this.canvas = canvas;
        this.context = context;
        this.drawState = undefined;
        this.brushes = [];
        this.jobs = [];
        this.bounds = { top: undefined, right: undefined, bottom: undefined, left: undefined };
        this.filename = _os2.default.tmpdir() + "/" + (0, _v2.default)() + ".png";
    }

    /**
     * Adds a brush to this layer's render stack
     *
     * @param {BaseBrush} brush - The brush to add
     * @returns {Layer}
     */

    (0, _createClass3.default)(Layer, [{
        key: "add",
        value: function add(brush) {
            this.brushes.push(brush);
            return this;
        }

        /**
         * Place a source image onto the canvas at a fixed location
         *
         * @param {string} source - The filename of the source image
         * @param {number} x - The X position to place the image
         * @param {number} y - The Y position to place the image
         * @param {number} [width] - How wide the image is
         * @param {number} [height] - How tall the image is
         * @returns {Promise<Layer>}
         */

    }, {
        key: "placeImageAt",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(source, x, y) {
                var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var load, image;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                load = _canvas2.default.loadImage(source);

                                this.operations.push(load);
                                _context.next = 4;
                                return load;

                            case 4:
                                image = _context.sent;

                                if (width && !height) {
                                    this.context.drawImage(image, x, y, width, width);
                                    this.updateBounds({ top: y, right: x + width, bottom: y + width, left: x });
                                } else if (width && height) {
                                    this.context.drawImage(image, x, y, width, height);
                                    this.updateBounds({ top: y, right: x + width, bottom: y + height, left: x });
                                } else {
                                    this.context.drawImage(image, x, y);
                                    this.updateBounds({ top: y, right: x + image.width, bottom: y + image.height, left: x });
                                }

                                return _context.abrupt("return", this);

                            case 7:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function placeImageAt(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return placeImageAt;
        }()

        /**
         * Calculate the bounding box for this layer
         *
         * @param {Object} bounds - The bounding box to use for the update
         */

    }, {
        key: "calculateMaxBounds",
        value: function calculateMaxBounds(bounds) {
            if (this.bounds.top === undefined || bounds.top < this.bounds.top) this.bounds.top = bounds.top;
            if (this.bounds.left === undefined || bounds.left < this.bounds.left) this.bounds.left = bounds.left;
            if (this.bounds.right === undefined || bounds.right > this.bounds.right) this.bounds.right = bounds.right;
            if (this.bounds.bottom === undefined || bounds.bottom > this.bounds.bottom) this.bounds.bottom = bounds.bottom;
        }

        /**
         * Render this layer and all of it's brushes
         *
         * @returns {Promise}
         */

    }, {
        key: "render",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var _this = this;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(this.jobs);

                            case 2:
                                this.brushes.forEach(function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(brush) {
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return brush;

                                                    case 2:
                                                        brush = _context2.sent;
                                                        _context2.next = 5;
                                                        return brush.render();

                                                    case 5:
                                                        _this.calculateMaxBounds(brush.bounds);

                                                    case 6:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x6) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());
                                this.drawState = "done";
                                _context3.next = 6;
                                return this.save();

                            case 6:
                                return _context3.abrupt("return", { name: this.name, bounds: this.bounds });

                            case 7:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function render() {
                return _ref2.apply(this, arguments);
            }

            return render;
        }()

        /**
         * Write the image to the file system
         *
         * @returns {Promise<void>}
         */

    }, {
        key: "save",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (this.drawState) {
                                    _context4.next = 2;
                                    break;
                                }

                                throw new Error("There has been no call to Layer.render()");

                            case 2:
                                return _context4.abrupt("return", new Promise(function (resolve) {
                                    var interval = setInterval(function () {
                                        if (_this2.drawState !== "done") return;

                                        clearInterval(interval);
                                        var stream = _this2.canvas.pngStream().pipe(_fs2.default.createWriteStream(_this2.filename));
                                        stream.on("finish", function (data) {
                                            resolve(data);
                                        });
                                    }, 250);
                                }));

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function save() {
                return _ref4.apply(this, arguments);
            }

            return save;
        }()

        /**
         * Create a rectangle brush
         *
         * @param {object} options - The settings for the rectangle
         * @returns {Rectangle}
         */

    }, {
        key: "createRect",
        value: function createRect() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            options.context = this.context;
            return new Brushes.Rectangle(options);
        }

        /**
         * Create a gradient brush
         *
         * @param {object} options - The settings for the gradient
         * @returns {Gradient}
         */

    }, {
        key: "createGradient",
        value: function createGradient() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            options.context = this.context;
            if (!options.type) return new Brushes.LinearGradient(options);else if (options.type.toLowerCase() === "radial") return new Brushes.RadialGradient(options);else throw new Error("Invalid gradient type supplied.");
        }

        /**
         * Create an image brush
         *
         * @param {object} options - The settings for the image
         * @returns {Promise<Image>}
         */

    }, {
        key: "createImage",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var image;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                options.context = this.context;
                                image = new Brushes.Image(options);

                                this.jobs.push(image.loadImage());
                                return _context5.abrupt("return", image);

                            case 4:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createImage() {
                return _ref5.apply(this, arguments);
            }

            return createImage;
        }()

        /**
         * Create a printer brush
         *
         * @param {object} options - The settings for the printer
         * @returns {Printer}
         */

    }, {
        key: "createPrinter",
        value: function createPrinter() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            options.context = this.context;
            return new Brushes.Printer(options);
        }
    }]);
    return Layer;
}();

exports.default = Layer;