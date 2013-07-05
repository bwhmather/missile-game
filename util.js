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
