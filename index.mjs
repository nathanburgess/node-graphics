import Easel from "./Easel";
import Canvas from "canvas";
import fs from "fs";
import gf from "gif-frames";
import child from "child_process";
import "babel-core/register";
import "babel-polyfill";

Easel.registerFont("fonts/futura.ttf", {
    family : "Futura"
});
Easel.registerFont("fonts/geo.ttf", {
    family : "Geo"
});

async function draw2() {
    let frames = await gf({
        url        : "./images/atrox.gif",
        frames     : "all",
        outputType : "jpg",
        cumulative : true
    });

    frames.forEach((frame, index) => {
        let imgData = frame.getImage();
        imgData.on("readable", async () => {
            let img = new Easel({
                width  : 350,
                height : 50
            });

            img.add(img.createRect({
                width  : 350,
                height : 50,
                color  : "#232323"
            }));

            img.add(img.createImage({
                x            : 5,
                y            : 5,
                image        : imgData.read(),
                height       : 40,
                borderRadius : 20
            }));

            let print = img.createPrinter({
                family : "Geo",
                size   : 31,
                color  : "white"
            });
            print.text("Atrox").at("left+50", "center");
            print.text("76").at("right-5", "center");

            let xpPercent      = 75;
            let xpBarWidth     = img.width - 59;
            let xpBarUnit      = xpBarWidth * 0.01;
            let xpBarFillWidth = xpPercent * xpBarUnit;
            img.add(img.createRect({
                x      : "left+51",
                y      : "bottom-10",
                width  : xpBarWidth,
                height : 2,
                color  : "#323232"
            }));
            img.add(img.createRect({
                x      : "left+51",
                y      : "bottom-10",
                width  : xpBarFillWidth,
                height : 2,
                color  : "#aaa850"
            }));
            img.add(print);
            await img.render();
            await img.save("undefined-" + index + ".png");
        });
    });

    console.log("Level card rendered");
}

async function d2Info() {

    let styleUnearned    = "rgba(24, 28, 37, 0.46)";
    let styleEarned      = "rgba(24, 28, 37, 0.64)";
    let tileSize         = 400,
        tileBorderRadius = 15;
    let tileX            = 10,
        tileY            = 10,
        tileSpace        = 10,
        tilePadding      = 10;
    let tileStep         = tileSize + tileSpace;
    let engramX          = tileX + tilePadding * 0.5,
        engramY          = tileY + tilePadding * 0.5;
    let iconSize         = tileSize - tileSize * 0.3,
        iconDiff         = tileSize - iconSize;
    let iconX            = tileX + iconDiff * 0.5,
        iconY            = tileY + iconDiff * 0.5;
    let nightfallEarned  = true,
        trialsEarned     = true,
        raidEarned       = false,
        pvpEarned        = true;
    let earned           = {color : styleEarned};
    let unearned         = {color : styleUnearned};

    let img = new Easel({
        width            : 2500,
        height           : 2500,
        smoothing        : true,
        smoothingQuality : "high"
    });

    let tile   = img.createRect({
        x            : tileX,
        y            : tileY,
        width        : tileSize,
        borderRadius : tileBorderRadius,
        color        : nightfallEarned ? styleEarned : styleUnearned,
    });
    let engram = await img.createImage({
        source : "images/destiny/earnedClanEngram.png",
        x      : -500,
        y      : -500,
        width  : tileSize - tilePadding
    });
    let icon   = await img.createImage({
        x     : iconX,
        y     : iconY,
        width : iconSize
    });

    img.add(engram, tile);

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
    img.add(icon.copyTo(iconX, iconY, {source : "images/destiny/nightfall.png"}));
    img.add(icon.copyTo(iconX + tileStep, iconY, {source : "images/destiny/trials.png"}));
    img.add(icon.copyTo(iconX + tileStep * 2, iconY, {source : "images/destiny/raid.png"}));
    img.add(icon.copyTo(iconX + tileStep * 3, iconY, {source : "images/destiny/pvp.png"}));

    await img.render();
    img = img.minify();
    await img.save("test.png");
    console.log("d2Info complete");
}

async function draw() {
    let img = new Easel({
        width  : 400,
        height : 100
    });

    let bg = img.createRect({
        width  : 350,
        height : 50,
        x      : 5,
        y      : 5,
        color  : "#232323"
    }).border("black", 5, 3);

    let avatar = await img.createImage({
        x            : ["left+8", bg],
        y            : ["bottom", bg],
        source       : "./images/atrox.gif",
        height       : 40,
        borderRadius : 20
    });

    let print = img.createPrinter({
        family : "Geo",
        size   : 31,
        color  : "white"
    });
    print.text("Atrox").at(["left+" + (avatar.bounds.right + 2), bg], ["center", bg]);
    print.text("76").at(["right-5", bg], ["center", bg]);

    let xpPercent      = 75;
    let xpBarWidth     = bg.width - avatar.bounds.right;
    let xpBarUnit      = xpBarWidth * 0.01;
    let xpBarFillWidth = xpPercent * xpBarUnit;
    let xpBar          = img.createRect({
        x      : "left+51",
        y      : ["bottom-5", bg],
        width  : xpBarWidth,
        height : 2,
        color  : "#323232"
    });
    let xpFill         = img.createRect({
        x      : "left+51",
        y      : ["bottom-5", bg],
        width  : xpBarFillWidth,
        height : 2,
        color  : "#aaa850"
    });

    img.add(bg, avatar, xpBar, xpFill, print);

    await img.render();
    img     = await img.minify();
    let fin = await img.save();
    console.log(fin);
    img.delete();
    console.log("Level card rendered");
}

console.log("Running a draw function...");
d2Info();
console.log("Exiting program");

process.on("unhandledRejection", (e, s) => {
    console.log(e, s);
});
