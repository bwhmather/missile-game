//==============================================================================
// Utility Functions
//==============================================================================

MG.util = {} ;

MG.util.suspendRedraw = function () {
    document.documentElement.suspendRedraw(0);
};


MG.util.unsuspendRedraw = function () {
    document.documentElement.unsuspendRedraw(0);
};


MG.util.hideMouse = function () {
    var i;
    for (i=0; i<document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i];

        if (styleSheet.title === 'style-hide-mouse') {
            styleSheet.disabled = false;
        }
    }
};

MG.util.showMouse = function () {
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
MG.util.removeEditInsert = function (node, task) {
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

