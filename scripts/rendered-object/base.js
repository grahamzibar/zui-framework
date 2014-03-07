(function () {

    // constructor
    ZUI.RenderedObject.Base = function (properties) {
        // private properties
        this._private.isUpdated = true;
        this._private.isReady = false;
        this._private.canvas = document.createElement('canvas');
        this._private.context = this._private.canvas.getContext('2d');

        // set canvas size
        this._private.canvas.width = ZUI.width;
        this._private.canvas.height = ZUI.height;

        // transfer properties to this object
        for (var propertyName in properties) {
            that[propertyName] = properties[propertyName];
        }

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   data
        //   position {x, y}
        //   positionScale
        //   stroke
        //   strokeColor
        //   strokeThickness
        //   strokeThicknessScale
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
                    y: 0
                },
                positionScale: ZUI.Def.WorldScale,
                stroke: true,
                strokeColor: "#000000",
                strokeThickness: 1,
                strokeThicknessScale: ZUI.Def.WorldScale,
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

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.RenderedObject.Base);

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

    // draw
    ZUI.RenderedObject.Base.prototype.draw = function () {
        ZUI.context.drawImage(this._private.canvas, 0, 0);
    };

    // render (abstract)
    ZUI.RenderedObject.Base.prototype.render = function () {
        // clear canvas
        this._private.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // get rendered position
        this.renderedPosition = ZUI.Helper.interpretScale(this.position, this.positionScale);

        // get rendered stroke thickness
        this.renderedStrokeThickness = ZUI.Helper.interpretScale(this.strokeThickness, this.strokeThicknessScale);
    };

    // pointer hit test (abstract)
    ZUI.RenderedObject.Base.prototype.pointerHitTest = function (x, y) {};

})();