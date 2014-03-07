(function () {

    // constructor
    ZUI.RenderedObject.Base = function (properties) {
        // save scope for access by child scopes
        var that = this;

        // private properties
        that._private = {
            isUpdated: true,
            isReady: false
        };

        // transfer properties to this object
        for (var propertyName in properties) {
            that[propertyName] = properties[propertyName];
        }

        // assign default to undefined properties
        //   data
        //   position {x, y, scale}
        //   stroke
        //   strokeColor
        //   strokeThickness
        //   fill
        //   fillColor
        //   alpha
        //   centerAt {horizontal, vertical}
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
    ZUI.RenderedObject.Base.prototype.get = function() {
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
    ZUI.RenderedObject.Base.prototype.set = function() {
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

    // add to view
    ZUI.RenderedObject.Base.prototype.addToView = function(view) {
        this._private.view = view;
        view.renderedObjects.push(this);
        return this;
    };

    // remove from view
    ZUI.RenderedObject.Base.prototype.removeFromView = function () {
        ZUI.Helper.removeFromArray(this._private.view.renderedObjects, this);
        return this;
    };

    // render (abstract)
    ZUI.RenderedObject.Base.prototype.render = function () {};

})();