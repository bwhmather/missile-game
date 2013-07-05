/*****
*
*   Shape.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Shape.prototype             = new EventHandler();
Shape.prototype.constructor = Shape;
Shape.superclass            = EventHandler.prototype;


/*****
*
*   constructor
*
*****/
function Shape(svgNode) {
    if ( arguments.length > 0 ) {
        this.init(svgNode);
    }
}


/*****
*
*   init
*
*****/
Shape.prototype.init = function(svgNode) {
    this.svgNode = svgNode;

    this.locked   = false;
    this.visible  = true;
    this.selected = false;

    this.callback = null;

    this.lastUpdate = null;
}


/*****
*
*   show
*
*****/
Shape.prototype.show = function(state) {
    var display = ( state ) ? "inline" : "none";

    this.visible = state;
    this.svgNode.setAttributeNS(null, "display", display);
};


/*****
*
*   refresh
*
*****/
Shape.prototype.refresh = function() {
    // abstract method
};


/*****
*
*   update
*
*****/
Shape.prototype.update = function() {
    this.refresh();

    if ( this.owner ) this.owner.update(this);

    if ( this.callback != null ) this.callback(this);
};


/*****
*
*   translate
*
*****/
Shape.prototype.translate = function(delta) {
    // abstract method
};


/*****
*
*   select
*
*****/
Shape.prototype.select = function(state) {
    this.selected = state;
};


/*****
*
*   registerHandles
*
*****/
Shape.prototype.registerHandles = function() {
    // abstract method
};


/*****
*
*   unregisterHandles
*
*****/
Shape.prototype.unregisterHandles = function() {
    // abstract method
};


/*****
*
*   selectHandles
*
*****/
Shape.prototype.selectHandles = function(select) {
    // abstract method
};


/*****
*
*   showHandles
*
*****/
Shape.prototype.showHandles = function(state) {
    // abstract method
};


/*****
*
*   event handlers
*
*****/

/******
*
*   mousedown
*
*****/
Shape.prototype.mousedown = function(e) {
    if ( !this.locked ) {
        if ( e.shiftKey ) {
            if ( this.selected ) {
                mouser.unregisterShape(this);
            } else {
                mouser.registerShape(this);
                this.showHandles(true);
                this.selectHandles(true);
                this.registerHandles();
            }
        } else {
            if ( this.selected ) {
                this.selectHandles(true);
                this.registerHandles();
            } else {
                mouser.unregisterShapes();
                mouser.registerShape(this);
                this.showHandles(true);
                this.selectHandles(false);
            }
        }
    }
};

