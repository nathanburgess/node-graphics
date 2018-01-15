"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * The base class for all brushes
 */
class BaseBrush {
    /**
     * Construct a Brush
     *
     * @param {Object} options - The settings to apply to the Brush
     * @param {Object} defaults - Some default settings
     */
    constructor(options = {}, defaults = {}) {
        this.context = undefined;

        // Add some global brush defaults that may or may not be set in individual brushes
        defaults = Object.assign({
            x: 0,
            y: 0,
            color: "white"
        }, defaults);

        // Calculate the initial bounding box of this brush
        this.bounds = { top: undefined, right: undefined, bottom: undefined, left: undefined };

        this.borderSpec = {
            color: options.borderColor || "transparent",
            type: options.borderType || "outer",
            size: options.borderSize || 0,
            radius: options.borderRadius || 0,
            topLeft: options.borderTopLeft || 0,
            topRight: options.borderTopRight || 0,
            bottomRight: options.borderBottomRight || 0,
            bottomLeft: options.borderBottomLeft || 0
        };
        this.calculateRadii(this.borderSpec.radius);

        this.center = {
            x: options.context.canvas.width * 0.5,
            y: options.context.canvas.height * 0.5
        };

        // Jobs are operations that may take some undetermined amount of time to finish. These are tracked so
        // that they can be checked and waited on before performing a save
        this.jobs = [];

        // Due to the nature of transformations, certain operations must happen in a certain order. Separating
        // these operations out into their own specific arrays allows an easier way of ensuring proper order.
        this.rotations = [];

        // Lastly, run the final step of initialization on the Brush
        this.assignOptions(defaults, options);
    }

    /**
     * Create the options Object for the Brush, determine positioning, and calculate the bounding box
     *
     * @param {Object} defaults - Some default settings
     * @param {Object} options - The settings to apply to the Brush
     */
    assignOptions(defaults, options) {
        // Merge the options with this, save original options in this.options
        this.options = Object.assign(defaults, options);
        Object.assign(this, this.options);
        // Any cyclical references must be removed in order for deep copies to work later on
        delete this.options.context;

        // If no height was set, we assume that this brush is square
        if (!this.height) this.height = this.width;
        if (!this.width) this.width = this.height;

        // Calculate the Brush's position if X and/or Y are words
        [this.x, this.y] = this.getPositionFromWord(this.x, this.y);

        // Calculate the bounding box
        this.calculateMaxBounds();

        // On construction, if a Gradient is passed in as the color, it's assigned before the width
        // and height are calculated. By reassigning here, the width and height are available and
        // the gradient can be sized to fit this brush.
        if (typeof this.color === "object") this.color = this.color;

        // Determine the center point of the Brush
        let cx = this.x + this.bounds.width * 0.5;
        let cy = this.y + this.bounds.height * 0.5;
        if (!isNaN(cx)) this.center.x = cx;
        if (!isNaN(cy)) this.center.y = cy;
    }

    /**
     * fillStyle mutator
     *
     * @param {string|Gradient} value - The color as a word, hex, hsl, hsla, rgb, rgba value, or Gradient
     */
    set color(value) {
        if (value.constructor.name.indexOf("Gradient") !== -1) {
            value = value.clone();
            value.width = this.width;
            value.height = this.height;
            value.resize();
            value.parent = this;
        }
        this.fillStyle = value;
    }

    /**
     * fillStyle accessor
     *
     * @returns {string|Gradient}
     */
    get color() {
        return this.fillStyle;
    }

    async copyTo(x, y, config = {}) {
        // Perform a deep-clone of the original brush's options
        let color = undefined;
        if (typeof this.options.color === "object") {
            color = this.options.color;
            delete this.options.color;
        }
        let options = JSON.parse(JSON.stringify(this.options));
        this.options.color = color;

        Object.assign(options, config);
        options.context = this.context;
        options.x = x;
        options.y = y;
        options.height = this.height || this.width;
        let brush = new this.constructor(options);
        if (color) brush.color = color;

        if (brush.constructor.name === "Image") {
            brush.image = this.image;
            await brush.loadImage();
        }
        return brush;
    }

