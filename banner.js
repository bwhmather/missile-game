MG.banner = (function () {
    var SHOW_TIME = 1.1;
    var HIDE_TIME = 0.8;

    var HIDDEN = "hidden";
    var VISIBLE = "visible";
    var MESSAGE_QUEUED = "message-queued";

    var rootNode;

    var titleNode;
    var textNode;

    var visibility;

    var state;



    return {
        init: function () {
            visibility = 0.0;
            state = HIDDEN;

            rootNode = document.getElementById('banner');

            var titleBoxNode = document.getElementById('banner-title');
            titleNode = document.createTextNode("TEST");
            titleBoxNode.appendChild(titleNode);

            var textBoxNode = document.getElementById('banner-text');
            textNode = document.createTextNode("TEST 2");
            textBoxNode.appendChild(textNode);

            rootNode.setAttribute('visibility', 'visible');

        },

        update: function (dt) {
            switch (state) {
              case VISIBLE:
                visibility += dt/SHOW_TIME;
                break;
              case MESSAGE_QUEUED:
                if (visibility === 0) {
                    state = VISIBLE;

                    titleNode.data = title;
                    textNode.data  = text;
                }
                // FALLTHROUGH
              case HIDDEN:
                visibility -= dt/HIDE_TIME;
                break;
            }
            visibility = Math.max(0,Math.min(1, visibility));
        },

        updateDOM: function () {
            rootNode.setAttribute('width', (30 + 80*(0.5 + 0.5*Math.cos(Math.PI*visibility))) + '%');
        },


        hide: function () {
            state = HIDDEN;

        },

        show: function (newTitle, newText) {

            title = String(newTitle);
            text = String(newText);

            state = MESSAGE_QUEUED;
        },

        isFullyVisible: function () {
            return visibility === 1;
        }
        
    };
}());


