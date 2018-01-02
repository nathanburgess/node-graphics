import EventEmitter from "events";
import Canvas from "canvas";
import fs from "fs";
import Layer from "./src/Layer.mjs";
import * as Brushes from "./src/Brushes.mjs";

global.noop = function () {
};

export default class Easel extends EventEmitter {
    constructor(options) {
        super();

        let defaults = {
            width            : 2048,
            height           : 2048,
            smoothing        : false,
            smoothingQuality : "high",
            lineWidth        : 2,
            strokeColor      : "black",
            fillColor        : "white",
            trim             : true
        };

        this.options = Object.assign(this, defaults, options);

        this.center     = {x : this.width * 0.5, y : this.height * 0.5};
        this.bounds     = {top : this.height, right : 0, bottom : 0, left : this.width};
        this.layers     = new Map();
        this.operations = [];
        this.brushes    = [];

        this.addLayer("base");
        this.activeLayer = this.layers.get("base");
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
        Canvas.registerFont(filename, options);
    }

    activateLayer(name) {
        this.activeLayer = this.layer(name);
        return this;
    }

    layer(name) {
        return this.layers.get(name);
    }

    addLayer(name = undefined) {
        if (!name) name = "layer-" + this.layers.size;
        let canvas                    = Canvas.createCanvas(this.width, this.height);
        let context                   = canvas.getContext("2d");
        context.imageSmoothingEnabled = this.smoothing;
        context.imageSmoothingQuality = this.smoothingQuality;
        context.textBaseline          = this.textBaseline;
        context.textAlign             = this.textAlign;
        context.lineWidth             = this.lineWidth;
        context.strokeStyle           = this.strokeColor;
        context.fillStyle             = this.fillColor;
        context.textBaseline          = "top";
        context.textAlign             = "left";
        this.layers.set(name, new Layer(name, canvas, context));
        this.topLayer = this.layers.get(name);
        return this;
    }

    calculateMaxBounds(bounds) {
        if (bounds.top < this.bounds.top) this.bounds.top = Math.ceil(bounds.top);
        if (bounds.left < this.bounds.left) this.bounds.left = Math.ceil(bounds.left);
        if (bounds.right > this.bounds.right) this.bounds.right = Math.ceil(bounds.right);
        if (bounds.bottom > this.bounds.bottom) this.bounds.bottom = Math.ceil(bounds.bottom);
    }

    async render() {
        let layers = [];
        this.layers.forEach(layer => {
            layers.push(layer.render());
        });

        let results = await Promise.all(layers);
        results.forEach(result => {
            this.calculateMaxBounds(result.bounds);
        });

        let cleanup = [];
        this.layers.forEach(layer => {
            cleanup.push(fs.unlink(layer.filename, global.noop));
        });
        await Promise.all(cleanup);
        return this;
    }

    async save(filename) {
        await Promise.all(this.operations);
        if (!filename) filename = "undefined.png";
        let base = this.layers.get("base");

        return new Promise(resolve => {
            let stream = base.canvas.pngStream().pipe(fs.createWriteStream(filename));
            stream.on("finish", data => {
                resolve(data);
            });
        });
    }

    /**
     * Returns an image that has been re-sized to fit only the area in which something was drawn
     *
     * @param {number} [percent] - Optionally, a value between 0 and 1 to scale the image down by
     * @returns {Promise<Layer>}
     */
    reduce(percent = 1) {
        if (percent > 1) percent = 1;
        if (percent < 0) percent = 0;

        let bounds    = this.bounds;
        let oldWidth  = bounds.right - bounds.left;
        let oldHeight = bounds.bottom - bounds.top;

        let reduction    = new Easel({
            width  : oldWidth * percent,
            height : oldHeight * percent
        });
        reduction.bounds = bounds;

        let base    = this.layers.get("base");
        let context = reduction.activeLayer.context;
        context.drawImage(base.canvas,
            0, 0, oldWidth, oldHeight,
            bounds.left, bounds.top, context.canvas.width, context.canvas.height);
        console.log(context.canvas);
        return reduction;
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

Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = 0;
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r.tLeft, y);
    
    this.arcTo(x + w, y, x + w, y + h, r.tRight); // tr
    this.arcTo(x + w, y + h, x, y + h, r.bRight); // br
    this.arcTo(x, y + h, x, y, r.bLeft); // bl
    this.arcTo(x, y, x + w, y, r.tLeft); // tl    


    this.closePath();
    return this;
};