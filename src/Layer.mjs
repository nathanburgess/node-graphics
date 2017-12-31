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
        this.filename  = `${os.tmpdir()}/${uuid()}.png`;
    }

    /**
     * Returns an image that has been re-sized to fit only the area in which something was drawn
     *
     * @param {number} [percent] - Optionally, a value between 0 and 1 to scale the image down by
     * @returns {Promise<Layer>}
     */
    async reduce(percent = 1) {
        if (percent > 1) percent = 1;
        if (percent < 0) percent = 0;

        if (!this.maxBounds) this.maxBounds = {
            left   : 0,
            top    : 0,
            right  : this.canvas.width,
            bottom : this.canvas.height
        };
        let bounds    = this.maxBounds;
        let oldWidth  = bounds.right - bounds.left;
        let oldHeight = bounds.bottom - bounds.top;

        let reduction = new Layer({
            width  : oldWidth * percent,
            height : oldHeight * percent
        });

        reduction.context.drawImage(this.canvas,
            bounds.left, bounds.top, oldWidth, oldHeight,
            0, 0, reduction.canvas.width, reduction.canvas.height);
        return reduction;
    }

    /**
     * Keep track of the image's current bounds, for easy resizing later on
     *
     * @param {Object} bounds - The bounding box to use for the update
     * @param {number} bounds.top - The top of the box
     * @param {number} bounds.right - The right of the box
     * @param {number} bounds.bottom - The bottom of the box
     * @param {number} bounds.left - The left of the box
     * @param {number} [bounds.width] - This is calculated based on the left and right bounds
     * @param {number} [bounds.height] - This is calculated based on the top and bottom bounds
     */
    updateBounds(bounds) {
        if (bounds.top < 0) bounds.top = 0;
        if (bounds.left < 0) bounds.left = 0;
        if (bounds.right > this.canvas.width) bounds.right = this.canvas.width;
        if (bounds.bottom > this.canvas.height) bounds.bottom = this.canvas.height;

        if (!this.maxBounds) return this.maxBounds = bounds;

        if (bounds.right > this.maxBounds.right) this.maxBounds.right = bounds.right;
        if (bounds.bottom > this.maxBounds.bottom) this.maxBounds.bottom = bounds.bottom;
        if (bounds.top < this.maxBounds.top) this.maxBounds.top = bounds.top;
        if (bounds.left < this.maxBounds.left) this.maxBounds.left = bounds.left;

        bounds.width  = bounds.right - bounds.left;
        bounds.height = bounds.bottom - bounds.top;

        this.bounds.unshift(bounds);
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

    async render() {
        this.drawState = "done";
        this.brushes.forEach(brush => {
            brush.render(this.context);
        });
        await this.save();
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

    createRect(options) {
        let rect = new Brushes.Rectangle(options);
        this.brushes.push(rect);
        return rect;
    }
}