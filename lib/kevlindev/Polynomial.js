/*****
*
*   Polynomial.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

Polynomial.TOLERANCE = 1e-6;
Polynomial.ACCURACY  = 6;


/*****
*
*   interpolate - class method
*
*****/
Polynomial.interpolate = function(xs, ys, n, offset, x) {
    if ( xs.constructor !== Array || ys.constructor !== Array )
        throw new Error("Polynomial.interpolate: xs and ys must be arrays");
    if ( isNaN(n) || isNaN(offset) || isNaN(x) )
        throw new Error("Polynomial.interpolate: n, offset, and x must be numbers");

    var y  = 0;
    var dy = 0;
    var c = new Array(n);
    var d = new Array(n);
    var ns = 0;
    var result;

    var diff = Math.abs(x - xs[offset]);
    for ( var i = 0; i < n; i++ ) {
        var dift = Math.abs(x - xs[offset+i]);

        if ( dift < diff ) {
            ns = i;
            diff = dift;
        }
        c[i] = d[i] = ys[offset+i];
    }
    y = ys[offset+ns];
    ns--;

    for ( var m = 1; m < n; m++ ) {
        for ( var i = 0; i < n-m; i++ ) {
            var ho = xs[offset+i] - x;
            var hp = xs[offset+i+m] - x;
            var w = c[i+1]-d[i];
            var den = ho - hp;

            if ( den == 0.0 ) {
                result = { y: 0, dy: 0};
                break;
            }

            den = w / den;
            d[i] = hp*den;
            c[i] = ho*den;
        }
        dy = (2*(ns+1) < (n-m)) ? c[ns+1] : d[ns--];
        y += dy;
    }

    return { y: y, dy: dy };
};


/*****
*
*   constructor
*
*****/
function Polynomial() {
    this.init( arguments );
}


/*****
*
*   init
*
*****/
Polynomial.prototype.init = function(coefs) {
    this.coefs = new Array();

    for ( var i = coefs.length - 1; i >= 0; i-- )
        this.coefs.push( coefs[i] );

    this._variable = "t";
    this._s = 0;
};


/*****
*
*   eval
*
*****/
Polynomial.prototype.eval = function(x) {
    if ( isNaN(x) )
        throw new Error("Polynomial.eval: parameter must be a number");

    var result = 0;

    for ( var i = this.coefs.length - 1; i >= 0; i-- )
        result = result * x + this.coefs[i];

    return result;
};


/*****
*
*   add
*
*****/
Polynomial.prototype.add = function(that) {
    var result = new Polynomial();
    var d1 = this.getDegree();
    var d2 = that.getDegree();
    var dmax = Math.max(d1,d2);

    for ( var i = 0; i <= dmax; i++ ) {
        var v1 = (i <= d1) ? this.coefs[i] : 0;
        var v2 = (i <= d2) ? that.coefs[i] : 0;

        result.coefs[i] = v1 + v2;
    }

    return result;
};


/*****
*
*   multiply
*
*****/
Polynomial.prototype.multiply = function(that) {
    var result = new Polynomial();

    for ( var i = 0; i <= this.getDegree() + that.getDegree(); i++ )
        result.coefs.push(0);

    for ( var i = 0; i <= this.getDegree(); i++ )
        for ( var j = 0; j <= that.getDegree(); j++ )
            result.coefs[i+j] += this.coefs[i] * that.coefs[j];

    return result;
};


/*****
*
*   divide_scalar
*
*****/
Polynomial.prototype.divide_scalar = function(scalar) {
    for ( var i = 0; i < this.coefs.length; i++ )
        this.coefs[i] /= scalar;
};


/*****
*
*   simplify
*
*****/
Polynomial.prototype.simplify = function() {
    for ( var i = this.getDegree(); i >= 0; i-- ) {
        if ( Math.abs( this.coefs[i] ) <= Polynomial.TOLERANCE )
            this.coefs.pop();
        else
            break;
    }
};


