MG.missile = (function () {

    var ACCELERATION_TIME_CONSTANT = 1.0;
    var DRIFT_DAMPING = 0.25;

    var MAX_RADIUS = 0.8*MG.TUNNEL_RADIUS;

    var STATE_CRASHED = 'crashed';
    var STATE_AUTOPILOT = 'autopilot';
    var STATE_MANUAL = 'manual';

    var mState;

    var mOffset;
    var mVelocity;
    var mTargetVelocity;

    var mX;
    var mY;

    var mTargetX;
    var mTargetY;

    var mDamping;

    var mDriftVelX;
    var mDriftVelY;
    var mDriftCounter;


    return {
        init: function () {
            this.reset();
        },


        reset: function (){
            mState = STATE_AUTOPILOT;

            mOffset = 200.0;
            mVelocity = 0.0;
            mTargetVelocity = 400.0;

            mX = 0.0;
            mY = 0.0;

            mTargetX = 0.0;
            mTargetY = 0.0;

            mDamping = 0.25;

            mDriftVelX = 0.0;
            mDriftVelY = 0.0;
            mDriftCounter = 1.0;

        },


        update: function (dt) {

            switch (mState) {
                case STATE_AUTOPILOT:
                    // TODO    make this all less hard coded
                    mDriftCounter -= dt;
                    if (mDriftCounter < 0) {
                        mDriftCounter = 1.1 + 0.9*Math.random();

                        mDriftVelX = (MG.TUNNEL_RADIUS*(Math.random()-0.5) - mTargetX)/1.5;
                        mDriftVelY = (MG.TUNNEL_RADIUS*(Math.random()-0.5) - mTargetY)/1.5;
                    }
                    mTargetX += mDriftVelX*dt;
                    mTargetY += mDriftVelY*dt;
                    // FALLTHROUGH
                case STATE_MANUAL:

                    mX += (mTargetX - mX) * dt / DRIFT_DAMPING;
                    mY += (mTargetY - mY) * dt / DRIFT_DAMPING;

                    // clamp the missile's position to inside the tunnel wall
                    var radius = Math.sqrt(mX*mX + mY*mY);
                    var newRadius = Math.min(MAX_RADIUS, radius);

                    mX = (radius === 0) ? 0 : mX*newRadius/radius;
                    mY = (radius === 0) ? 0 : mY*newRadius/radius;

                    mVelocity += dt*(mTargetVelocity - mVelocity)/ACCELERATION_TIME_CONSTANT;
                    break;
                case STATE_CRASHED:
                    mVelocity += dt*MG.BARRIER_SPACING*mVelocity/(mOffset - MG.BARRIER_SPACING);
                    break;
                default:
            }
            mOffset -= mVelocity * dt;
        },


        getPosition: function () {
            return {x: mX, y:mY};
        },

        getTarget: function () {
            return {x: mTargetX, y:mTargetY};
        },

        getOffset: function () {
            return mOffset;
        },

        getVelocity: function () {
            return mVelocity;
        },


        setTarget: function (targetX, targetY) {
            if (mState === STATE_MANUAL) {
                mTargetX = targetX;
                mTargetY = targetY;
            }
        },

        setVelocity: function (velocity) {
            mTargetVelocity = velocity;
        },


        setManual: function () {
            mState = STATE_MANUAL;
        },

        setAutopilot: function () {
            mState = STATE_AUTOPILOT;
        },


        onBarrierPassed: function () {
            mOffset += MG.BARRIER_SPACING;
        },

        onCrash: function () {
            // the last update must be unrolled to stop the missile 'crashing' again
            // assume the game is running at about 60fps
            mOffset += mVelocity*2/60;
            mVelocity = -mVelocity;

            mState = STATE_CRASHED;
        }
    };
}());
