(function() {

    // constructor
    ZUI.RenderedObject.LinePath = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   vertices
        //   verticesScale
        (function () {
            // define default properties (part 1)
            var defaultProperties = {
                vertices: []
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }

            // define default properties (part 2)
            var defaultProperties = {
                verticesScale: []
            };
            for (var n = 0; n < that['vertices'].length; n++) {
                defaultProperties.verticesScale.push('world');
            }

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.LinePath);

    // render
    ZUI.RenderedObject.LinePath.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered vertices
        this.renderedVertices = [];
        for (var n = 0; n < this.vertices.length; n++) {
            this.renderedVertices.push(ZUI.Helper.interpretScale(this.vertices[n], this.verticesScale[n]));
        }

        // get adjusted position
        // scaleAt property does not apply for line paths

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(this.renderedPosition.x, this.renderedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        this._private.context.moveTo(this.renderedVertices[0].x, this.renderedVertices[0].y);
        for (var n = 1; n < this.renderedVertices.length; n++) {
            this._private.context.lineTo(this.renderedVertices[n].x, this.renderedVertices[n].y);
        }
        this._private.context.closePath();
        ZUI.context.restore();
        if (this.stroke) {
            this._private.context.stroke();
        }
        if (this.fill) {
            this._private.context.fill();
        }

        // restore context
        this._private.context.restore();

        // set update flag
        this._private.isUpdated = false;
    };

})();
