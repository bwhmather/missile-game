/** Original author Kevin Lindsey **/
/** Modified 2011 by Ben Mather **/


AbsoluteArcPath.prototype = new AbsolutePathSegment();
AbsoluteArcPath.prototype.constructor = AbsoluteArcPath;
AbsoluteArcPath.superclass = AbsolutePathSegment.prototype;

function AbsoluteArcPath(params,owner,previous) {
    if(arguments.length>0){
        this.init("A",params,owner,previous);
    }
}

AbsoluteArcPath.prototype.init = function (command,params,owner,previous) {
    var point = new Array();
    var y = params.pop();
    var x = params.pop();
    point.push(x,y);
    AbsoluteArcPath.superclass.init.call(this,command,point,owner,previous);

    this.rx = parseFloat(params.shift());
    this.ry = parseFloat(params.shift());
    this.angle = parseFloat(params.shift());
    this.arcFlag = parseFloat(params.shift());
    this.sweepFlag = parseFloat(params.shift());
};

AbsoluteArcPath.prototype.toString = function () {
    var points = new Array();
    var command = "";
    if (this.previous.constructor != this.constuctor) {
        command = this.command;
    }
    return command + [this.rx, this.ry,
                      this.angle,
                      this.arcFlag, this.sweepFlag,
                      this.handles[0].point.toString()].join(",");
};

AbsoluteArcPath.prototype.getIntersectionParams = function () {
    res = a2c()

    return new IntersectionParams("Bezier", new Point2D(x1,y1), new Point2D(x2,y2), new Point2D(x,y));
};



/** Added by Ben Mather (2011) **/
/** Approximates an ellipse segment as a cubic bezier curve **/
/** Taken from the raphael project and heavily reformatted; any errors are
probably a result of the reformatting **/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**Copyright © 2008 Dmitry Baranovskiy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    // for more information of where this math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (+angle || 0),
        res = [],
        xy,
        rotate = function (x, y, rad) {
            var X = x * Math.cos(rad) - y * Math.sin(rad),
                Y = x * Math.sin(rad) + y * Math.cos(rad);
            return {x: X, y: Y};
        }
    if (!recursive) {
        xy = rotate(x1, y1, -rad);
        x1 = xy.x;
        y1 = xy.y;
        xy = rotate(x2, y2, -rad);
        x2 = xy.x;
        y2 = xy.y;
        var cos = Math.cos(Math.PI / 180 * angle),
            sin = Math.sin(Math.PI / 180 * angle),
            x = (x1 - x2) / 2,
            y = (y1 - y2) / 2;
        var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
        if (h > 1) {
            h = Math.sqrt(h);
            rx = h * rx;
            ry = h * ry;
        }
        var rx2 = rx * rx,
            ry2 = ry * ry,
            k = (large_arc_flag == sweep_flag ? -1 : 1) *
                Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
            cx = k * rx * y / ry + (x1 + x2) / 2,
            cy = k * -ry * x / rx + (y1 + y2) / 2,
            f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
            f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

        f1 = x1 < cx ? Math.PI - f1 : f1;
        f2 = x2 < cx ? Math.PI - f2 : f2;
        f1 < 0 && (f1 = Math.PI * 2 + f1);
        f2 < 0 && (f2 = Math.PI * 2 + f2);
        if (sweep_flag && f1 > f2) {
            f1 = f1 - Math.PI * 2;
        }
        if (!sweep_flag && f2 > f1) {
            f2 = f2 - Math.PI * 2;
        }
    } else {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
        var f2old = f2,
            x2old = x2,
            y2old = y2;
        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
        x2 = cx + rx * Math.cos(f2);
        y2 = cy + ry * Math.sin(f2);
        res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
        return [m2, m3, m4].concat(res);
    } else {
        res = [m2, m3, m4].concat(res).join().split(",");
        var newres = [];
        for (var i = 0, ii = res.length; i < ii; i++) {
            newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
        }
        return newres;
    }
}