/*****
*
*   bisection
*
*****/
Polynomial.prototype.bisection = function(min, max) {
    var minValue = this.eval(min);
    var maxValue = this.eval(max);
    var result;
    
    if ( Math.abs(minValue) <= Polynomial.TOLERANCE )
        result = min;
    else if ( Math.abs(maxValue) <= Polynomial.TOLERANCE )
        result = max;
    else if ( minValue * maxValue <= 0 ) {
        var tmp1  = Math.log(max - min);
        var tmp2  = Math.LN10 * Polynomial.ACCURACY;
        var iters = Math.ceil( (tmp1+tmp2) / Math.LN2 );

        for ( var i = 0; i < iters; i++ ) {
            result = 0.5 * (min + max);
            var value = this.eval(result);

            if ( Math.abs(value) <= Polynomial.TOLERANCE ) {
                break;
            }

            if ( value * minValue < 0 ) {
                max = result;
                maxValue = value;
            } else {
                min = result;
                minValue = value;
            }
        }
    }

    return result;
};


/*****
*
*   toString
*
*****/
Polynomial.prototype.toString = function() {
    var coefs = new Array();
    var signs = new Array();
    
    for ( var i = this.coefs.length - 1; i >= 0; i-- ) {
        var value = Math.round(this.coefs[i]*1000)/1000;
        //var value = this.coefs[i];

        if ( value != 0 ) {
            var sign = ( value < 0 ) ? " - " : " + ";

            value = Math.abs(value);
            if ( i > 0 )
                if ( value == 1 )
                    value = this._variable;
                else
                    value += this._variable;
            if ( i > 1 ) value += "^" + i;

            signs.push( sign );
            coefs.push( value );
        }
    }

    signs[0] = ( signs[0] == " + " ) ? "" : "-";

    var result = "";
    for ( var i = 0; i < coefs.length; i++ )
        result += signs[i] + coefs[i];
    
    return result;
};


/*****
*
*   trapezoid
*   Based on trapzd in "Numerical Recipes in C", page 137
*
*****/
Polynomial.prototype.trapezoid = function(min, max, n) {
    if ( isNaN(min) || isNaN(max) || isNaN(n) )
        throw new Error("Polynomial.trapezoid: parameters must be numbers");

    var range = max - min;
    var TOLERANCE = 1e-7;

    if ( n == 1 ) {
        var minValue = this.eval(min);
        var maxValue = this.eval(max);
        this._s = 0.5*range*( minValue + maxValue );
    } else {
        var it = 1 << (n-2);
        var delta = range / it;
        var x = min + 0.5*delta;
        var sum = 0;

        for ( var i = 0; i < it; i++ ) {
            sum += this.eval(x);
            x += delta;
        }
        this._s = 0.5*(this._s + range*sum/it);
    }

    if ( isNaN(this._s) )
        throw new Error("Polynomial.trapezoid: this._s is NaN");

    return this._s;
};


/*****
*
*   simpson
*   Based on trapzd in "Numerical Recipes in C", page 139
*
*****/
Polynomial.prototype.simpson = function(min, max) {
    if ( isNaN(min) || isNaN(max) )
        throw new Error("Polynomial.simpson: parameters must be numbers");

    var range = max - min;
    var st = 0.5 * range * ( this.eval(min) + this.eval(max) );
    var t = st;
    var s = 4.0*st/3.0;
    var os = s;
    var ost = st;
    var TOLERANCE = 1e-7;

    var it = 1;
    for ( var n = 2; n <= 20; n++ ) {
        var delta = range / it;
        var x     = min + 0.5*delta;
        var sum   = 0;

        for ( var i = 1; i <= it; i++ ) {
            sum += this.eval(x);
            x += delta;
        }

        t = 0.5 * (t + range * sum / it);
        st = t;
        s = (4.0*st - ost)/3.0;

        if ( Math.abs(s-os) < TOLERANCE*Math.abs(os) )
            break;

        os = s;
        ost = st;
        it <<= 1;
    }

    return s;
};


