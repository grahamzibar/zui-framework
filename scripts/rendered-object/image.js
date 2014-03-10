(function() {

    // constructor
    ZUI.RenderedObject.Image = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.image = new Image();

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   url
        //   dataString
        //   type
        (function () {
            // define default properties
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                url: '',
                dataString: null,
                type: 'png'
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // load image
        this._private.image.onload = (function() {
            this._private.isReady = true;
        }).bind(this);
        if (!this.dataString) {
            this._private.image.src = this.url;
        }
        else {
            this._private.image.src = 'data:image/' + this.type + ';base64,' + this.dataString;
        }
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Image);

    // render
    ZUI.RenderedObject.Image.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.drawImage(this._private.image, 0, 0, this.renderedWidth, this.renderedHeight);
        this._private.context.beginPath();
        this._private.context.moveTo(0, 0);
        this._private.context.lineTo(this.renderedWidth, 0);
        this._private.context.lineTo(this.renderedWidth, this.renderedHeight);
        this._private.context.lineTo(0, this.renderedHeight);
        this._private.context.closePath();
        this._private.context.restore();

        // restore context
        this._private.context.restore();
    };

})();
