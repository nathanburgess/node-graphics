import Brush from "./BaseBrush.mjs";
import Canvas from "canvas";
import uuid from "uuid/v4";
import request from "request-promise-native";
import fs from "fs";

/**
 * The base class for all images
 */
export default class Image extends Brush {
    constructor(options = {}) {
        super(options, {
            source : undefined,
            x      : 0,
            y      : 0,
            width  : undefined,
            height : undefined,
            color  : "transparent"
        });
        this.jobs = [];
    }

    async loadImage() {
        if (!this.source && this.image) {
            let image  = new Canvas.Image;
            image.src  = this.image;
            this.image = image;
            return;
        }

        this.source = this.source.toLowerCase();
        if (this.source.slice(0, 4) !== "http") {
            let load = Canvas.loadImage(this.source);
            this.jobs.push(load);
            this.image = await load;
            if (!this.height)
                this.height = (this.image.height * this.width) / this.image.width;
            [this.x, this.y] = this.getPositionFromWord(this.x, this.options.y);
            this.center.x    = this.x + this.width * 0.5;
            this.center.y    = this.y + this.height * 0.5;
            this.calculateMaxBounds();
        }
        else {
            this.filename = this.source.split("/").slice(-1).join();
            let stream    = request(this.source).pipe(fs.createWriteStream(this.filename));
            this.jobs.push(new Promise(resolve => {
                stream.on("finish", async () => {
                    this.source = this.filename;
                    await this.loadImage();
                    resolve("all done");
                });
            }));
        }
        return this;
    }

    async paint(options = {}) {
        await Promise.all(this.jobs);

        let x = options.x || this.x;
        let y = options.y || this.y;

        if (!this.image) throw new Error("No image was provided for Image.paint()");


        if (this.width) {
            this.context.beginPath();
            this.context.arc(this.center.x, this.center.y, this.borderRadius, 0, 2 * Math.PI, false);
            this.context.clip();
            this.context.drawImage(this.image, x, y, this.width, this.height);
        }
        else
            this.context.drawImage(this.image, x, y);
    }
}