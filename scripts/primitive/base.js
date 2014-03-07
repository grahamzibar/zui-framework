(function () {

    // constructor
    ZUI.Primitive.Base = function () {
        // save scope for access by child scopes
        var that = this;

        // privates
        that._private = {
            view: arguments[0],
            isUpdated: true
        };

        // confirm parent view is valid
        if (!(this._private.view instanceof ZUI.View.Base)) {
            throw {
                name: 'Exception',
                message: 'Invalid parent view for primitive constructor.'
            }
        }

        // append this primitive to the parent view's array of rendered objects
        this._private.view.renderedObjects.push(this);

        // get properties as object
        var properties = arguments[1];

        // transfer properties to this object
        for (var propertyName in properties) {
            that[propertyName] = properties[propertyName];
        }

        // check for universal properties
        //   data
        //   position {x, y, <scale>}
        //   stroke
        //   strokeColor
        //   strokeThickness
        //   fill
        //   fillColor
        //   alpha
        //   centerAt
        (function () {
            // define default properties
            var defaultProperties = {
                data: {},
                position: {
                    x: 0,
                    y: 0,
                    scale: ZUI.Def.WorldScale
                },
                stroke: true,
                strokeColor: "#000000",
                strokeThickness: 1,
                fill: true,
                fillColor: "#FFFFFF",
                alpha: 1,
                centerAt: {
                    horizontal: ZUI.Def.Left,
                    vertical: ZUI.Def.Top
                }
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();
    };

    // getter
    ZUI.Primitive.Base.prototype.get = function() {
        var obj = this;
        var propertyName = arguments[0];
        if (propertyName === undefined || propertyName === null) {
            propertyName = 0;
        }

        var n = 0;
        while (n < arguments.length - 1) {
            if (obj === undefined || obj === null) {
                return undefined;
            }
            obj = obj[propertyName];
            propertyName = arguments[++n];
            if (propertyName === undefined || propertyName === null) {
                propertyName = 0;
            }
        }

        return obj[propertyName];
    };

    // setter
    ZUI.Primitive.Base.prototype.set = function() {
        var obj = this;
        var propertyName = arguments[0];
        if (propertyName === undefined || propertyName === null) {
            propertyName = 0;
        }

        var n = 0;
        while (n < arguments.length - 2) {
            if (obj === undefined || obj === null) {
                return undefined;
            }
            obj = obj[propertyName];
            propertyName = arguments[++n];
            if (propertyName === undefined || propertyName === null) {
                propertyName = 0;
            }
        }

        this._private.isUpdated = true;

        return obj[propertyName] = arguments[n + 1];
    }

    // remove
    ZUI.Primitive.Base.prototype.remove = function () {
        ZUI.Helper.removeFromArray(this._private.view.renderedObjects, this);
    };

    // render (abstract)
    ZUI.Primitive.Base.prototype.render = function () {};

})();