(function () {

    // constructor
    ZUI.RenderedObject.Base = function (properties) {
        // call base constructor
        ZUI.Base.call(this);

        // private properties
        this._private.isUpdated = true;
        this._private.isReady = false;
        this._private.canvas = document.createElement('canvas');
        this._private.context = this._private.canvas.getContext('2d');
        this._private.views = [];
        this._private.isHovered = false;

        // set canvas size
        this._private.canvas.width = ZUI.width;
        this._private.canvas.height = ZUI.height;

        // transfer properties to this object
        for (var propertyName in properties) {
            this[propertyName] = properties[propertyName];
        }

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   data
        //   position {x, y}
        //   positionScale
        //   positionOffset {x, y}
        //   positionOffsetScale
        //   rotate
        //   hStretch
        //   vStretch
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
                positionOffset: {
                    x: 0,
                    y: 0
                },
                positionOffsetScale: ZUI.Def.ScreenScale,
                rotate: 0,
                hStretch: 1,
                vStretch: 1,
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

    // property update callback
    ZUI.RenderedObject.Base.prototype.update = function() {
        this._private.isUpdated = true;
        for (var n = 0; n < this._private.views.length; n++) {
            this._private.views[n].isUpdated = true;
        }
    }

    // attach to view
    ZUI.RenderedObject.Base.prototype.attachToView = function(view) {
        this._private.views.push(view);
        view.renderedObjects.push(this);
        view.isUpdated = true;
        return this;
    };

    // detach from view
    ZUI.RenderedObject.Base.prototype.detachFromView = function (view) {
        ZUI.Helper.removeFromArray(this._private.views, view);
        ZUI.Helper.removeFromArray(view.renderedObjects, this);
        view.isUpdated = true;
        return this;
    };

    // draw
    ZUI.RenderedObject.Base.prototype.draw = function () {
        if (this._private.isUpdated) {
            this.render();
        }

        ZUI.context.drawImage(this._private.canvas, 0, 0);
    };

    // point hit test
    ZUI.RenderedObject.Base.prototype.pointHitTest = function (x, y) {
        this._private.context.isPointInPath(x, y);
    };

    // render (abstract)
    ZUI.RenderedObject.Base.prototype.render = function () {
        // reset update flag
        this._private.isUpdated = false;

        // clear canvas
        this._private.context.clearRect(0, 0, this._private.canvas.width, this._private.canvas.height);

        // get rendered position
        this.renderedPosition = ZUI.Helper.interpretScale(this.position, this.positionScale);

        this.renderedPositionOffset = ZUI.Helper.interpretScale(this.positionOffset, this.positionOffsetScale);

        // get rendered stroke thickness
        this.renderedStrokeThickness = ZUI.Helper.interpretScale(this.strokeThickness, this.strokeThicknessScale);
    };

    // force render
    ZUI.RenderedObject.Base.prototype.forceRender = function () {
        this._private.isUpdated = true;
    };

    // remove
    ZUI.RenderedObject.Base.prototype.remove = function () {
        // detach from all views
        for (var n = 0; n < this._private.views.length; n++) {
            this.detachFromView(this._private.views[n]);
        }
    }

})();