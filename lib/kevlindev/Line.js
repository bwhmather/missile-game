/*****
*
*   Line.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Line.prototype             = new Shape();
Line.prototype.constructor = Line;
Line.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Line(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
*****/
Line.prototype.init = function(svgNode) {
    if ( svgNode == null || svgNode.localName != "line" )
        throw new Error("Line.init: Invalid localName: " + svgNode.localName);
    
    // Call superclass method
    Line.superclass.init.call(this, svgNode);

    // Init properties
    var x1 = parseFloat( svgNode.getAttributeNS(null, "x1") );
    var y1 = parseFloat( svgNode.getAttributeNS(null, "y1") );
    var x2 = parseFloat( svgNode.getAttributeNS(null, "x2") );
    var y2 = parseFloat( svgNode.getAttributeNS(null, "y2") );

    // Create handles
    this.p1 = new Handle(x1, y1, this);
    this.p2 = new Handle(x2, y2, this);
};


/*****
*
*   realize
*
*****/
Line.prototype.realize = function() {
    this.p1.realize();
    this.p2.realize();

    this.p1.show(false);
    this.p2.show(false);

    this.svgNode.addEventListener("mousedown", this, false);
};


/*****
*
*   refresh
*
*****/
Line.prototype.refresh = function() {
    this.svgNode.setAttributeNS(null, "x1", this.p1.point.x);
    this.svgNode.setAttributeNS(null, "y1", this.p1.point.y);
    this.svgNode.setAttributeNS(null, "x2", this.p2.point.x);
    this.svgNode.setAttributeNS(null, "y2", this.p2.point.y);
};


/*****
*
*   registerHandles
*
*****/
Line.prototype.registerHandles = function() {
    mouser.register(this.p1);
    mouser.register(this.p2);
};


/*****
*
*   unregisterHandles
*
*****/
Line.prototype.unregisterHandles = function() {
    mouser.unregister(this.p1);
    mouser.unregister(this.p2);
};


/*****
*
*   selectHandles
*
*****/
Line.prototype.selectHandles = function(select) {
    this.p1.select(select);
    this.p2.select(select);
};


/*****
*
*   showHandles
*
*****/
Line.prototype.showHandles = function(state) {
    this.p1.show(state);
    this.p2.show(state);
};


/*****
*
*   cut
*
*****/
Line.prototype.cut = function(t) {
    var cutPoint = this.p1.point.lerp(this.p2.point, t);
    var newLine  = this.svgNode.cloneNode(true);
    
    this.p2.point.setFromPoint(cutPoint);
    this.p2.update();
    
    if ( this.svgNode.nextSibling != null )
        this.svgNode.parentNode.insertBefore(
            newLine,
            this.svgNode.nextSibling
        );
    else
        this.svgNode.parentNode.appendChild( newLine );

    var line = new Line(newLine);
    line.realize();
    line.p1.point.setFromPoint(cutPoint);
    line.p1.update();
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getIntersectionParams
*
*****/
Line.prototype.getIntersectionParams = function() {
    return new IntersectionParams(
        "Line",
        [ this.p1.point, this.p2.point ]
    );
};