/*****
*
*   romberg
*
*****/
Polynomial.prototype.romberg = function(min, max) {
    if ( isNaN(min) || isNaN(max) )
        throw new Error("Polynomial.romberg: parameters must be numbers");

    var MAX = 20;
    var K = 3;
    var TOLERANCE = 1e-6;
    var s = new Array(MAX+1);
    var h = new Array(MAX+1);
    var result = { y: 0, dy: 0 };

    h[0] = 1.0;
    for ( var j = 1; j <= MAX; j++ ) {
        s[j-1] = this.trapezoid(min, max, j);
        if ( j >= K ) {
            result = Polynomial.interpolate(h, s, K, j-K, 0.0);
            if ( Math.abs(result.dy) <= TOLERANCE*result.y) break;
        }
        s[j] = s[j-1];
        h[j] = 0.25 * h[j-1];
    }

    return result.y;
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   get degree
*
*****/
Polynomial.prototype.getDegree = function() {
    return this.coefs.length - 1;
};


/*****
*
*   getDerivative
*
*****/
Polynomial.prototype.getDerivative = function() {
    var derivative = new Polynomial();

    for ( var i = 1; i < this.coefs.length; i++ ) {
        derivative.coefs.push(i*this.coefs[i]);
    }

    return derivative;
};


/*****
*
*   getRoots
*
*****/
Polynomial.prototype.getRoots = function() {
    var result;

    this.simplify();
    switch ( this.getDegree() ) {
        case 0: result = new Array();              break;
        case 1: result = this.getLinearRoot();     break;
        case 2: result = this.getQuadraticRoots(); break;
        case 3: result = this.getCubicRoots();     break;
        case 4: result = this.getQuarticRoots();   break;
        default:
            result = new Array();
            // should try Newton's method and/or bisection
    }

    return result;
};


/*****
*
*   getRootsInInterval
*
*****/
Polynomial.prototype.getRootsInInterval = function(min, max) {
    var roots = new Array();
    var root;

    if ( this.getDegree() == 1 ) {
        root = this.bisection(min, max);
        if ( root != null ) roots.push(root);
    } else {
        // get roots of derivative
        var deriv  = this.getDerivative();
        var droots = deriv.getRootsInInterval(min, max);

        if ( droots.length > 0 ) {
            // find root on [min, droots[0]]
            root = this.bisection(min, droots[0]);
            if ( root != null ) roots.push(root);

            // find root on [droots[i],droots[i+1]] for 0 <= i <= count-2
            for ( i = 0; i <= droots.length-2; i++ ) {
                root = this.bisection(droots[i], droots[i+1]);
                if ( root != null ) roots.push(root);
            }

            // find root on [droots[count-1],xmax]
            root = this.bisection(droots[droots.length-1], max);
            if ( root != null ) roots.push(root);
        } else {
            // polynomial is monotone on [min,max], has at most one root
            root = this.bisection(min, max);
            if ( root != null ) roots.push(root);
        }
    }

    return roots;
};


/*****
*
*   getLinearRoot
*
*****/
Polynomial.prototype.getLinearRoot = function() {
    var result = new Array();
    var a = this.coefs[1];
    
    if ( a != 0 )
        result.push( -this.coefs[0] / a );

    return result;
};


/*****
*
*   getQuadraticRoots
*
*****/
Polynomial.prototype.getQuadraticRoots = function() {
    var results = new Array();

    if ( this.getDegree() == 2 ) {
        var a = this.coefs[2];
        var b = this.coefs[1] / a;
        var c = this.coefs[0] / a;
        var d = b*b - 4*c;

        if ( d > 0 ) {
            var e = Math.sqrt(d);
            
            results.push( 0.5 * (-b + e) );
            results.push( 0.5 * (-b - e) );
        } else if ( d == 0 ) {
            // really two roots with same value, but we only return one
            results.push( 0.5 * -b );
        }
    }

    return results;
};


/*****
*
*   getCubicRoots
*
*   This code is based on MgcPolynomial.cpp written by David Eberly.  His
*   code along with many other excellent examples are avaiable at his site:
*   http://www.magic-software.com
*
*****/
Polynomial.prototype.getCubicRoots = function() {
    var results = new Array();

    if ( this.getDegree() == 3 ) {
        var c3 = this.coefs[3];
        var c2 = this.coefs[2] / c3;
        var c1 = this.coefs[1] / c3;
        var c0 = this.coefs[0] / c3;

        var a       = (3*c1 - c2*c2) / 3;
        var b       = (2*c2*c2*c2 - 9*c1*c2 + 27*c0) / 27;
        var offset  = c2 / 3;
        var discrim = b*b/4 + a*a*a/27;
        var halfB   = b / 2;

        if ( Math.abs(discrim) <= Polynomial.TOLERANCE ) disrim = 0;
        
        if ( discrim > 0 ) {
            var e = Math.sqrt(discrim);
            var tmp;
            var root;

            tmp = -halfB + e;
            if ( tmp >= 0 )
                root = Math.pow(tmp, 1/3);
            else
                root = -Math.pow(-tmp, 1/3);

            tmp = -halfB - e;
            if ( tmp >= 0 )
                root += Math.pow(tmp, 1/3);
            else
                root -= Math.pow(-tmp, 1/3);

            results.push( root - offset );
        } else if ( discrim < 0 ) {
            var distance = Math.sqrt(-a/3);
            var angle    = Math.atan2( Math.sqrt(-discrim), -halfB) / 3;
            var cos      = Math.cos(angle);
            var sin      = Math.sin(angle);
            var sqrt3    = Math.sqrt(3);

            results.push( 2*distance*cos - offset );
            results.push( -distance * (cos + sqrt3 * sin) - offset);
            results.push( -distance * (cos - sqrt3 * sin) - offset);
        } else {
            var tmp;

            if ( halfB >= 0 )
                tmp = -Math.pow(halfB, 1/3);
            else
                tmp = Math.pow(-halfB, 1/3);

            results.push( 2*tmp - offset );
            // really should return next root twice, but we return only one
            results.push( -tmp - offset );
        }
    }

    return results;
};


/*****
*
*   getQuarticRoots
*
*   This code is based on MgcPolynomial.cpp written by David Eberly.  His
*   code along with many other excellent examples are avaiable at his site:
*   http://www.magic-software.com
*
*****/
Polynomial.prototype.getQuarticRoots = function() {
    var results = new Array();

    if ( this.getDegree() == 4 ) {
        var c4 = this.coefs[4];
        var c3 = this.coefs[3] / c4;
        var c2 = this.coefs[2] / c4;
        var c1 = this.coefs[1] / c4;
        var c0 = this.coefs[0] / c4;

        var resolveRoots = new Polynomial(
            1, -c2, c3*c1 - 4*c0, -c3*c3*c0 + 4*c2*c0 -c1*c1
        ).getCubicRoots();
        var y       = resolveRoots[0];
        var discrim = c3*c3/4 - c2 + y;

        if ( Math.abs(discrim) <= Polynomial.TOLERANCE ) discrim = 0;

        if ( discrim > 0 ) {
            var e     = Math.sqrt(discrim);
            var t1    = 3*c3*c3/4 - e*e - 2*c2;
            var t2    = ( 4*c3*c2 - 8*c1 - c3*c3*c3 ) / ( 4*e );
            var plus  = t1+t2;
            var minus = t1-t2;

            if ( Math.abs(plus)  <= Polynomial.TOLERANCE ) plus  = 0;
            if ( Math.abs(minus) <= Polynomial.TOLERANCE ) minus = 0;

            if ( plus >= 0 ) {
                var f = Math.sqrt(plus);

                results.push( -c3/4 + (e+f)/2 );
                results.push( -c3/4 + (e-f)/2 );
            }
            if ( minus >= 0 ) {
                var f = Math.sqrt(minus);

                results.push( -c3/4 + (f-e)/2 );
                results.push( -c3/4 - (f+e)/2 );
            }
        } else if ( discrim < 0 ) {
            // no roots
        } else {
            var t2 = y*y - 4*c0;

            if ( t2 >= -Polynomial.TOLERANCE ) {
                if ( t2 < 0 ) t2 = 0;

                t2 = 2*Math.sqrt(t2);
                t1 = 3*c3*c3/4 - 2*c2;
                if ( t1+t2 >= Polynomial.TOLERANCE ) {
                    var d = Math.sqrt(t1+t2);

                    results.push( -c3/4 + d/2 );
                    results.push( -c3/4 - d/2 );
                }
                if ( t1-t2 >= Polynomial.TOLERANCE ) {
                    var d = Math.sqrt(t1-t2);

                    results.push( -c3/4 + d/2 );
                    results.push( -c3/4 - d/2 );
                }
            }
        }
    }

    return results;
};
