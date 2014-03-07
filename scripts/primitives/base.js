(function () {

    ZUI.Primitives.Base = function (params) {
        // save scope for access by child scopes
        var self = this;

        // transfer params to this object
        for (var paramName in params) {
            self[paramName] = params[paramName];
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
            for (var propName in defaultProperties) {
                if (self[propName] === undefined) {
                    self[propName] = defaultProperties[propName];
                }
            }
        })();
    };

})();