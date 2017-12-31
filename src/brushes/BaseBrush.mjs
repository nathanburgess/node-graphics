/**
 * The base class for all brushes
 */
export default class BaseBrush {
    constructor(options = {}) {
        let defaults = {
            color       : "white",
            borderColor : "transparent",
            borderSize  : 0,
        };

        this.bounds = {};
        this.assignOptions(defaults, options);
    }

    set color(value) {
        if (value.constructor.name.indexOf("Gradient") !== -1) {
            value        = value.clone();
            value.parent = this;
        }
        this.fillStyle = value;
    }

    get color() {
        return this.fillStyle;
    }

    assignOptions(defaults, options) {
        this.options = Object.assign(this, defaults, options);
        this.setBounds();
    }

    setBounds() {
        this.bounds = {
            top    : this.y,
            right  : this.x + this.width,
            bottom : this.y + this.height,
            left   : this.x
        };
    }

    fill(color) {
        this.color = color;
        return this;
    }

    border(color, size) {
        this.borderColor = color;
        this.borderSize  = size;
        return this;
    }

    preRender() {
        this.context.save();
        this.context.fillStyle = this.color;

        console.log(this.bounds);
        let halfBorder = this.borderSize*0.5;
        this.bounds.left -= halfBorder;
        this.bounds.right += halfBorder;
        this.bounds.top -= halfBorder;
        this.bounds.bottom += halfBorder;
        console.log(this.bounds);

        if (this.color.constructor.name.indexOf("Gradient") !== -1) {
            this.color.recenter(this.width * 0.5 + this.x, this.height * 0.5 + this.y);
            this.context.fillStyle = this.color.resize(this.width, this.height).render();
        }
        this.context.strokeStyle = this.borderColor;
        this.context.lineWidth   = this.borderSize;
    }

    postRender() {
        this.context.restore();
    }
}