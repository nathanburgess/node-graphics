/**
 * The base class for all brushes
 */
export default class BaseBrush {
    constructor(options = {}) {
        let defaults = {};
        Object.assign(this, defaults, options);
    }

    assignOptions(defaults, options) {
        this.context = options.context;
        Object.assign(this, defaults, options);
    }

    draw() {
    }
}