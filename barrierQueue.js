MG.barrierQueue = (function () {
    var mBarrierQueue = [];
    var mRootNode;

    return {
        init: function (rootNode) {
            mRootNode = rootNode;
        },

        update: function (dt) {
            // iterate through and update each of the barrierQueue
            for (var i=0; i < mBarrierQueue.length; i++) {
                mBarrierQueue[i].update(dt);
            }
        },

        updateDOM: function (missileX, missileY, missileOffset) {
            var z = 0.0;
            for (var i = 0; i < mBarrierQueue.length; i++) {
                mBarrierQueue[i].updateDOM(missileX, missileY, z + missileOffset);
                z += MG.BARRIER_SPACING;
            }
        },

        /**
         * Adds a new barrier to the end of the queue.
         * The starting angle and angular rate are randomized.
         */
        pushBarrier: function (type) {
            var barrier;

            // Create barrier
            var barrierNode = document.createElementNS(NAMESPACE_SVG, 'g');
            var barrier = new MG.Barrier(barrierNode, type);

            // add barrier to DOM and to internal list
            mBarrierQueue[mBarrierQueue.length] = barrier;

            if (mRootNode.hasChildNodes()) {
                mRootNode.insertBefore(barrierNode, mRootNode.firstChild);
            } else {
                mRootNode.appendChild(barrierNode);
            }
        },

        /**
         * Pops the barrier closest to the missile and adjusts the missile offset so
         * that it relates to the next barrier in the queue.
         */
        popBarrier: function () {
            var barrier = mBarrierQueue[0];
            if (barrier) {
                barrier.destroy();
                mBarrierQueue.shift();
            }
        },

        /**
         * Returns a reference to the barrier at the front of the queue
         */
        nextBarrier: function () {
            return mBarrierQueue[0];
        },

        /**
         * Deletes all barriers and returns the queue to it's original, empty state.
         */
        reset: function () {
            while (!this.isEmpty()){
                this.popBarrier();
            }
        },

        /**
         * Returns true if there are no barriers queued;
         */
        isEmpty: function () {
            return mBarrierQueue.length == 0;
        },

        numBarriers: function () {
            return mBarrierQueue.length;
        }
    };
}());



