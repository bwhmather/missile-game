MG.RANDOM_BARRIER = 0;

MG.BARRIER_1 = 1;
MG.BARRIER_2 = 2;
MG.BARRIER_3 = 3;
MG.BARRIER_4 = 4;
MG.BARRIER_5 = 5;
MG.BARRIER_6 = 6;

MG.BLANK_BARRIER = 7;
MG.START_BARRIER = 8;
MG.FINISH_BARRIER = 9;

MG.NUM_RANDOM_BARRIERS = 6;

MG.BARRIER_PATH_IDS = [
        '',
        'barrier-path-1',
        'barrier-path-2',
        'barrier-path-3',
        'barrier-path-4',
        'barrier-path-5',
        'barrier-path-6',
        'barrier-path-blank',
        'barrier-path-blank',
        'barrier-path-finish'];


MG.Barrier = function (rootNode, type) {
    var mTheta = 0.0;
    var mDTheta = 300.0*(0.5 - Math.random());

    var mType = (type === MG.RANDOM_BARRIER) ? Math.ceil(MG.NUM_RANDOM_BARRIERS*Math.random()) : type;

    // The path representing the face nearest the camera
    var mFrontPath = document.getElementById(MG.BARRIER_PATH_IDS[mType]).cloneNode(true);
    mFrontPath.setAttribute('class', 'barrier-path-front');

    // The path partially obscured by the front path, added to give the illusion
    // of thickness and depth.
    var mBackPath = mFrontPath.cloneNode(true);
    mBackPath.setAttribute('class', 'barrier-path-back');

    rootNode.setAttribute('class', 'barrier');
    rootNode.appendChild(mBackPath);
    rootNode.appendChild(mFrontPath);




    /**
     * Checks whether the point specified by x and y will collide with the barrier.
     * Works by counting the number of intersections between the path outlining the
     * barrier and a line between some point outside of the barrier, and the point
     * that is being tested.
     * Returns true if the point intersects the transformed barrier, false otherwise.
     */
    this.collides = function (x, y) {
        // transform the provided coordinates to the coordinate system of the barrier
        var x_ =    x * Math.cos(mTheta*Math.PI/180) + y * Math.sin(mTheta*Math.PI/180);
        var y_ = -x * Math.sin(mTheta*Math.PI/180) + y * Math.cos(mTheta*Math.PI/180);

        // the line to be used for finding the intersections should already exist.
        var lineNode = document.getElementById('collision-line');
        lineNode.setAttribute("x2", x_);
        lineNode.setAttribute("y2", y_);

        // `Line` and `Path` are both part of Kevin Lindsey's svg geometry library.
        // `Path` has been modified to properly support elliptical arc segments.
        var line = new Line(lineNode);
        var path = new Path(mFrontPath);

        var intersections = new Intersection.intersectShapes(path, line);

        return intersections.points.length % 2 == 1;
    }


    this.update = function (dt) {
        mTheta += mDTheta * dt;
    }


    /**
     * Updates the barriers representation in the DOM to reflect changes made at
     * the last update.
     * `x` and `y` define the position of the viewpoint.
     * `offset` is the distance of the barrier from the viewpoint.
     */
    this.updateDOM = function (x, y, offset) {
        var frontScale = MG.PROJECTION_PLANE_DISTANCE / 
                (Math.tan(Math.PI * MG.FIELD_OF_VIEW/360.0)*(offset));

        var backScale    = MG.PROJECTION_PLANE_DISTANCE /
                (Math.tan(Math.PI * MG.FIELD_OF_VIEW/360.0)*(offset + 10));

        mFrontPath.setAttribute('transform',
                "scale(" + frontScale + ") translate(" + x    + "," + y + ") rotate(" + mTheta + ")");
        mBackPath.setAttribute('transform',
                "scale(" + backScale + ") translate(" + x    + "," + y + ") rotate(" + mTheta + ")");

        offset = Math.max(MG.LINE_OF_SIGHT - MG.BARRIER_SPACING ,Math.min(MG.LINE_OF_SIGHT,offset));
        var fog = 100 -100*(MG.LINE_OF_SIGHT - offset)/MG.BARRIER_SPACING;

        mFrontPath.setAttribute('fill' , 'rgb('+(100+fog)+'%,'
                                               +(100+fog)+'%,'
                                               +(100+fog)+'%)');
        mBackPath.setAttribute('fill' ,  'rgb('+(60+fog)+'%,'
                                               +(60+fog)+'%,'
                                               +(60+fog)+'%)');
        mFrontPath.setAttribute('stroke' , 'rgb('+(0+fog)+'%,'
                                                 +(0+fog)+'%,'
                                                 +(0+fog)+'%)');
        mBackPath.setAttribute('stroke' ,  'rgb('+(0+fog)+'%,'
                                                 +(0+fog)+'%,'
                                                 +(0+fog)+'%)');
    }

    this.destroy = function () {
        rootNode.parentNode.removeChild(rootNode);
    }

    this.getType = function () {
        return mType;
    };


}
