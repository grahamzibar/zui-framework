(function() {

    // constructor
    ZUI.Camera.DefaultCamera = function(properties) {
        // call base constructor
        ZUI.Base.call(this);

        // transfer properties to this object
        for (var propertyName in properties) {
            this[propertyName] = properties[propertyName];
        }

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   data
        //   position
        //   truePosition
        //   distance
        //   trueDistance
        //   fov
        //   followRate
        (function () {
            // define default properties
            var defaultProperties = {
                data: {},
                position: {
                    x: 0,
                    y: 0
                },
                truePosition: {
                    x: 0,
                    y: 0
                },
                positionOffset: {
                    x: 0,
                    y: 0
                },
                distance: null,
                trueDistance: null,
                fov: Math.PI / 2,
                followRate: 1
            };
            defaultProperties.distance = defaultProperties.trueDistance = (ZUI.width / 2) / Math.tan(defaultProperties.fov / 2);

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Camera.DefaultCamera);

    // update
    ZUI.Camera.DefaultCamera.prototype.update = function () {
        if (this.truePosition.x != this.position.x) {
            this.truePosition.x += (this.position.x - this.truePosition.x) * this.moveRate;
            if (Math.abs(this.position.x - this.truePosition.x) < this.trueDistance * 0.005) this.truePosition.x = this.position.x;
        }

        if (this.truePosition.y != this.position.y) {
            this.truePosition.y += (this.position.y - this.truePosition.y) * this.moveRate;
            if (Math.abs(this.position.y - this.truePosition.y) < this.trueDistance * 0.005) this.truePosition.y = this.position.y;
        }

        if (this.trueDistance != this.distance) {
            this.trueDistance += (this.distance - this.trueDistance) * this.moveRate;
            if (Math.abs(this.distance - this.trueDistance) < this.trueDistance * 0.005) this.trueDistance = this.distance;
        }
    };

    // set position
    ZUI.Camera.DefaultCamera.prototype.setPosition = function(x, y) {
        this.position.x = this.truePosition.x = x;
        this.position.y = this.truePosition.y = y;
    };

    // set distance
    ZUI.Camera.DefaultCamera.prototype.setDistance = function(distance) {
        this.distance = this.trueDistance = distance;
    };

    // project point
    ZUI.Camera.DefaultCamera.prototype.projectPoint = function(point) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return {
            x: (x - ZUI.camera._x) * pixelsPerUnit + ZUI.width / 2,
            y: (y - ZUI.camera._y) * pixelsPerUnit + ZUI.height / 2,
        };
    };

    // unproject point
    ZUI.Camera.DefaultCamera.prototype.unprojectPoint = function(point) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return {
            x: (x - ZUI.width / 2) / pixelsPerUnit + ZUI.camera.truePosition.x,
            y: (y - ZUI.height / 2) / pixelsPerUnit + ZUI.camera.truePosition.y
        };
    };

    // project distance
    ZUI.Camera.DefaultCamera.prototype.projectDistance = function(distance) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return distance * pixelsPerUnit;
    };

    // unproject distance
    ZUI.Camera.DefaultCamera.prototype.unprojectDistance = function(distance) {
        var pixelsPerUnit = ZUI.width / (Math.tan(this.fov / 2) * this.trueDistance * 2);
        return distance / pixelsPerUnit;
    };

    // reset
    ZUI.Camera.DefaultCamera.prototype.reset = function() {
        this.setPosition(0, 0);
        this.setDistance((ZUI.width / 2) / Math.tan(this.fov / 2));
    };

})();