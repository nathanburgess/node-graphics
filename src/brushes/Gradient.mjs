import Brush from "./BaseBrush.mjs";
import LinearGradient from "./LinearGradient.mjs";

/**
 * The base class for all images
 */
export default class Gradient extends Brush {
    constructor(options = {}) {
        super();

        let defaults = {
            angle : 0
        };

        this.assignOptions(defaults, options);
        this.stops    = [];
        this.gradient = undefined;
        this.convertAngle();
    }

    /**
     * Convert the angle into radians
     */
    convertAngle() {
        let angle = this.angle;

        if (angle === "east" || angle === "e")
            angle = 0;
        else if (angle === "eastnortheast" || angle === "ene")
            angle = 30;
        else if (angle === "northeast" || angle === "ne")
            angle = 45;
        else if (angle === "northnorthast" || angle === "nne")
            angle = 60;
        else if (angle === "north" || angle === "n")
            angle = 90;
        else if (angle === "northnorthwest" || angle === "nnw")
            angle = 120;
        else if (angle === "northwest" || angle === "nw")
            angle = 135;
        else if (angle === "westnorthwest" || angle === "wnw")
            angle = 150;
        else if (angle === "west" || angle === "w")
            angle = 180;
        else if (angle === "westsouthwest" || angle === "wsw")
            angle = 210;
        else if (angle === "southwest" || angle === "sw")
            angle = 225;
        else if (angle === "southsouthwest" || angle === "ssw")
            angle = 240;
        else if (angle === "south" || angle === "s")
            angle = 270;
        else if (angle === "southsoutheast" || angle === "sse")
            angle = 300;
        else if (angle === "southeast" || angle === "se")
            angle = 315;
        else if (angle === "eastsoutheast" || angle === "ese")
            angle = 330;

        this.angle = angle * -(Math.PI / 180);
    }

    /**
     * Get the point on the rect that corresponds to a terminus of the gradient
     *
     * @param {number} width - The width of the gradient
     * @param {number} height - The height of the gradient
     * @param {boolean} [inverse] - Setting to true will get the opposite points
     * @returns {[number, number]}
     */
    getPointOnRect(width, height, inverse = false) {
        let angle = -this.angle, magnitude;
        let cosA  = Math.abs(Math.cos(this.angle));
        let sinA  = Math.abs(Math.sin(this.angle));
        let w2ca  = width / 2 / cosA;
        let h2sa  = height / 2 / sinA;

        if (w2ca <= h2sa) magnitude = Math.abs(w2ca);
        else magnitude = Math.abs(h2sa);

        return [
            this.center.x + Math.cos(inverse ? angle - Math.PI : angle) * magnitude,
            this.center.y + Math.sin(inverse ? angle - Math.PI : angle) * magnitude];
    }

    /**
     * Add a color stop to the gradient
     *
     * @param {number} percent - A value between 0 and 1 for where to add the stop
     * @param {string} color - The color of the gradient at this stop
     */
    add(percent, color) {
        this.stops.push([percent, color]);
        return this;
    }

    setAngle(value) {
        this.angle = value;
        this.convertAngle();
        this.resize();
        return this;
    }

    render(context) {
        this.stops.forEach(stop => {
            this.gradient.addColorStop(stop[0], stop[1]);
        });
        if (!this.parent) {
            this.context.fillStyle = this.gradient;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        return this.gradient;
    }

    clone() {
        let gradient = {};
        let options  = {
            angle   : this.angle,
            x       : this.x,
            y       : this.y,
            center  : this.center,
            stops   : this.stops,
            context : this.context
        };
        if (this.constructor.name === "LinearGradient")
            gradient = new LinearGradient(options);
        return gradient;
    }
}