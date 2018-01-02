import EventEmitter from "events";
import Canvas from "canvas";
import fs from "fs";
import Layer from "./src/Layer.mjs";
import * as Brushes from "./src/Brushes.mjs";

global.noop = function () {
};

/**
 * Register a font file for use in the image
 *
 * @param {string} filename - The filename of the font file to register
 * @param {object} options - Some basic settings for this font
 * @param {string} options.family - The font family name
 * @param {string} [options.weight] - An optional font weight
 * @param {string} [options.style] - An optional font style
 */
function registerFont(filename, options) {
    Canvas.registerFont(filename, options);
}

export default class Easel extends EventEmitter {
    constructor(options) {
        super();

        let defaults = {
            width            : 2048,
            height           : 2048,
            antialias        : false,
            smoothing        : false,
            smoothingQuality : "High",
            lineWidth        : 2,
            strokeColor      : "black",
            fillColor        : "white"
        };

        this.options = Object.assign(this, defaults, options);

        this.center     = {x : this.width * 0.5, y : this.height * 0.5};
        this.maxBounds  = {left : 0, top : 0, right : this.width, bottom : this.height};
        this.layers     = new Map();
        this.operations = [];
        this.brushes    = [];
        this.bounds     = [];

        this.addLayer("base");
        this.activeLayer = this.layers.get("base");
    }

    activateLayer(name) {
        this.activeLayer = this.layer(name);
        return this;
    }

    layer(name) {
        return this.layers.get(name);
    }

    addLayer(name) {
        if (!name) name = "layer-" + this.layers.size;
        let canvas                    = Canvas.createCanvas(this.width, this.height);
        let context                   = canvas.getContext("2d");
        context.antialias             = this.antialias;
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
        return this;
    }

    async render() {
        let layers = [];
        this.layers.forEach(layer => {
            layers.push(layer.render());
        });

        await Promise.all(layers);

        let cleanup = [];
        this.layers.forEach(layer => {
            cleanup.push(fs.unlink(layer.filename, () => {}));
        });
        await Promise.all(cleanup);
        return this;
    }

    save(filename) {
        if (!filename) filename = "undefined.png";
        let base = this.layers.get("base");
        this.layers.forEach(layer => {
            base.context.drawImage(layer.canvas, 0, 0);
        });

        return new Promise(resolve => {
            let stream = base.canvas.pngStream().pipe(fs.createWriteStream(filename));
            stream.on("finish", data => {
                resolve(data);
            });
        });
    }

    createRect(options) {
        return this.activeLayer.createRect(options);
    }
}

Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r.tLeft, y);
    
    // this.arcTo(x + w, y, x + w, y + h, r.tRight); // tr
    // this.arcTo(x + w, y + h, x, y + h, r.bRight); // br
    // this.arcTo(x, y + h, x, y, r.bLeft); // bl
    // this.arcTo(x, y, x + w, y, r.tLeft); // tl    

    this.bezierCurveTo(r.tLeft, x + w, r.tLeftE, x + w, y + h); // tr
    this.arcTo(x + w, y + h, x, y + h, r.bRight); // br
    this.arcTo(x, y + h, x, y, r.bLeft); // bl
    this.arcTo(x, y, x + w, y, r.tLeft); // tl

    this.closePath();
    return this;
};