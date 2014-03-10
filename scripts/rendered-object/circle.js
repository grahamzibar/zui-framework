(function() {

    // constructor
    ZUI.RenderedObject.Circle = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   radius
        //   radiusScale
        //   hRadius
        //   hRadiusScale
        //   vRadius
        //   vRadiusScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                radius: 0,
                radiusScale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                hRadius: that.radius,
                hRadiusScale: that.radiusScale,
                vRadius: that.radius,
                vRadiusScale: that.radiusScale
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
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Circle);

    // render
    ZUI.RenderedObject.Circle.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedRadius = ZUI.Helper.interpretScale(this.radius, this.radiusScale);
        this.renderedHRadius = ZUI.Helper.interpretScale(this.hRadius, this.hRadiusScale);
        this.renderedVRadius = ZUI.Helper.interpretScale(this.vRadius, this.vRadiusScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt({
            x: this.renderedPosition.x + this.renderedRadius,
            y: this.renderedPosition.y + this.renderedRadius
        }, this.renderedPositionOffset, this.renderedRadius * 2, this.renderedRadius * 2, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch * this.renderedHRadius, this.vStretch * this.renderedVRadius);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        this._private.context.arc(0, 0, 1, 0, 2 * Math.PI);
        this._private.context.closePath();
        this._private.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

})();
