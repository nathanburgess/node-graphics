"use strict";

var d2Info = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var styleUnearned, styleEarned, tileSize, tileBorderRadius, tileX, tileY, tileSpace, tilePadding, tileStep, engramX, engramY, iconSize, iconDiff, iconX, iconY, nightfallEarned, trialsEarned, raidEarned, pvpEarned, earned, unearned, img, g, bg, tile, engram, icon;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        styleUnearned = "rgba(24, 28, 37, 0.46)";
                        styleEarned = "rgba(24, 28, 37, 0.64)";
                        tileSize = 400, tileBorderRadius = 15;
                        tileX = 10, tileY = 10, tileSpace = 10, tilePadding = 10;
                        tileStep = tileSize + tileSpace;
                        engramX = tileX + tilePadding * 0.5, engramY = tileY + tilePadding * 0.5;
                        iconSize = tileSize - tileSize * 0.3, iconDiff = tileSize - iconSize;
                        iconX = tileX + iconDiff * 0.5, iconY = tileY + iconDiff * 0.5;
                        nightfallEarned = true, trialsEarned = false, raidEarned = false, pvpEarned = true;
                        earned = { color: styleEarned };
                        unearned = { color: styleUnearned };
                        img = new _Easel2.default({
                            width: 2500,
                            height: 2500,
                            smoothing: true,
                            smoothingQuality: "high"
                        });
                        g = img.createGradient().add(0, "#ae005d").add(1, "#3100ff");
                        bg = img.createRect({
                            x: 0, y: 0,
                            width: tileSize * 4 + tileX * 2 + tileSpace * 3,
                            height: tileSize + tileY * 2,
                            borderRadius: tileBorderRadius,
                            color: g
                        });
                        //img.add(bg);

                        tile = img.createRect({
                            x: tileX,
                            y: tileY,
                            width: tileSize,
                            borderRadius: tileBorderRadius,
                            color: nightfallEarned ? styleEarned : styleUnearned
                        });
                        _context.next = 17;
                        return img.createImage({
                            source: "./images/destiny/earnedClanEngram.png",
                            x: -500,
                            y: -500,
                            width: tileSize - tilePadding
                        });

                    case 17:
                        engram = _context.sent;
                        _context.next = 20;
                        return img.createImage({
                            source: "./images/destiny/nightfall.png",
                            x: iconX,
                            y: iconY,
                            width: iconSize
                        });

                    case 20:
                        icon = _context.sent;


                        img.add(engram, tile, icon);

                        // Copy the tiles across the image
                        img.add(tile.copyTo(tileX + tileStep, tileY, trialsEarned ? earned : unearned));
                        img.add(tile.copyTo(tileX + tileStep * 2, tileY, raidEarned ? earned : unearned));
                        img.add(tile.copyTo(tileX + tileStep * 3, tileY, pvpEarned ? earned : unearned));

                        // Display engrams for earned statuses
                        if (nightfallEarned) img.add(engram.copyTo(engramX, engramY));
                        if (trialsEarned) img.add(engram.copyTo(engramX + tileStep, engramY));
                        if (raidEarned) img.add(engram.copyTo(engramX + tileStep * 2, engramY));
                        if (pvpEarned) img.add(engram.copyTo(engramX + tileStep * 3, engramY));

                        // Display the icons for each status
                        img.add(icon.copyTo(iconX + tileStep, iconY, { source: "./images/destiny/trials.png" }));
                        img.add(icon.copyTo(iconX + tileStep * 2, iconY, { source: "./images/destiny/raid.png" }));
                        img.add(icon.copyTo(iconX + tileStep * 3, iconY, { source: "./images/destiny/pvp.png" }));

                        _context.next = 34;
                        return img.render();

                    case 34:
                        img = img.minify();
                        _context.next = 37;
                        return img.save();

                    case 37:
                        console.log("d2Info complete");

                    case 38:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function d2Info() {
        return _ref.apply(this, arguments);
    };
}();

