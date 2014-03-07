(function() {

    // constructor
    ZUI.RenderedObject.Rect = function(properties) {
        // save scope for access by child scopes
        var that = this;

        // call base constructor
        ZUI.RenderedObject.Base.call(that, properties);

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   radius
        //   radiusScale
        //   ltRadius
        //   ltRadiusScale
        //   rtRadius
        //   rtRadiusScale
        //   lbRadius
        //   lbRadiusScale
        //   rbRadius
        //   rbRadiusScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                radius: 0,
                radiusScale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                ltRadius: that.radius,
                ltRadiusScale: that.radiusScale,
                rtRadius: that.radius,
                rtRadiusScale: that.radiusScale,
                lbRadius: that.radius,
                lbRadiusScale: that.radiusScale,
                rbRadius: that.radius,
                rbRadiusScale: that.radiusScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Rect);

})();