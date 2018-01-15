"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

class Easel extends _events2.default {
    constructor(options) {
        super();

        let defaults = {
            width: 2048,
            height: 2048,
            antialias: "none",
            smoothing: false,
            smoothingQuality: "high",
            lineWidth: 2,
            strokeColor: "black",
            fillColor: "white",
            trim: true,
            filename: `${_os2.default.tmpdir()}/${(0, _v2.default)()}.png`
        };

        this.options = Object.assign(this, defaults, options);

        this.center = { x: this.width * 0.5, y: this.height * 0.5 };
        this.bounds = { top: undefined, right: undefined, bottom: undefined, left: undefined };
        this.layers = [];
        this.operations = [];
        this.brushes = [];

        this.addLayer("base");
        this.activeLayer = this.layer("base");
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
    static registerFont(filename, options) {
        options.family = options.family.toLowerCase();
        _canvas2.default.registerFont(filename, options);
    }

    activateLayer(name) {
        this.activeLayer = this.layer(name);
        return this;
    }

    layer(name) {
        return this.layers.find(l => {
            return l.name === name;
        });
    }

    addLayer(name = undefined) {
        if (!name) name = "layer-" + this.layers.size;
        let canvas = _canvas2.default.createCanvas(this.width, this.height);
        let context = canvas.getContext("2d");
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

    calculateMaxBounds(bounds) {
        if (this.bounds.top === undefined || bounds.top < this.bounds.top) this.bounds.top = Math.ceil(bounds.top);
        if (this.bounds.left === undefined || bounds.left < this.bounds.left) this.bounds.left = Math.ceil(bounds.left);
        if (this.bounds.right === undefined || bounds.right > this.bounds.right) this.bounds.right = Math.ceil(bounds.right);
        if (this.bounds.bottom === undefined || bounds.bottom > this.bounds.bottom) this.bounds.bottom = Math.ceil(bounds.bottom);
    }

    async render() {
        let layers = [];

        this.layers.reverse().map(layer => {
            layers.push(layer.render());
        });

        let results = await Promise.all(layers);
        results.forEach(result => {
            this.calculateMaxBounds(result.bounds);
        });

        let cleanup = [];
        this.layers.forEach(layer => {
            cleanup.push(_fs2.default.unlink(layer.filename, global.noop));
        });
        await Promise.all(cleanup);
        return this;
    }

    async save(filename) {
        await Promise.all(this.operations);
        if (!filename) filename = this.filename;else this.filename = filename;
        let base = this.layer("base");

        return new Promise(resolve => {
            let stream = base.canvas.pngStream().pipe(_fs2.default.createWriteStream(filename));
            return stream.on("finish", () => {
                return resolve(filename);
            });
        });
    }

    delete() {
        _fs2.default.unlinkSync(this.filename);
    }

    pngStream() {
        return this.layer("base").pngStream();
    }

    toBuffer() {
        return this.layer("base").toBuffer();
    }

    toDataUrl() {
        return this.layer("base").toDataUrl();
    }

    /**
     * Returns an image that has been re-sized to fit only the area in which something was drawn
     *
     * @param {number} [percent] - Optionally, a value between 0 and 1 to scale the image down by
     * @returns {Promise<Layer>}
     */
    minify(percent = 1) {
        if (percent > 1) percent = 1;
        if (percent < 0) percent = 0;

        let bounds = this.bounds;
        let width = bounds.right - bounds.left;
        let height = bounds.bottom - bounds.top;

        let reduction = new Easel({
            width: width * percent,
            height: height * percent
        });
        reduction.bounds = bounds;

        let base = this.layer("base");
        let context = reduction.activeLayer.context;
        context.drawImage(base.canvas, bounds.left, bounds.top, width, height, 0, 0, reduction.width, reduction.height);
        return reduction;
    }

    addTo(layer, ...brushes) {
        layer = this.layer(layer);
        brushes.forEach(brush => layer.add(brush));
        return this;
    }

    add(...brushes) {
        brushes.forEach(brush => this.activeLayer.add(brush));
        return this;
    }

    createRect(options) {
        return this.activeLayer.createRect(options);
    }

    createGradient(options) {
        return this.activeLayer.createGradient(options);
    }

    createImage(options) {
        return this.activeLayer.createImage(options);
    }

    createPrinter(options) {
        return this.activeLayer.createPrinter(options);
    }
}

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