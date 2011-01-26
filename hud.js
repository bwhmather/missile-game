//==============================================================================
// HUD
//==============================================================================

MG.hud = (function () {
    var mRadarMissilePositionDot;
    var mRadarMissileTargetDot;

    var mSpeedometerSpeedText;
    var mSpeedometerBar;

    var mLevelIndicatorText;

    var mProgressBar;
    var mBestProgressBar;

    var mLivesIndicatorMissiles;
    var mLivesIndicatorInfinite;
    var mLivesIndicatorNone;

    return {

        init: function () {
            var rootNode = document.getElementById('hud');

            // ----------------------------------------------------------- Radar
            mRadarMissilePositionDot = document.getElementById('hud-radar-scope-missile');
            mRadarMissileTargetDot = document.getElementById('hud-radar-scope-missile-target');


            // ----------------------------------------------------- Speedometer
            mSpeedometerSpeedText = document.createTextNode('');
            document.getElementById('hud-speedometer-speed-text').appendChild(mSpeedometerSpeedText);
            
            mSpeedometerBar = document.getElementById('hud-speedometer-bar');
          

            // ------------------------------------------------- Level Indicator
            mLevelIndicatorText = document.createTextNode('');
            document.getElementById('hud-level-indicator').appendChild(mLevelIndicatorText);

            // ---------------------------------------------- Progress Indicator
            mProgressBar = document.getElementById('hud-progress-indicator-progress');
            mBestProgressBar = document.getElementById('hud-progress-indicator-best-progress');

            // ---------------------------------------------------- Life Counter
            mLivesIndicatorInfinite = document.getElementById('hud-lives-indicator-infinite');
            mLivesIndicatorNone = document.getElementById('hud-lives-indicator-none');

            mLivesIndicatorMissiles = [];
            for (var i=0; i<5; i++) {
                mLivesIndicatorMissiles[i] = document.getElementById('hud-lives-indicator-missile-' + (i+1));
            }

            rootNode.setAttribute('visibility', 'visible');
        },

        update: function (dt) {

            // ----------------------------------------------------------- Radar

            var x,y;

            var scopeRadius = 0.5;
            var missileTarget = MG.missile.getTarget();

            x = scopeRadius + 0.95 * scopeRadius * missileTarget.x
                                   / MG.TUNNEL_RADIUS;
            y = scopeRadius + 0.95 * scopeRadius * missileTarget.y
                                   / MG.TUNNEL_RADIUS;

            mRadarMissileTargetDot.setAttribute('cx', String(x));
            mRadarMissileTargetDot.setAttribute('cy', String(y));


            var missilePosition = MG.missile.getPosition();

            x = scopeRadius + 0.95 * scopeRadius * missilePosition.x
                                   / MG.TUNNEL_RADIUS;
            y = scopeRadius + 0.95 * scopeRadius * missilePosition.y
                                   / MG.TUNNEL_RADIUS;

            mRadarMissilePositionDot.setAttribute('cx', String(x));
            mRadarMissilePositionDot.setAttribute('cy', String(y));

            // ----------------------------------------------------- Speedometer
            var speed = MG.missile.getVelocity();
            mSpeedometerSpeedText.data = Math.floor(speed);
            
            // TODO work out the maximum speed properly and put a cap on the level with a nice victory screen
            mSpeedometerBar.setAttribute('x', speed/2000 - 1);

            // ------------------------------------------------- Level Indicator
            mLevelIndicatorText.data = MG.game.getLevelString();

            // ---------------------------------------------- Progress Indicator
            var progress = MG.game.getProgress();
            mProgressBar.setAttribute('transform', 'translate(0,'+progress+')');

            var bestProgress = MG.game.getBestProgress();
            mBestProgressBar.setAttribute('transform', 'translate(0,'+bestProgress+')');


            // ---------------------------------------------------- Life Counter
            var lives = MG.game.getNumLives();
            switch (lives) {
              case Infinity:
                mLivesIndicatorInfinite.setAttribute('visibility', 'visible');
                mLivesIndicatorNone.setAttribute('visibility', 'hidden');

                for (var i=0; i<5; i++) {
                    mLivesIndicatorMissiles[i].setAttribute('visibility', 'hidden');
                }
                break;
              case 0:
                mLivesIndicatorInfinite.setAttribute('visibility', 'hidden');
                mLivesIndicatorNone.setAttribute('visibility', 'visible');

                for (var i=0; i<5; i++) {
                    mLivesIndicatorMissiles[i].setAttribute('visibility', 'hidden');
                }
                break;
              default:
                mLivesIndicatorInfinite.setAttribute('visibility', 'hidden');
                mLivesIndicatorNone.setAttribute('visibility', 'hidden');

                for (var i=0; i<5; i++) {
                    mLivesIndicatorMissiles[i].setAttribute('visibility', i<lives ? 'visible' : 'hidden');
                }
                break;
            }
        },

        updateDOM: function () {
            // TODO
        }
    };
}());
