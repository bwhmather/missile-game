MG.init = function () {
    MG.fog.init();
    MG.banner.init();
    MG.game.init();
    MG.hud.init();

    document.addEventListener('mousemove', function(evt){
            MG.game.onMouseMove(evt.clientX, evt.clientY);
        }, false);

    window.addEventListener('mousedown', MG.game.onMouseClick, false);

    var lastTick = 0;

    var update = function (dt) {
        MG.fog.update(dt);
        MG.game.update(dt);
        MG.hud.update(dt);
        MG.banner.update(dt);


        MG.fog.updateDOM();
        MG.game.updateDOM();
        MG.hud.updateDOM();
        MG.banner.updateDOM();
    }

    var mainLoop = function(thisTick) {
        thisTick = thisTick || 0;
        var dt = (thisTick - lastTick)/1000;
        // pretend that the frame rate is actually higher if it drops below
        // 10fps in order to avoid wierdness
        if (dt > 1/10) {
            dt = 1/10;
        }

        lastTick = thisTick;

        update(dt);

        window.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

MG.init();
