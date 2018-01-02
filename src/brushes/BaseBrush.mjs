/**
 * The base class for all brushes
 */
export default class BaseBrush {
    constructor(options = {}) {
        let defaults = {
            color       : "white",
            borderColor : "transparent",
            borderSize  : 0
        };

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

        this.assignOptions(defaults, options);
    }

    assignOptions(defaults, options) {
        Object.assign(this, defaults, options);
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
        
        arr = arr.slice(0, arr.indexOf('/'));
        arr = arr.map(x => Number.parseInt(x));
        let tr;
        let br;
        let bl;

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

    preRender(context) {
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.borderSize;
    }

    postRender(context) {
        context.restore();
    }
}