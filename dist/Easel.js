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

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _canvas = require("canvas");

var _canvas2 = _interopRequireDefault(_canvas);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _Layer = require("./src/Layer");

var _Layer2 = _interopRequireDefault(_Layer);

var _Brushes = require("./src/Brushes");

var Brushes = _interopRequireWildcard(_Brushes);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.noop = function () {};

var Easel = function (_EventEmitter) {
    (0, _inherits3.default)(Easel, _EventEmitter);

    function Easel(options) {
        (0, _classCallCheck3.default)(this, Easel);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Easel.__proto__ || Object.getPrototypeOf(Easel)).call(this));

        var defaults = {
            width: 2048,
            height: 2048,
            antialias: "none",
            smoothing: false,
            smoothingQuality: "high",
            lineWidth: 2,
            strokeColor: "black",
            fillColor: "white",
            trim: true,
            filename: _os2.default.tmpdir() + "/" + (0, _v2.default)() + ".png"
        };

        _this.options = Object.assign(_this, defaults, options);

        _this.center = { x: _this.width * 0.5, y: _this.height * 0.5 };
        _this.bounds = { top: undefined, right: undefined, bottom: undefined, left: undefined };
        _this.layers = [];
        _this.operations = [];
        _this.brushes = [];

        _this.addLayer("base");
        _this.activeLayer = _this.layer("base");
        return _this;
    }

    /**
     * Register a font file for use in the image
     *
     * @param {string} filename - The filename of the font file to register
     * @param {object} options - Some basic settings for this font
     * @param {string} options.family - The font family name
     * @param {string} [options.weight] - An optional font weight
     * @param {string} [options.style] - An optional font style
     */


    (0, _createClass3.default)(Easel, [{
        key: "activateLayer",
        value: function activateLayer(name) {
            this.activeLayer = this.layer(name);
            return this;
        }
    }, {
        key: "layer",
        value: function layer(name) {
            return this.layers.find(function (l) {
                return l.name === name;
            });
        }
    }, {
        key: "addLayer",
        value: function addLayer() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (!name) name = "layer-" + this.layers.size;
            var canvas = _canvas2.default.createCanvas(this.width, this.height);
            var context = canvas.getContext("2d");
            context.imageSmoothingEnabled = this.smoothing;
            context.imageSmoothingQuality = this.smoothingQuality;
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.strokeColor;
            context.fillStyle = this.fillColor;
            context.textBaseline = "top";
            context.textAlign = "left";
            this.layers.push(new _Layer2.default(name, canvas, context));
            this.topLayer = this.layer(name);
            return this;
        }
    }, {
        key: "calculateMaxBounds",
        value: function calculateMaxBounds(bounds) {
            if (this.bounds.top === undefined || bounds.top < this.bounds.top) this.bounds.top = Math.ceil(bounds.top);
            if (this.bounds.left === undefined || bounds.left < this.bounds.left) this.bounds.left = Math.ceil(bounds.left);
            if (this.bounds.right === undefined || bounds.right > this.bounds.right) this.bounds.right = Math.ceil(bounds.right);
            if (this.bounds.bottom === undefined || bounds.bottom > this.bounds.bottom) this.bounds.bottom = Math.ceil(bounds.bottom);
        }
    }, {
        key: "render",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var layers, results, cleanup;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                layers = [];


                                this.layers.map(function (layer) {
                                    layers.push(layer.render());
                                });

                                _context.next = 4;
                                return Promise.all(layers);

                            case 4:
                                results = _context.sent;

                                results.forEach(function (result) {
                                    _this2.calculateMaxBounds(result.bounds);
                                });

                                cleanup = [];

                                this.layers.forEach(function (layer) {
                                    cleanup.push(_fs2.default.unlink(layer.filename, global.noop));
                                });
                                _context.next = 10;
                                return Promise.all(cleanup);

                            case 10:
                                return _context.abrupt("return", this);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function render() {
                return _ref.apply(this, arguments);
            }

            return render;
        }()
    }, {
        key: "save",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(filename) {
                var base;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Promise.all(this.operations);

                            case 2:
                                if (!filename) filename = this.filename;else this.filename = filename;
                                base = this.layer("base");
                                return _context2.abrupt("return", new Promise(function (resolve) {
                                    var stream = base.canvas.pngStream().pipe(_fs2.default.createWriteStream(filename));
                                    return stream.on("finish", function () {
                                        return resolve(filename);
                                    });
                                }));

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function save(_x2) {
                return _ref2.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: "delete",
        value: function _delete() {
            _fs2.default.unlinkSync(this.filename);
        }
    }, {
        key: "pngStream",
        value: function pngStream() {
            return this.layer("base").pngStream();
        }
    }, {
        key: "toBuffer",
        value: function toBuffer() {
            return this.layer("base").toBuffer();
        }
    }, {
        key: "toDataUrl",
        value: function toDataUrl() {
            return this.layer("base").toDataUrl();
        }

        /**
         * Returns an image that has been re-sized to fit only the area in which something was drawn
         *
         * @param {number} [percent] - Optionally, a value between 0 and 1 to scale the image down by
         * @returns {Promise<Layer>}
         */

    }, {
        key: "minify",
        value: function minify() {
            var percent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (percent > 1) percent = 1;
            if (percent < 0) percent = 0;

            var bounds = this.bounds;
            var width = bounds.right - bounds.left;
            var height = bounds.bottom - bounds.top;

            var reduction = new Easel({
                width: width * percent,
                height: height * percent
            });
            reduction.bounds = bounds;

            var base = this.layer("base");
            var context = reduction.activeLayer.context;
            context.drawImage(base.canvas, bounds.left, bounds.top, width, height, 0, 0, reduction.width, reduction.height);
            return reduction;
        }
    }, {
        key: "addTo",
        value: function addTo(layer) {
            layer = this.layer(layer);

            for (var _len = arguments.length, brushes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                brushes[_key - 1] = arguments[_key];
            }

            brushes.forEach(function (brush) {
                return layer.add(brush);
            });
            return this;
        }
    }, {
        key: "add",
        value: function add() {
            var _this3 = this;

            for (var _len2 = arguments.length, brushes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                brushes[_key2] = arguments[_key2];
            }

            brushes.forEach(function (brush) {
                return _this3.activeLayer.add(brush);
            });
            return this;
        }
    }, {
        key: "createRect",
        value: function createRect(options) {
            return this.activeLayer.createRect(options);
        }
    }, {
        key: "createGradient",
        value: function createGradient(options) {
            return this.activeLayer.createGradient(options);
        }
    }, {
        key: "createImage",
        value: function createImage(options) {
            return this.activeLayer.createImage(options);
        }
    }, {
        key: "createPrinter",
        value: function createPrinter(options) {
            return this.activeLayer.createPrinter(options);
        }
    }], [{
        key: "registerFont",
        value: function registerFont(filename, options) {
            options.family = options.family.toLowerCase();
            _canvas2.default.registerFont(filename, options);
        }
    }]);
    return Easel;
}(_events2.default);

exports.default = Easel;


function checkRadius(a, r) {
    if (a < 2 * r) return a / 2;
    return r;
}

_canvas2.default.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r.topLeft = checkRadius(w, r.topLeft);
    r.topRight = checkRadius(h, r.topRight);
    r.bottomRight = checkRadius(w, r.bottomRight);
    r.bottomLeft = checkRadius(h, r.bottomLeft);

    this.beginPath();
    this.moveTo(x + r.topLeft, y);
    this.arcTo(x + w, y, x + w, y + h, r.topRight);
    this.arcTo(x + w, y + h, x, y + h, r.bottomRight);
    this.arcTo(x, y + h, x, y, r.bottomLeft);
    this.arcTo(x, y, x + w, y, r.topLeft);

    this.closePath();
    return this;
};