var draw = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var img, bg, avatar, print, xpPercent, xpBarWidth, xpBarUnit, xpBarFillWidth, xpBar, xpFill;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        img = new _Easel2.default({
                            width: 400,
                            height: 100
                        });
                        bg = img.createRect({
                            width: 350,
                            height: 50,
                            x: 5,
                            y: 5,
                            color: "#232323"
                        }).border("black", 5, 3);
                        avatar = img.createImage({
                            x: bg.bounds.left + 5,
                            y: bg.bounds.top + 7.5,
                            source: "./images/atrox.gif",
                            height: 40,
                            borderRadius: 20
                        });
                        print = img.createPrinter({
                            family: "Geo",
                            size: 31,
                            color: "white"
                        });

                        print.text("Atrox").at("left+50", ["center", bg]);
                        print.text("76").at("right-5", ["center", bg]);

                        xpPercent = 75;
                        xpBarWidth = img.width - 59;
                        xpBarUnit = xpBarWidth * 0.01;
                        xpBarFillWidth = xpPercent * xpBarUnit;
                        xpBar = img.createRect({
                            x: "left+51",
                            y: "bottom-10",
                            width: xpBarWidth,
                            height: 2,
                            color: "#323232"
                        });
                        xpFill = img.createRect({
                            x: "left+51",
                            y: "bottom-10",
                            width: xpBarFillWidth,
                            height: 2,
                            color: "#aaa850"
                        });


                        img.add(bg, avatar, xpBar, xpFill, print);

                        _context2.next = 15;
                        return img.render();

                    case 15:
                        _context2.next = 17;
                        return img.minify();

                    case 17:
                        img = _context2.sent;
                        _context2.next = 20;
                        return img.save();

                    case 20:
                        console.log("Level card rendered");

                    case 21:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function draw() {
        return _ref2.apply(this, arguments);
    };
}();

var draw2 = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var frames;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return (0, _gifFrames2.default)({
                            url: "./images/atrox.gif",
                            frames: "all",
                            outputType: "jpg",
                            cumulative: true
                        });

                    case 2:
                        frames = _context4.sent;


                        frames.forEach(function (frame, index) {
                            var imgData = frame.getImage();
                            imgData.on("readable", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                                var img, print, xpPercent, xpBarWidth, xpBarUnit, xpBarFillWidth;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                img = new _Easel2.default({
                                                    width: 350,
                                                    height: 50
                                                });


                                                img.add(img.createRect({
                                                    width: 350,
                                                    height: 50,
                                                    color: "#232323"
                                                }));

                                                img.add(img.createImage({
                                                    x: 5,
                                                    y: 5,
                                                    image: imgData.read(),
                                                    height: 40,
                                                    borderRadius: 20
                                                }));

                                                print = img.createPrinter({
                                                    family: "Geo",
                                                    size: 31,
                                                    color: "white"
                                                });

                                                print.text("Atrox").at("left+50", "center");
                                                print.text("76").at("right-5", "center");

                                                xpPercent = 75;
                                                xpBarWidth = img.width - 59;
                                                xpBarUnit = xpBarWidth * 0.01;
                                                xpBarFillWidth = xpPercent * xpBarUnit;

                                                img.add(img.createRect({
                                                    x: "left+51",
                                                    y: "bottom-10",
                                                    width: xpBarWidth,
                                                    height: 2,
                                                    color: "#323232"
                                                }));
                                                img.add(img.createRect({
                                                    x: "left+51",
                                                    y: "bottom-10",
                                                    width: xpBarFillWidth,
                                                    height: 2,
                                                    color: "#aaa850"
                                                }));
                                                img.add(print);
                                                _context3.next = 15;
                                                return img.render();

                                            case 15:
                                                _context3.next = 17;
                                                return img.save("undefined-" + index + ".png");

                                            case 17:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this);
                            })));
                        });

                        console.log("Level card rendered");

                    case 5:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function draw2() {
        return _ref3.apply(this, arguments);
    };
}();

var _Easel = require("./Easel.mjs");

var _Easel2 = _interopRequireDefault(_Easel);

var _canvas = require("canvas");

var _canvas2 = _interopRequireDefault(_canvas);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _gifFrames = require("gif-frames");

var _gifFrames2 = _interopRequireDefault(_gifFrames);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Easel2.default.registerFont("fonts/futura.ttf", {
    family: "Futura"
});
_Easel2.default.registerFont("fonts/geo.ttf", {
    family: "Geo"
});

console.log("Running a draw function...");
draw();
console.log("Exiting program");

process.on("unhandledRejection", function (e, s) {
    console.log(e, s);
});