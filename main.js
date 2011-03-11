


function init() {
    MG.suspendRedraw();

    MG.fog.init();

    MG.banner.init();
    MG.game.init();
    MG.hud.init();

    MG.unsuspendRedraw();

    setInterval(update, 1000/60);

    document.addEventListener('mousemove', function(evt){
            MG.game.onMouseMove(evt.clientX, evt.clientY);
        }, false);

    window.addEventListener('mousedown', MG.game.onMouseClick, false);

    var lastTick = new Date();

    function update () {
        var thisTick = new Date();
        var dt = timeDifference(lastTick, thisTick);
        lastTick = thisTick;


        MG.suspendRedraw();

        MG.fog.update(dt);

        MG.game.update(dt);
        MG.hud.update(dt);
        MG.banner.update(dt);


        MG.game.updateDOM(dt);
        MG.hud.updateDOM(dt);
        MG.banner.updateDOM(dt);


        MG.unsuspendRedraw();
    }

    function timeDifference (a, b) {
        return (0.001*(b.getMilliseconds() - a.getMilliseconds())
            + (b.getSeconds() - a.getSeconds())
            + 60*(b.getMinutes() - a.getMinutes())
            + 60*60*(b.getHours() - a.getHours())
            + 60*60*24*(b.getDay() - a.getDay()));
    }
}



MG.fog = (function (){
    var SHOW_TIME = 2.0;
    var HIDE_TIME = 4.0;

    var FADING_IN = 1;
    var FADING_OUT = -1;

    var state = FADING_OUT;

    var callback = null;

    var rootNode;
    var visibility = 1.0;

    return {
        init: function () {
            rootNode = document.getElementById('fog');
        },

        fadeIn: function (newCallback) {
            state = FADING_IN;
            rootNode.setAttribute('visibility', 'visible');
            callback = newCallback; // XXX overwrites any previous callback + does not check for undefined
        },

        fadeOut: function (newCallback) {
            state = FADING_OUT;
            callback = newCallback; // XXX overwrites any previous callback + does not check for undefined
        },

        update: function (dt) {
            if (state === FADING_OUT) {
                visibility -= dt/HIDE_TIME;

                if (visibility < 0) {
                    visibility = 0;
                    rootNode.setAttribute('visibility', 'hidden');
                    if (callback !== null) {
                        callback();
                        callback = null;
                    }
                }
            } else {
                visibility += dt/SHOW_TIME;

                if (visibility > 1) {
                    visibility = 1;
                    if (callback !== null) {
                        callback();
                        callback = null;
                    }
                }
            }

            rootNode.setAttribute('opacity', String((0.5 - 0.5*Math.cos(Math.PI*visibility))));
        }
    };
}());
