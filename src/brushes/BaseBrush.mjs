/**
 * The base class for all brushes
 */
export default class BaseBrush {
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
            color        : "white",
            borderColor  : "transparent",
            borderSize   : 0,
            borderRadius : 0,
        }, defaults);

        // Calculate the initial bounding box of this brush
        this.bounds = {top : undefined, right : undefined, bottom : undefined, left : undefined};

        this.borderSpecs = {
            tLeft : 0,
            tRight : 0,
            bRight : 0,
            bLeft : 0,
            tLeftE : 0,
            tRightE : 0,
            bRightE : 0,
            bLeftE : 0, 
        };

        this.center = {
            x : options.context.canvas.width * 0.5,
            y : options.context.canvas.height * 0.5
        };

        // Jobs are operations that may take some undetermined amount of time to finish. These are tracked so
        // that they can be checked and waited on before performing a save
        this.jobs = [];

        // Due to the nature of transformations, certain operations must happen in a certain order. Separating
        // these operations out into their own specific arrays allows an easier way of ensuring proper order.
        this.rotations = [];

        this.copies = [];

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
            value        = value.clone();
            value.width  = this.width;
            value.height = this.height;
            value.resize();
            value.parent = this;
        }
        this.fillStyle = value;
    }

    set borderSize(size) {
        this.lineWidth = size;
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
        let options        = JSON.parse(JSON.stringify(this.options));
        this.options.color = color;

        Object.assign(options, config);
        options.context = this.context;
        options.x       = x;
        options.y       = y;
        options.height  = this.height || this.width;
        let brush       = new this.constructor(options);
        if (color) brush.color = color;

        if (brush.constructor.name === "Image") {
            brush.image = this.image;
            await brush.loadImage();
        }
        return brush;
    }

    /**
     * Calculate the Brush's position on the canvas when the X and Y coordinates provided are not numeric
     *
     * @param {number|string} x - The Brush's X coordinate
     * @param {number|string} y - The Brush's Y coordinate
     * @returns {*[]}
     */
    getPositionFromWord(x, y) {
        let xPos   = x, yPos = y;
        let offset = 0;
        let width  = this.width;
        let height = this.height;

        if (this.constructor.name === "Image" && width && !height) height = width;

        if (this.bounds.width) width = this.bounds.width;
        if (this.bounds.height) height = this.bounds.height;
        if (this.lineWidth) offset = this.lineWidth * 0.5;

        if (x === "center") xPos = this.context.canvas.width * 0.5 - width * 0.5;
        else if (x === "right") xPos = this.context.canvas.width - width - offset;

        if (y === "center") yPos = this.context.canvas.height * 0.5 - height * 0.5;
        else if (y === "bottom") yPos = this.context.canvas.height - height - offset;

        if (y === "top") yPos = offset;
        if (x === "left") xPos = offset;

        return [xPos, yPos];
    }

    calculateMaxBounds() {
        let offset = 0;
        if (this.lineWidth) offset = this.lineWidth * 0.5;

        let bounds = {
            top    : this.y - offset,
            right  : this.x + this.width + offset,
            bottom : this.y + this.height + offset,
            left   : this.x - offset,
        };

        // Ignore any brushes that are off canvas
        if (bounds.right < 0) return;
        if (bounds.left > this.context.canvas.width) return;
        if (bounds.bottom < 0) return;
        if (bounds.top > this.context.canvas.width) return;

        // Make sure the bounds are set to sensible values
        if (isNaN(bounds.top)) bounds.top = 0;
        if (bounds.right > this.context.canvas.width) bounds.right = this.context.canvas.width;
        else if (isNaN(bounds.right)) bounds.right = 0;
        if (bounds.bottom > this.context.canvas.height) bounds.bottom = this.context.canvas.height;
        else if (isNaN(bounds.bottom)) bounds.bottom = 0;
        if (isNaN(bounds.left)) bounds.left = 0;

        // Update the width and height
        bounds.width  = bounds.right - bounds.left;
        bounds.height = bounds.bottom - bounds.top;
        if (!bounds.width) bounds.width = this.width;
        if (!bounds.height) bounds.height = bounds.width;

        // Apply the bounds
        this.bounds = bounds;
    }

    fill(color) {
        this.color = color;
        return this;
    }

    border(color, size, radius) {
        this.borderColor = color;
        this.borderSize  = size;
        this.radParse(radius);
        return this;
    }

    radParse(x) {
        var arr = x.split(" ");

        if(arr.indexOf('/') !== -1 ) {
            var arrE = arr.slice(arr.indexOf('/')+1, arr.length);
            arrE = arrE.map(x => Number.parseInt(x));
            let tre;
            let bre;
            let ble;

            if(arrE.length === 1) {
                tre = bre = ble = arrE[0];
            }
            else if(arrE.length === 2){
                bre = arrE[0];
                tre = ble = arrE[1];
            }
            else if(arrE.length === 3){
                tre = ble = arrE[1];
                bre = arrE[2];
            }
            else if(arrE.length ===4) {
                tre = arrE[1];
                bre = arrE[2];
                ble = arrE[3];
            }

            this.borderSpecs.tLeftE = arrE[0];
            this.borderSpecs.tRightE = tre;
            this.borderSpecs.bRightE = bre;
            this.borderSpecs.bLeftE = ble;
        }
        
        //arr = arr.map(x => Number.parseInt(x));
        let tr;
        let br;
        let bl;
        console.log(arr);
        if(arr.length === 1){
            

            tr = br = bl = arr[0];
        }
        else if(arr.length === 2){
            br = arr[0];
            tr = bl = arr[1];
        }
        else if(arr.length === 3){
            tr = bl = arr[1];
            br = arr[2];
        }
        else if(arr.length === 4){
            tr = arr[1];
            br = arr[2];
            bl = arr[3];
        }

        this.borderSpecs.tLeft = arr[0];
        this.borderSpecs.tRight = tr;
        this.borderSpecs.bRight = br;
        this.borderSpecs.bLeft = bl;

        console.log(arr);
        console.log(arrE);
        console.log(this.borderSpecs);
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

<<<<<<< HEAD
        // Establish the drawing space
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpecs);

=======
>>>>>>> 90cee6f83e425dea39f00ab0be5e75769e1fae57
        // Set the fill style
        this.context.fillStyle = this.color;
        if (this.color.constructor.name.indexOf("Gradient") !== -1)
            this.context.fillStyle = this.color.render();

        // Establish the drawing space
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
        this.context.fill();
    }

    async render() {
        this.preRender();
        await this.paint();
        this.postRender();
    }

    postRender() {
        this.context.roundRect(this.x, this.y, this.width, this.height, this.borderSpecs);

        // Set the line/border styles
        this.context.strokeStyle = this.borderColor;
        this.context.lineWidth   = this.lineWidth;
        this.context.stroke();
        this.context.restore();
    }
}