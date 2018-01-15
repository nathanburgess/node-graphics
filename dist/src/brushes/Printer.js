"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseBrush = require("./BaseBrush");

var _BaseBrush2 = _interopRequireDefault(_BaseBrush);

var _Text = require("./Text");

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Rectangle Brush
 */
class Printer extends _BaseBrush2.default {
    constructor(options = {}) {
        super(options, {});
        this.texts = [];
        this.font = `${this.size}px ${this.family}`;
    }

    text(string, options = {}) {
        options.string = string;
        options.context = this.context;
        options.font = this.font;
        this.texts.unshift(new _Text2.default(options));
        return this.texts[0];
    }

    paint() {
        this.texts.reverse();
        this.texts.forEach(text => {
            text.paint();
        });
    }
}
exports.default = Printer;