(function () {

    // constructor
    ZUI.Primitive.Base = function () {
        // save scope for access by child scopes
        var that = this;

        // get properties as object
        var properties = arguments[0];

        // transfer properties to this object
        for (var propertyName in properties) {
            that[propertyName] = properties[propertyName];
        }

        // check for universal properties
        //   shape
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
                shape: "rect",
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
                if (that[propertyName] === undefined) {
                    that[propertyName] = defaultProperties[propertyName];
                }
            }
        })();

        // privates
        that._private = {
            isUpdated: true
        }
    };

    // prototype
    ZUI.Primitive.Base.prototype = {
        // getter
        get: function() {
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
        },

        // setter
        set: function() {
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

            return obj[propertyName] = obj[arguments[n + 1]];
        }
    };

})();