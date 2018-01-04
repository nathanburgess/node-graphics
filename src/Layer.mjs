import Canvas from "canvas";
import fs from "fs";
import os from "os";
import uuid from "uuid/v4";
import * as Brushes from "./Brushes.mjs";

/**
 * The base class for all images
 */
export default class Layer {
    constructor(name, canvas, context) {
        this.name      = name;
        this.canvas    = canvas;
        this.context   = context;
        this.drawState = undefined;
        this.brushes   = [];
        this.jobs      = [];
        this.bounds    = {top : undefined, right : undefined, bottom : undefined, left : undefined};
        this.filename  = `${os.tmpdir()}/${uuid()}.png`;
    }

    add(brush) {
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
    async placeImageAt(source, x, y, width = undefined, height = undefined) {
        let load = Canvas.loadImage(source);
        this.operations.push(load);
        let image = await load;

        if (width && !height) {
            this.context.drawImage(image, x, y, width, width);
            this.updateBounds({top : y, right : x + width, bottom : y + width, left : x});
        }
        else if (width && height) {
            this.context.drawImage(image, x, y, width, height);
            this.updateBounds({top : y, right : x + width, bottom : y + height, left : x});
        }
        else {
            this.context.drawImage(image, x, y);
            this.updateBounds({top : y, right : x + image.width, bottom : y + image.height, left : x});
        }

        return this;
    }

    calculateMaxBounds(bounds) {
        if (this.bounds.top === undefined || bounds.top < this.bounds.top) this.bounds.top = bounds.top;
        if (this.bounds.left === undefined || bounds.left < this.bounds.left) this.bounds.left = bounds.left;
        if (this.bounds.right === undefined || bounds.right > this.bounds.right) this.bounds.right = bounds.right;
        if (this.bounds.bottom === undefined || bounds.bottom > this.bounds.bottom) this.bounds.bottom = bounds.bottom;
    }

    async render() {
        await Promise.all(this.jobs);
        this.brushes.forEach(async brush => {
            brush = await brush;
            await brush.render();
            this.calculateMaxBounds(brush.bounds);
        });
        this.drawState = "done";
        await this.save();
        return {name : this.name, bounds : this.bounds};
    }

    /**
     * Write the image to the file system
     *
     * @returns {Promise<void>}
     */
    async save() {
        if (!this.drawState)
            throw new Error("There has been no call to Layer.render()");

        return new Promise(resolve => {
            let interval = setInterval(() => {
                if (this.drawState !== "done") return;

                clearInterval(interval);
                let stream = this.canvas.pngStream().pipe(fs.createWriteStream(this.filename));
                stream.on("finish", data => {
                    resolve(data);
                });
            }, 250);
        });
    }

    createRect(options = {}) {
        options.context = this.context;
        return new Brushes.Rectangle(options);
    }

    createGradient(options = {}) {
        options.context = this.context;
        if (!options.type)
            return new Brushes.LinearGradient(options);
        else if (options.type.toLowerCase() === "radial")
            return new Brushes.RadialGradient(options);
        else
            throw new Error("Invalid gradient type supplied.");
    }

    async createImage(options = {}) {
        options.context = this.context;
        let image       = new Brushes.Image(options);
        this.jobs.push(image.loadImage());
        return image;
    }

    createPrinter(options = {}) {
        options.context = this.context;
        return new Brushes.Printer(options);
    }
}