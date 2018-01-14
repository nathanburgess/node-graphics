import Brush from "./BaseBrush";
import LinearGradient from "./LinearGradient";

/**
 * The base class for all images
 */
export default class Gradient extends Brush {
    constructor(options = {}) {
        super(options, {
            angle : 0,
            x     : 0,
            y     : 0,
            stops : []
        });
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
        return this;
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
        this.next = true;
        this.resize();
        return this;
    }

    resize(width = this.width, height = this.height) {
        this.width    = width;
        this.height   = height;
        this.center.x = this.width * 0.5;
        this.center.y = this.height * 0.5;

        if (this.parent) {
            this.x      = this.parent.x;
            this.y      = this.parent.y;
            this.width  = this.parent.width;
            this.height = this.parent.height;
            this.center = this.parent.center;
        }

        let x, y, ix, iy;
        [x, y]   = this.getPointOnRect();
        [ix, iy] = this.getPointOnRect(true);

        if (this.constructor.name === "LinearGradient")
            this.gradient = this.context.createLinearGradient(x, y, ix, iy);
        return this;
    }

    /**
     * Get the point on the rect that corresponds to a terminus of the gradient
     *
     * @param {boolean} [inverse] - Setting to true will get the opposite points
     * @returns {[number, number]}
     */
    getPointOnRect(inverse = false) {
        let angle = -this.angle, magnitude;
        let cosA  = Math.abs(Math.cos(this.angle));
        let sinA  = Math.abs(Math.sin(this.angle));
        let w2ca  = this.width / 2 / cosA;
        let h2sa  = this.height / 2 / sinA;

        if (w2ca <= h2sa) magnitude = Math.abs(w2ca);
        else magnitude = Math.abs(h2sa);

        return [
            this.center.x + Math.cos(inverse ? angle - Math.PI : angle) * magnitude,
            this.center.y + Math.sin(inverse ? angle - Math.PI : angle) * magnitude];
    }

    generate() {
        this.stops.forEach(stop => {
            this.gradient.addColorStop(stop[0], stop[1]);
        });
        return this.gradient;
    }

    paint() {
        this.generate();
        this.context.fillStyle = this.gradient;
        if (!this.parent)
            this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    clone() {
        let gradient = {};
        let options  = {
            angle   : this.angle,
            stops   : this.stops,
            context : this.context
        };
        if (this.constructor.name === "LinearGradient")
            gradient = new LinearGradient(options);
        return gradient;
    }
}