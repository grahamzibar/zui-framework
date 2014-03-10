(function() {

    // constructor
    ZUI.RenderedObject.Shape = function(properties) {
        // call base constructor
        ZUI.RenderedObject.Base.call(this, properties);

        // private properties
        this._private.paths = [];

        // save scope for access by child scopes
        var that = this;

        // assign default to undefined properties
        //   paths
        (function () {
            // define default properties
            var defaultProperties = {
                paths: [],
                scale: ZUI.Def.WorldScale
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, that, defaultProperties[propertyName]);
            }
        })();

        // parse paths
        for (var n = 0; n < this.paths.length; n++) {
            var path = {};
            path.instructions = ZUI.Helper.parseSVGPath(this.paths[n]);
            this._private.paths.push(path);
        }

        // set ready flag
        this._private.isReady = true;
    };

    // inherit base prototype
    ZUI.Helper.inheritClass(ZUI.RenderedObject.Base, ZUI.RenderedObject.Shape);

    // render
    ZUI.RenderedObject.Shape.prototype.render = function () {
        // call base method
        ZUI.RenderedObject.Base.prototype.render.call(this);

        // get rendered paths
        this._private.renderedPaths = [];
        for (var n = 0; n < this._private.paths.length; n++) {
            var path = this._private.paths[n];
            var renderedPath = {
                instructions: []
            };
            for (var m = 0; m < path.instructions.length; m++) {
                var instruction = path.instructions[m];
                var renderedInstruction = {
                    type: instruction.type,
                    args: []
                };
                var type = instruction.type;
                var args = instruction.args;
                for (var i = 0; i < args.length; i++) {
                    renderedInstruction.args.push(args[i]);
                }
                for (var i = 0; i + 1 < args.length; i += 2) {
                    var renderedPoint = ZUI.Helper.interpretScale({
                        x: renderedInstruction.args[i],
                        y: renderedInstruction.args[i + 1]
                    }, this.scale);
                    renderedInstruction.args[i] = renderedPoint.x;
                    renderedInstruction.args[i + 1] = renderedPoint.y;
                }
                renderedPath.instructions.push(renderedInstruction);
            }
            this._private.renderedPaths.push(renderedPath);
        }

        // get adjusted position
        var adjustedPosition = ZUI.Helper.interpretCenterAt(this.renderedPosition, this.renderedPositionOffset, 0, 0, this.centerAt);

        // set up context
        this._private.context.save();
        this._private.context.strokeStyle = this.strokeColor;
        this._private.context.fillStyle = this.fillColor;
        this._private.context.globalAlpha = this.alpha;
        this._private.context.lineWidth = this.renderedStrokeThickness;

        // render
        this._private.context.save();
        this._private.context.translate(adjustedPosition.x, adjustedPosition.y);
        this._private.context.scale(this.hStretch, this.vStretch);
        this._private.context.rotate(this.rotate);
        this._private.context.beginPath();
        for (var n = 0; n < this._private.renderedPaths.length; n++) {
            var renderedPath = this._private.renderedPaths[n];
            for (var m = 0; m < renderedPath.instructions.length; m++) {
                var instruction = renderedPath.instructions[m];
                this._private.context[instruction.type].apply(this._private.context, instruction.args);
            }
        }
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
