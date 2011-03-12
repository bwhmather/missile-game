
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

    var lastTick = new Date().getTime();

    function update () {
        var thisTick = new Date().getTime();
        var dt = (thisTick - lastTick)/1000;
        console.log(dt);
        lastTick = thisTick;

        MG.fog.update(dt);
        MG.game.update(dt);
        MG.hud.update(dt);
        MG.banner.update(dt);


        MG.suspendRedraw();

        MG.fog.updateDOM();
        MG.game.updateDOM();
        MG.hud.updateDOM();
        MG.banner.updateDOM();

        MG.unsuspendRedraw();
    }

}