    /**
     * Calculate the Brush's position on the canvas when the X and Y coordinates provided are not numeric.
     * The x and y variables may both be an array like [{number} x|y, {string} parent] where parent is the
     * parent object to use for relative positioning.
     *
     * @param {number|string|object} x - The Brush's X coordinate
     * @param {number|string|object} y - The Brush's Y coordinate
     * @returns {*[]}
     */
    getPositionFromWord(x, y) {
        let xPos = x,
            yPos = y;
        let offset = 0,
            xPlus = 0,
            yPlus = 0;
        let width = this.width;
        let height = this.height;
        let xParent, yParent;

        // Check to see if a parent object was passed in with the X position
        if (typeof x !== "number" && typeof x !== "string") {
            xParent = x[1];
            x = x[0];
        }
        // Check to see if a parent object was passed in with the Y position
        if (typeof y !== "number" && typeof y !== "string") {
            yParent = y[1];
            y = y[0];
        }
        if (this.bounds.width) width = this.bounds.width;
        if (this.bounds.height) height = this.bounds.height;
        if (this.borderSpec.size) offset = this.borderSpec.size * 0.5;

        if (!xParent) xParent = this.context.canvas;
        if (!yParent) yParent = this.context.canvas;

        if (typeof x === "string") {
            x = x.toLowerCase();
            let t = x.split(/([+-])/);
            x = t[0];
            if (t.length === 3) xPlus = Number.parseInt(t[1] + t[2]);
        }
        if (typeof y === "string") {
            y = y.toLowerCase();
            let t = y.split(/([+-])/);
            y = t[0];
            if (t.length === 3) yPlus = Number.parseInt(t[1] + t[2]);
        }

        if (x === "center") xPos = xParent.width * 0.5 - width * 0.5 - offset;else if (x === "right") xPos = xParent.bounds.right - this.width;

        if (y === "center") yPos = (yParent.bounds.top + yParent.bounds.height) * 0.5 - height * 0.5 - offset;else if (y === "bottom") yPos = yParent.height - height - offset;

        if (y === "top") yPos = offset;
        if (x === "left") xPos = offset;

        return [xPos + xPlus, yPos + yPlus];
    }

    calculateMaxBounds() {
        let offset = 0;
        if (this.borderSpec.size) offset = this.borderSpec.size * 0.5;

        let bounds = {
            top: this.y - offset,
            right: this.x + this.width + offset,
            bottom: this.y + this.height + offset,
            left: this.x - offset
        };

        // Ignore any brushes that are off canvas
        if (bounds.right < 0) return;
        if (bounds.left > this.context.canvas.width) return;
        if (bounds.bottom < 0) return;
        if (bounds.top > this.context.canvas.width) return;

        // Make sure the bounds are set to sensible values
        if (isNaN(bounds.top)) bounds.top = 0;
        if (bounds.right > this.context.canvas.width) bounds.right = this.context.canvas.width;else if (isNaN(bounds.right)) bounds.right = 0;
        if (bounds.bottom > this.context.canvas.height) bounds.bottom = this.context.canvas.height;else if (isNaN(bounds.bottom)) bounds.bottom = 0;
        if (isNaN(bounds.left)) bounds.left = 0;

        // Update the width and height
        bounds.width = bounds.right - bounds.left;
        bounds.height = bounds.bottom - bounds.top;
        if (!bounds.width) bounds.width = this.width;
        if (!bounds.height) bounds.height = bounds.width;

        // Apply the bounds
        this.bounds = bounds;
    }

    border(color, size, radius, type = "outer") {
        if (typeof radius === "number") Object.keys(this.borderSpec).forEach(v => this.borderSpec[v] = radius);else this.calculateRadii(radius);
        this.borderSpec.color = color;
        this.borderSpec.size = size;
        this.borderSpec.type = type;
        this.calculateMaxBounds();
        if (this.bounds.top < 0) this.y -= this.bounds.top;
        if (this.bounds.left < 0) this.x -= this.bounds.left;
        return this;
    }

    calculateRadii(style) {
        style = String(style);
        let radii = style.split(" ").map(x => Number.parseInt(x));

        let tRight, bRight, bLeft;
        if (radii.length === 1) tRight = bRight = bLeft = radii[0];else if (radii.length === 2) {
            bRight = radii[0];
            tRight = bLeft = radii[1];
        } else if (radii.length === 3) {
            tRight = bLeft = radii[1];
            bRight = radii[2];
        } else if (radii.length === 4) {
            tRight = radii[1];
            bRight = radii[2];
            bLeft = radii[3];
        }

        this.borderSpec.topLeft = radii[0];
        this.borderSpec.topRight = tRight;
        this.borderSpec.bottomRight = bRight;
        this.borderSpec.bottomLeft = bLeft;
    }

    rotate(angle) {
        this.rotations.push(angle * 0.017453292519943295);
    }

    preRender() {
        this.context.save();

        // Apply the rotations
        this.rotations.forEach(angle => {
            this.context.translate(this.center.x, this.center.y);
            this.context.rotate(angle);
            this.context.translate(-this.center.x, -this.center.y);
        });

        // Set the fill style
        this.context.fillStyle = this.color;
        if (this.color.constructor.name.indexOf("Gradient") !== -1) this.context.fillStyle = this.color.generate();

        // Establish the drawing space
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);

        // Set the line/border styles
        this.context.strokeStyle = this.borderSpec.color;
        this.context.lineWidth = this.borderSpec.size;
        if (this.borderSpec.type === "inner") {
            this.context.fill();
            this.context.stroke();
        } else {
            this.context.stroke();
            this.context.fill();
        }
    }

    async render() {
        this.preRender();
        await this.paint();
        this.postRender();
    }

    postRender() {
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpec);
        this.context.restore();
    }
}
exports.default = BaseBrush;