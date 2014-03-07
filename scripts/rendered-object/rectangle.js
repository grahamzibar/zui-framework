(function() {

    // constructor
    ZUI.RenderedObject.Rectangle = function(properties) {
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
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Rectangle);

    // render
    ZUI.RenderedObject.Rectangle.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);
        this.renderedRadius = ZUI.Helper.interpretScale(this.radius, this.radiusScale);
        this.renderedLtRadius = ZUI.Helper.interpretScale(this.ltRadius, this.ltRadiusScale);
        this.renderedRtRadius = ZUI.Helper.interpretScale(this.rtRadius, this.rtRadiusScale);
        this.renderedLbRadius = ZUI.Helper.interpretScale(this.lbRadius, this.lbRadiusScale);
        this.renderedRbRadius = ZUI.Helper.interpretScale(this.rbRadius, this.rbRadiusScale);

        // adjust rendered radius
        if (this.renderedRadius > this.renderedWidth / 2) this.renderedRadius = this.renderedWidth / 2;
        if (this.renderedRadius > this.renderedHeight / 2) this.renderedRadius = this.renderedHeight / 2;
        if (this.renderedLtRadius > this.renderedWidth / 2) this.renderedLtRadius = this.renderedWidth / 2;
        if (this.renderedLtRadius > this.renderedHeight / 2) this.renderedLtRadius = this.renderedHeight / 2;
        if (this.renderedRtRadius > this.renderedWidth / 2) this.renderedRtRadius = this.renderedWidth / 2;
        if (this.renderedRtRadius > this.renderedHeight / 2) this.renderedRtRadius = this.renderedHeight / 2;
        if (this.renderedLbRadius > this.renderedWidth / 2) this.renderedLbRadius = this.renderedWidth / 2;
        if (this.renderedLbRadius > this.renderedHeight / 2) this.renderedLbRadius = this.renderedHeight / 2;
        if (this.renderedRbRadius > this.renderedWidth / 2) this.renderedRbRadius = this.renderedWidth / 2;
        if (this.renderedRbRadius > this.renderedHeight / 2) this.renderedRbRadius = this.renderedHeight / 2;

        // get center at position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.beginPath();
        this._private.context.moveTo(adjustedPosition.x + this.renderedLtRadius, adjustedPosition.y);
        this._private.context.arcTo(adjustedPosition.x + this.renderedWidth, adjustedPosition.y, adjustedPosition.x + this.renderedWidth, adjustedPosition.y + this.renderedHeight, this.renderedRtRadius);
        this._private.context.arcTo(adjustedPosition.x + this.renderedWidth, adjustedPosition.y + this.renderedHeight, adjustedPosition.x, adjustedPosition.y + this.renderedHeight, this.renderedRbRadius);
        this._private.context.arcTo(adjustedPosition.x, adjustedPosition.y + this.renderedHeight, adjustedPosition.x, adjustedPosition.y, this.renderedLbRadius);
        this._private.context.arcTo(adjustedPosition.x, adjustedPosition.y, adjustedPosition.x + this.renderedWidth, adjustedPosition.y, this.renderedLtRadius);
        this._private.context.closePath();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();
    };

    // pointer hit test
    ZUI.RenderedObject.Rectangle.prototype.pointerHitTest = function(x, y) {
        this._private.context.isPointInPath(x, y);
    };

})();
