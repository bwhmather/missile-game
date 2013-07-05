/*****
*
*   Vector2D.js
*
*   copyright 2001-2002, Kevin Lindsey
*
*****/

/*****
*
*   constructor
*
*****/
function Vector2D(x, y) {
    if ( arguments.length > 0 ) {
        this.x = x;
        this.y = y;
    }
}


/*****
*
*   length
*
*****/
Vector2D.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};


/*****
*
*   dot
*
*****/
Vector2D.prototype.dot = function(that) {
    return this.x*that.x + this.y*that.y;
};


/*****
*
*   cross
*
*****/
Vector2D.prototype.cross = function(that) {
    return this.x*that.y - this.y*that.x;
}


/*****
*
*   unit
*
*****/
Vector2D.prototype.unit = function() {
    return this.divide( this.length() );
};


/*****
*
*   unitEquals
*
*****/
Vector2D.prototype.unitEquals = function() {
    this.divideEquals( this.length() );

    return this;
};


/*****
*
*   add
*
*****/
Vector2D.prototype.add = function(that) {
    return new Vector2D(this.x + that.x, this.y + that.y);
};


/*****
*
*   addEquals
*
*****/
Vector2D.prototype.addEquals = function(that) {
    this.x += that.x;
    this.y += that.y;

    return this;
};


/*****
*
*   subtract
*
*****/
Vector2D.prototype.subtract = function(that) {
    return new Vector2D(this.x - that.x, this.y - that.y);
};


/*****
*
*   subtractEquals
*
*****/
Vector2D.prototype.subtractEquals = function(that) {
    this.x -= that.x;
    this.y -= that.y;

    return this;
};


/*****
*
*   multiply
*
*****/
Vector2D.prototype.multiply = function(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
};


/*****
*
*   multiplyEquals
*
*****/
Vector2D.prototype.multiplyEquals = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
};


/*****
*
*   divide
*
*****/
Vector2D.prototype.divide = function(scalar) {
    return new Vector2D(this.x / scalar, this.y / scalar);
};


/*****
*
*   divideEquals
*
*****/
Vector2D.prototype.divideEquals = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;

    return this;
};


/*****
*
*   perp
*
*****/
Vector2D.prototype.perp = function() {
    return new Vector2D(-this.y, this.x);
};


/*****
*
*   perpendicular
*
*****/
Vector2D.prototype.perpendicular = function(that) {
    return this.subtract(this.project(that));
};


/*****
*
*   project
*
*****/
Vector2D.prototype.project = function(that) {
    var percent = this.dot(that) / that.dot(that);

    return that.multiply(percent);
};


/*****
*
*   toString
*
*****/
Vector2D.prototype.toString = function() {
    return this.x + "," + this.y;
};


/*****
*
*   fromPoints
*
*****/
Vector2D.fromPoints = function(p1, p2) {
    return new Vector2D(
        p2.x - p1.x,
        p2.y - p1.y
    );
};
