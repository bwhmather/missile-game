MG.barrierQueue = (function () {
    var barrierQueue = [];
    var rootNode;

    return {
        init: function (barrierQueueNode) {
            rootNode = barrierQueueNode;
        },

        update: function (dt) {
            // iterate through and update each of the barrierQueue
            for (var i=0; i < barrierQueue.length; i++) {
                barrierQueue[i].update(dt);
            }
        },

        updateDOM: function (missileX, missileY, missileOffset) {
            var z = 0.0;
            for (var i = 0; i < barrierQueue.length; i++) {
                barrierQueue[i].updateDOM(missileX, missileY, z + missileOffset);
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
            barrierQueue[barrierQueue.length] = barrier;

            if (rootNode.hasChildNodes()) {
                rootNode.insertBefore(barrierNode, rootNode.firstChild);
            } else {
                rootNode.appendChild(barrierNode);
            }
        },

        /**
         * Pops the barrier closest to the missile and adjusts the missile offset so
         * that it relates to the next barrier in the queue.
         */
        popBarrier: function () {
            var barrier = barrierQueue[0];
            if (barrier) {
                barrier.destroy();
                barrierQueue.shift();
            }
        },

        nextBarrier: function () {
            return barrierQueue[0];
        },

        reset: function () {
            while (!this.isEmpty()){
                this.popBarrier();
            }
        },

        isEmpty: function () {
            return !Boolean(barrierQueue.length);
        },

        numBarriers: function () {
            return barrierQueue.length;
        }
    };
}());



