
MG.init = function () {
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

