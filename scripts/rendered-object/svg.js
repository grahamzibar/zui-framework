(function() {
// TODO retain SVG properties and hierarchy
    // constructor
    ZUI.RenderedObject.SVG = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   width
        //   widthScale
        //   height
        //   heightScale
        //   url
        //   dataString
        (function () {
            // define default properties
            var defaultProperties = {
                width: 0,
                widthScale: ZUI.Def.WorldScale,
                height: 0,
                heightScale: ZUI.Def.WorldScale,
                url: '',
                dataString: null
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // load svg
        if (!this.dataString) {
            $.get(this.url, (function(data) {
                var svg = data.getElementsByTagName("svg")[0];
                this._private.width = svg.getAttribute("width");
                if (this._private.width.indexOf("px") >= 0) this._private.width = Number(this._private.width.substring(0, this._private.width.indexOf("px")));
                this._private.height = svg.getAttribute("height");
                if (this._private.height.indexOf("px") >= 0) this._private.height = Number(this._private.height.substring(0, this._private.height.indexOf("px")));
                var paths = svg.getElementsByTagName("path");
                this._private.paths = [];
                for (var n = 0; n < paths.length; n++) {
                    var path = {};
                    path.id = paths[n].getAttribute("id");
                    path.instructions = ZUI.Helper.parseSVGPath(paths[n].getAttribute("d"));
                    this._private.paths.push(path);
                }
                this._private.isReady = true;
            }).bind(this));
        }
        else {
            var xmlDoc = (new DOMParser()).parseFromString(this.dataString, "text/xml");
            var svg = xmlDoc.getElementsByTagName("svg")[0];
            this._private.width = svg.getAttribute("width");
            if (this._private.width.indexOf("px") >= 0) this._private.width = Number(this._private.width.substring(0, this._private.width.indexOf("px")));
            this._private.height = svg.getAttribute("height");
            if (this._private.height.indexOf("px") >= 0) this._private.height = Number(this._private.height.substring(0, this._private.height.indexOf("px")));
            var paths = svg.getElementsByTagName("path");
            this._private.paths = [];
            for (var n = 0; n < paths.length; n++) {
                var path = {};
                path.id = paths[n].getAttribute("id");
                path.instructions = ZUI.Helper.parseSVGPath(paths[n].getAttribute("d"));
                this._private.paths.push(path);
            }
            this._private.isReady = true;
        }
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.SVG);

    // render
    ZUI.RenderedObject.SVG.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered size
        this.renderedWidth = ZUI.Helper.interpretScale(this.width, this.widthScale);
        this.renderedHeight = ZUI.Helper.interpretScale(this.height, this.heightScale);

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, this.renderedWidth, this.renderedHeight, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.renderedWidth / this._private.width * this.hStretch, this.renderedHeight / this._private.height * this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        for (var n = 0; n < this._private.paths.length; n++) {
            var path = this._private.paths[n];
            for (var m = 0; m < path.instructions.length; m++) {
                var instruction = path.instructions[m];
                this._private.context[instruction.type].apply(this._private.context, instruction.args);
            }
        }
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
