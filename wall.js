MG.tunnelWall = (function (rootNode) {
    var DTHETA = 20;
    var NUM_SEGMENTS = 5;

    var NEAR_CLIPPING_PLANE = 25;

    var GRADIENT_START = MG.LINE_OF_SIGHT;
    var GRADIENT_STOP  = GRADIENT_START - MG.BARRIER_SPACING;


    var mTheta = 0;

    var mSegments = [];

    return {
        init: function (rootNode) {

            var gradient = document.createElementNS(NAMESPACE_SVG, 'linearGradient');
            rootNode.appendChild(gradient);
            gradient.id = 'tunnel-wall-segment-fade-gradient';

            var gradientStart = document.createElementNS(NAMESPACE_SVG, 'stop');
            gradientStart.setAttribute('offset', (100*NEAR_CLIPPING_PLANE / GRADIENT_START) + '%');
            gradientStart.setAttribute('stop-color', '#fff');
            gradient.appendChild(gradientStart);

            var gradientStop = document.createElementNS(NAMESPACE_SVG, 'stop');
            gradientStop.setAttribute('offset', (100*NEAR_CLIPPING_PLANE / GRADIENT_STOP) + '%');
            gradientStop.setAttribute('stop-color', '#000');
            gradient.appendChild(gradientStop);

            for (var i=0; i < NUM_SEGMENTS; i++) {

                mSegments[i] = document.createElementNS(NAMESPACE_SVG, 'path');
                mSegments[i].setAttribute('class', 'wall-segment-dark');
                mSegments[i].setAttribute('d', 'M 0,0 l 100,5 l 0,-5 z');

                mSegments[i].setAttribute('fill', 'url(#tunnel-wall-segment-fade-gradient)');


                rootNode.appendChild(mSegments[i]) ;
            }

            this.updateDOM(0,0,0);
        },

        update: function (dt) {
            mTheta = mTheta + dt * DTHETA;
        },

        updateDOM: function (x, y, offset) {

            for (var i=0; i<NUM_SEGMENTS; i++) {
                var segmentTheta = mTheta + 360*i/NUM_SEGMENTS;

                var x_ = -x * Math.cos(segmentTheta*Math.PI/180) + -y * Math.sin(segmentTheta*Math.PI/180);
                var y_ = -x * Math.sin(segmentTheta*Math.PI/180) +  y * Math.cos(segmentTheta*Math.PI/180);

                var scale_x_ = MG.PROJECTION_PLANE_DISTANCE * (1 - x_/MG.TUNNEL_RADIUS)
                             / (Math.tan(Math.PI * MG.FIELD_OF_VIEW/360.0)*NEAR_CLIPPING_PLANE);
                var scale_y_ = MG.PROJECTION_PLANE_DISTANCE
                             / (Math.tan(Math.PI * MG.FIELD_OF_VIEW/360.0)*NEAR_CLIPPING_PLANE);

                var skew = 180*Math.atan(y_/MG.TUNNEL_RADIUS)/Math.PI;

                mSegments[i].setAttribute('transform', 'rotate(' + segmentTheta + ') '
                                                     + 'scale(' + scale_x_ + ',' + scale_y_ + ') '
                                                     + 'skewY(' + skew + ')' );



            }
        }
    }
}());
