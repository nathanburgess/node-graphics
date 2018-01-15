"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
class Image extends _BaseBrush2.default {
    constructor(options = {}) {
        super(options, {
            source: undefined,
            x: 0,
            y: 0,
            width: undefined,
            height: undefined,
            color: "transparent"
        });
        this.jobs = [];
        this.noPaint = false;
    }

    async loadImage() {
        if (!this.source && this.image) {
            let image = new _canvas2.default.Image();
            image.src = this.image;
            this.image = image;
            return this;
        } else if (!this.source) {
            this.noPaint = true;
            return this;
        }

        this.source = this.source.toLowerCase();
        if (this.source.slice(0, 4) !== "http") {
            let load = _canvas2.default.loadImage(this.source);
            this.jobs.push(load);
            this.image = await load;
            if (!this.height) this.height = this.image.height * this.width / this.image.width;
            [this.x, this.y] = this.getPositionFromWord(this.x, this.options.y);
            this.center.x = this.x + this.width * 0.5;
            this.center.y = this.y + this.height * 0.5;
            this.calculateMaxBounds();
        } else {
            this.filename = this.source.split("/").slice(-1).join();
            let stream = (0, _requestPromiseNative2.default)(this.source).pipe(_fs2.default.createWriteStream(this.filename));
            this.jobs.push(new Promise(resolve => {
                stream.on("finish", async () => {
                    this.source = this.filename;
                    await this.loadImage();
                    resolve();
                });
            }));
        }
        return this;
    }

    async paint(options = {}) {
        await Promise.all(this.jobs);
        if (this.noPaint) return this;

        let x = options.x || this.x;
        let y = options.y || this.y;

        if (!this.image) throw new Error("No image was provided for Image.paint()");

        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.borderRadius, 0, 2 * Math.PI, false);
        this.context.clip();

        if (this.width) this.context.drawImage((await this.image), x, y, this.width, this.height);else this.context.drawImage((await this.image), x, y);
    }
}
exports.default = Image;