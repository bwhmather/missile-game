// Namespace
var MG = {};

//==============================================================================
// Constants
//==============================================================================

NAMESPACE_SVG   = 'http://www.w3.org/2000/svg';
NAMESPACE_XLINK = 'http://www.w3.org/1999/xlink';

//

MG.BARRIERS_ROOT_ELEMENT_ID  = 'barriers';
MG.HUD_ROOT_ELEMENT_ID       = 'hud';
MG.MENU_ROOT_ELEMENT_ID      = 'menu';

MG.BARRIER_SPACING = 650.0;
MG.TUNNEL_RADIUS = 100;
MG.MISSILE_LENGTH = 50.0;

MG.LINE_OF_SIGHT = 1600.0;
MG.FIELD_OF_VIEW = 60.0;
MG.PROJECTION_PLANE_DISTANCE = 100;



//==============================================================================
// Utility Functions
//==============================================================================


MG.suspendRedraw = function () {
      // asv doesn't implement suspendRedraw, so we wrap this in a try-block:
      try {
            document.documentElement.suspendRedraw(0);
      }
      catch(e) {}
};


MG.unsuspendRedraw = function () {
      try {
            document.documentElement.unsuspendRedraw(0);
      }
      catch(e) {}
};


MG.hideMouse = function () {
    var i;
    for (i=0; i<document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i];

        if (styleSheet.title === 'style-hide-mouse') {
            styleSheet.disabled = false;
        }
    }
};

MG.showMouse = function () {
    var i;
    for (i=0; i<document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i];

        if (styleSheet.title === 'style-hide-mouse') {
            styleSheet.disabled = true;
        }
    }
};

/**
 * Temporarily removes a node from the DOM so that it can be edited before be
 * edited out of place.
 * This is useful for ensuring changes propogate to the screen and reportedly
 * improves performance in Firefox (though I haven't been able to test properly)
 * Tasks should avoid modifying nodes that are not descendants of the node that
 * has been removed, as doing so could prevent the removed node from being
 * reinserted properly
 */
MG.removeEditInsert = function (node, task) {
    /* Reomve the node */
    var nextSibling = node.nextSibling ;
    var parent = node.parentNode;
    parent.removeChild(node);

    /* Perform the task */
    task()

    /* Reinsert the node in the same place as before */
    if (nextSibling === null) {
        parent.appendChild(node);
    } else {
        parent.insertBefore(node, nextSibling);
    }
}


