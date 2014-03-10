(function() {

    // constructor
    ZUI.RenderedObject.Text = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.lines = [];

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   size
        //   sizeScale
        //   font
        //   content
        //   isBold
        //   isItalic
        //   isUnderline
        (function () {
            // define default properties
            var defaultProperties = {
                size: 12,
                sizeScale: ZUI.Def.WorldScale,
                font: 'Helvetica',
                content: '',
                isBold: false,
                isItalic: false,
                isUnderline: false
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // split lines
        var contentInLines = this.content.split('\n');
        for (var n = 0; n < contentInLines.length; n++) {
            var line = {
                content: contentInLines[n],
                renderedPosition: null,
                renderedWidth: null,
                renderedHeight: null
            };
            this._private.lines.push(line);
        }

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Text);

    // render
    ZUI.RenderedObject.Text.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedSize = ZUI.Helper.interpretScale(this.size, this.sizeScale);
        this.renderedWidth = 0;
        this.renderedHeight = this.renderedSize * (this._private.lines.length - 0.2);
        this._private.context.save();
        this._private.context.font = ((this.isBold) ? 'bold ' : '') + ((this.isItalic) ? 'italic ' : '') + '60' + 'px ' + this.font;
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            line.renderedWidth = this._private.context.measureText(line.content).width / 60 * this.renderedSize;
            if (line.renderedWidth > this.renderedWidth) {
                this.renderedWidth = line.renderedWidth;
            }
            line.renderedHeight = this.renderedSize * 0.8;
        }
        this._private.context.restore();

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, 0, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;
        this._private.context.font = ((this.isBold) ? 'bold ' : '') + ((this.isItalic) ? 'italic ' : '') + '60' + 'px ' + this.font;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.rotate(this.rotate);
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            line.renderedPosition = ZUI.Helper.interpretCenterAt(
                {
                    x: 0,
                    y: this.renderedSize * n
                },
                {
                    x: 0,
                    y: 0
                },
                line.renderedWidth,
                0,
                this.centerAt
            );
            this._private.context.save();
            this._private.context.translate(line.renderedPosition.x, line.renderedPosition.y + this.renderedSize * 0.8);
            this._private.context.scale(this.renderedSize / 60 * this.hStretch, this.renderedSize / 60 * this.vStretch);
            if (this.stroke) {
                this._private.context.lineJoin = 'round';
                this._private.context.strokeText(line.content, 0, 0);
            }
            if (this.fill) {
                this._private.context.fillText(line.content, 0, 0);
            }
            this._private.context.restore();
            if (this.isUnderline) {
                if (this.stroke) {
                    this._private.context.beginPath();
                    this._private.context.moveTo(
                        line.renderedPosition.x - this.renderedStrokeThickness / 2,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.lineTo(
                        line.renderedPosition.x + line.renderedWidth + this.renderedStrokeThickness / 2,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.stroke();
                }
                if (this.fill) {
                    this._private.context.beginPath();
                    this._private.context.moveTo(
                        line.renderedPosition.x,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.lineTo(
                        line.renderedPosition.x + line.renderedWidth,
                        Math.round(line.renderedPosition.y + this.renderedSize * 0.85) + 0.5
                    );
                    this._private.context.stroke();
                }
            }
        }
        this._private.context.beginPath();
        for (var n = 0; n < this._private.lines.length; n++) {
            var line = this._private.lines[n];
            this._private.context.moveTo(line.renderedPosition.x, line.renderedPosition.y);
            this._private.context.lineTo(line.renderedPosition.x + line.renderedWidth, line.renderedPosition.y);
            this._private.context.lineTo(line.renderedPosition.x + line.renderedWidth, line.renderedPosition.y + line.renderedHeight);
            this._private.context.lineTo(line.renderedPosition.x, line.renderedPosition.y + line.renderedHeight);
            this._private.context.closePath();
        }
        this._private.context.restore();

        // restore context
        this._private.context.restore();
    };

})();
