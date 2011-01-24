



MG.game = (function () {

    var STATE_WAIT_START = 'wait_start'
    var STATE_STARTING = 'starting';
    var STATE_RUNNING  = 'running';
    var STATE_FINISHED = 'finished';
    var STATE_CRASHED  = 'crashed';

    var STARTING_LIVES = 5;

    var LEVEL_NUM_BARRIERS = 20;



    var START_MESSAGE = {
        title: getLevelString,
        text: function () {return 'CLICK TO BEGIN'}
    };
    var CRASH_MESSAGE = {
        title: function () {return 'CRASHED'},
        text:  function () {return 'CLICK TO RETRY'}
    };
    var GAME_OVER_MESSAGE = {
        title: function () {return 'GAME OVER'},
        text:  function () {return 'CLICK TO START AGAIN'}
    };
    var FINISH_MESSAGE = {
        title: function () {return 'LEVEL COMPLETED'},
        text: function () {return 'CLICK TO CONTINUE'}
    };



    var mState = STATE_WAIT_START;

    var mLives = STARTING_LIVES;
    var mLevel = 0;

    var mRemainingBarriers = 0;
    var mBarriersToPass = 0;

    var mProgress = 0.0;
    var mBestProgress = 0.0;


    var NUM_WOOSH_INSTANCES = 3;
    var mWoosh = [];
    var mLastWoosh = 0;
    var mWooshPlaying = false;

    /* Returns a consistent string describing the current level */ 
    function getLevelString() {
        return mLevel ? 'LEVEL ' + mLevel : 'QUALIFYING LEVEL';
    }


    function goWaitStartLevel() {
        // TODO figure out how to access public methods from private functions!
        MG.banner.show(START_MESSAGE.text(), START_MESSAGE.text());

        MG.missile.setAutopilot();
        MG.missile.setVelocity(400 + 100*mLevel);

        mState = STATE_WAIT_START;
    }

    function goRun() {
        MG.banner.hide();

        mRemainingBarriers = LEVEL_NUM_BARRIERS;
        mBarriersToPass = LEVEL_NUM_BARRIERS;

        MG.missile.setManual();


        MG.barrierQueue.pushBarrier(MG.START_BARRIER);

        mState = STATE_STARTING;
    }

    function goFinish() {
        MG.banner.show(FINISH_MESSAGE.title(), FINISH_MESSAGE.text());

        MG.missile.setAutopilot();
        MG.missile.setVelocity(300 + 100*mLevel);

        mState = STATE_FINISHED;
    }

    function goCrash() {
        if (mLives === 0) {
            MG.banner.show(GAME_OVER_MESSAGE.title(), GAME_OVER_MESSAGE.text());
        } else {
            MG.banner.show(CRASH_MESSAGE.title(), CRASH_MESSAGE.text());
        }

        mState = STATE_CRASHED;

        // play crash animation
//        var explosionProto = document.getElementById('explosion');
//        var explosion = explosionProto.cloneNode(true);
//        explosion.firstChild.beginElement();
//        setTimeout(function (){rootNode.removeChild(explosion);}, 3000);

//        var rootNode = document.getElementById('tunnel');
//        rootNode.appendChild(explosion);

        


    }


    //==========================================================================

    return {
        init: function () {
            var rootNode = document.getElementById('tunnel');

            MG.missile.init();

            //

            var wallNode;

            wallNode = document.createElementNS(NAMESPACE_SVG, 'g');
            wallNode.setAttribute('transform', 'scale(1,-1)');

            MG.tunnelWall.init(wallNode);

            rootNode.appendChild(wallNode);

            //

            var barrierQueueNode;

            barrierQueueNode = document.createElementNS(NAMESPACE_SVG, 'g');
            barrierQueueNode.setAttribute('transform', 'scale(1,-1)');

            MG.barrierQueue.init(barrierQueueNode);

            rootNode.appendChild(barrierQueueNode);

            //

            for (var i=0; i<NUM_WOOSH_INSTANCES; i++) {
                mWoosh[i] = new Audio("woosh2.mp3");
            }

            //

            rootNode.setAttribute('visibility', 'visible'); 
        },


        update: function (dt) {
            MG.missile.update(dt);    
            MG.tunnelWall.update(dt);
            MG.barrierQueue.update(dt);    

            if (MG.missile.getOffset()/MG.missile.getVelocity() < 0.8 && mWooshPlaying === false && mState !== STATE_CRASHED) {
                mWooshPlaying = true;
//                var woosh = document.getElementById('woosh-sound').cloneNode(true);
//                woosh.setAttribute('autoplay', 'autoplay');
                mLastWoosh++;
                mLastWoosh = mLastWoosh == NUM_WOOSH_INSTANCES ? 0 : mLastWoosh;
                
                mWoosh[mLastWoosh].play();
            }


            // check whether the nearest barrier has been reached and whether the
            //        missile collides with it.
            if (!MG.barrierQueue.isEmpty()) {
                if (MG.missile.getOffset() < MG.MISSILE_LENGTH){
                    var barrier = MG.barrierQueue.nextBarrier();

                    if (barrier.collides(MG.missile.getPosition().x, MG.missile.getPosition().y)) {
                        // CRASH
                        MG.missile.onCrash();
                        goCrash();
                    } else {

                        // BARRIER PASSED
                        MG.barrierQueue.popBarrier();
                        MG.missile.onBarrierPassed();

                        mWooshPlaying = false;

                        // TODO this block makes loads of assumptions about state
                        if (mState === STATE_RUNNING
                         || mState === STATE_STARTING) {
                            switch(barrier.getType()) {
                              case MG.FINISH_BARRIER:
                                goFinish();
                                break;
                              case MG.BLANK_BARRIER:
                                break;
                              case MG.START_BARRIER:
                                mState = STATE_RUNNING;
                                // FALLTHROUGH
                              default:
                                mBarriersToPass--;

                                var startVelocity = 400 + mLevel*100;
                                var finishVelocity = 550 + mLevel*100;

                                MG.missile.setVelocity(startVelocity
                                                         + (startVelocity - finishVelocity)
                                                           * (mBarriersToPass - LEVEL_NUM_BARRIERS)
                                                             / LEVEL_NUM_BARRIERS);
                              break;
                            }
                        }
                    }
                }    
            }

        
            /* Pad the barrier queue with blank barriers so that there are barriers
            as far as can be seen. */
            while (MG.barrierQueue.numBarriers() < MG.LINE_OF_SIGHT/MG.BARRIER_SPACING) {
                var type = MG.BLANK_BARRIER;
    
                if (mState === STATE_RUNNING
                 || mState === STATE_STARTING) {
                    mRemainingBarriers--;
                    if (mRemainingBarriers > 0) {
                        type = MG.RANDOM_BARRIER;
                    } else if (mRemainingBarriers === 0) {
                        type = MG.FINISH_BARRIER;
                    } else {
                        type = MG.BLANK_BARRIER;
                    }
                }
    
                MG.barrierQueue.pushBarrier(type);
            }

            switch (mState) {
              case STATE_RUNNING:
                mProgress = 1 - (mBarriersToPass*MG.BARRIER_SPACING + MG.missile.getOffset())/(LEVEL_NUM_BARRIERS * MG.BARRIER_SPACING);
                mBestProgress = Math.max(mProgress, mBestProgress);
                break;
              case STATE_FINISHED:
                mProgress = 1;
                mBestProgress = 1;
                break;
              case STATE_STARTING:
                mProgress = 0;
              default:
                break;
            }

        },

        updateDOM: function () {
            var position = MG.missile.getPosition();
            var offset = MG.missile.getOffset();

            MG.barrierQueue.updateDOM(-position.x, -position.y, offset);
            MG.tunnelWall.updateDOM(-position.x, -position.y, offset);
        },

        onMouseMove: function (x, y) {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            MG.missile.setTarget(x - 0.5*windowWidth, -(y - 0.5*windowHeight));

        },

        onMouseClick: function () {
            if (MG.banner.isFullyVisible()) {
                switch (mState) {
                  case STATE_WAIT_START:
                    goRun();
                    break;
                  case STATE_FINISHED:
                    mLevel++;

                    mBestProgress = 0.0;

                    goWaitStartLevel();
                    break;
                  case STATE_CRASHED:
                    MG.banner.hide();
                    MG.fog.fadeIn(function() {
                            if (mLives === 0) {
                                mLevel = 0;
                                mLives = STARTING_LIVES;
                                mBestProgress = 0.0;
                            } else {
                                mLives--;
                            }


                            MG.missile.reset();
                            MG.barrierQueue.reset();

                            MG.fog.fadeOut();
                            goWaitStartLevel();
                        });
                    break;
                }
            }
        },

        /* Returns an integer representing the current level */
        getLevel: function () {
            return mLevel;
        },

        /* Returns a consistent string describing the current level */ 
        getLevelString: getLevelString,

        /* Returns the number of times the player can crash before game over. */
        /* If the player crashes with zero lives remaining the game ends */
        getNumLives: function () {
            return mLives;
        },

        /* Returns the progress through the level as a value between 0 and 1,
        where 0 is not yet started and 1 is completed. */
        getProgress: function () {
            return mProgress;       
        },

        getBestProgress: function () {
            return mBestProgress;
        }
    };



}());




