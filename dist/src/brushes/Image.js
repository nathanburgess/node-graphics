"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

/**
 * The base class for all images
 */
var Image = function (_Brush) {
    (0, _inherits3.default)(Image, _Brush);

    function Image() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Image);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, options, {
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

    (0, _createClass3.default)(Image, [{
        key: "loadImage",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var _this2 = this;

                var image, load, _getPositionFromWord, _getPositionFromWord2, stream;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
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
                                _getPositionFromWord2 = (0, _slicedToArray3.default)(_getPositionFromWord, 2);
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
                                    stream.on("finish", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
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
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var x, y;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
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