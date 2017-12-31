import Brush from "./BaseBrush.mjs";

/**
 * The base class for all images
 */
export default class Rectangle extends Brush {
    constructor(options = {}) {
        super();

        let defaults = {
            borderRadius : 0
        };

        this.assignOptions(defaults, options);
    }

        render(context)
        {
            super.preRender(context);

            context.beginPath();
            context.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
            context.closePath();
            context.fill();
            context.stroke();

            super.postRender(context);
    }
}