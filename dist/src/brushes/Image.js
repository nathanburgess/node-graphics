"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _canvas = require("canvas");

var _canvas2 = _interopRequireDefault(_canvas);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

var _requestPromiseNative = require("request-promise-native");

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The base class for all images
 */
var Image = function (_Brush) {
    _inherits(Image, _Brush);

    function Image() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Image);

        var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, options, {
            source: undefined,
            x: 0,
            y: 0,
            width: undefined,
            height: undefined,
            color: "transparent"
        }));

        _this.jobs = [];
        return _this;
    }

    _createClass(Image, [{
        key: "loadImage",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _this2 = this;

                var image, load, _getPositionFromWord, _getPositionFromWord2, stream;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(!this.source && this.image)) {
                                    _context2.next = 5;
                                    break;
                                }

                                image = new _canvas2.default.Image();

                                image.src = this.image;
                                this.image = image;
                                return _context2.abrupt("return");

                            case 5:

                                this.source = this.source.toLowerCase();

                                if (!(this.source.slice(0, 4) !== "http")) {
                                    _context2.next = 22;
                                    break;
                                }

                                load = _canvas2.default.loadImage(this.source);

                                this.jobs.push(load);
                                _context2.next = 11;
                                return load;

                            case 11:
                                this.image = _context2.sent;

                                if (!this.height) this.height = this.image.height * this.width / this.image.width;
                                _getPositionFromWord = this.getPositionFromWord(this.x, this.options.y);
                                _getPositionFromWord2 = _slicedToArray(_getPositionFromWord, 2);
                                this.x = _getPositionFromWord2[0];
                                this.y = _getPositionFromWord2[1];

                                this.center.x = this.x + this.width * 0.5;
                                this.center.y = this.y + this.height * 0.5;
                                this.calculateMaxBounds();
                                _context2.next = 25;
                                break;

                            case 22:
                                this.filename = this.source.split("/").slice(-1).join();
                                stream = (0, _requestPromiseNative2.default)(this.source).pipe(_fs2.default.createWriteStream(this.filename));

                                this.jobs.push(new Promise(function (resolve) {
                                    stream.on("finish", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _this2.source = _this2.filename;
                                                        _context.next = 3;
                                                        return _this2.loadImage();

                                                    case 3:
                                                        resolve("all done");

                                                    case 4:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this2);
                                    })));
                                }));

                            case 25:
                                return _context2.abrupt("return", this);

                            case 26:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loadImage() {
                return _ref.apply(this, arguments);
            }

            return loadImage;
        }()
    }, {
        key: "paint",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var x, y;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(this.jobs);

                            case 2:
                                x = options.x || this.x;
                                y = options.y || this.y;

                                if (this.image) {
                                    _context3.next = 6;
                                    break;
                                }

                                throw new Error("No image was provided for Image.paint()");

                            case 6:

                                if (this.width) {
                                    this.context.beginPath();
                                    this.context.arc(this.center.x, this.center.y, this.borderRadius, 0, 2 * Math.PI, false);
                                    this.context.clip();
                                    this.context.drawImage(this.image, x, y, this.width, this.height);
                                } else this.context.drawImage(this.image, x, y);

                            case 7:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function paint() {
                return _ref3.apply(this, arguments);
            }

            return paint;
        }()
    }]);

    return Image;
}(_BaseBrush2.default);

exports.default = Image;