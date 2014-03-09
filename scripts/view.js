(function() {

    // constructor
    ZUI.View = function() {
        // call base constructor
        ZUI.Base.call(this);

        this._private.isUpdated = true;

        this.renderedObjects = [];
        this.animations = [];
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.View);

    // start an animation
    ZUI.View.prototype.animate = function(animation) {
        this.animations.push(animation);
        animation.begin();
    };

    // active callback (abstract)
    ZUI.View.prototype.active = function() {

    };

    // inactive callback (abstract)
    ZUI.View.prototype.inactive = function() {};

    // update callback (abstract)
    ZUI.View.prototype.update = function() {};

    // remove callback (abstract)
    ZUI.View.prototype.remove = function() {};

    // leftMouseDown callback (abstract)
    ZUI.View.prototype.leftMouseDown = function() {};

    // middleMouseDown callback (abstract)
    ZUI.View.prototype.middleMouseDown = function() {};

    // rightMouseDown callback (abstract)
    ZUI.View.prototype.rightMouseDown = function() {};

    // leftMouseUp callback (abstract)
    ZUI.View.prototype.leftMouseUp = function() {};

    // middleMouseUp callback (abstract)
    ZUI.View.prototype.middleMouseUp = function() {};

    // rightMouseUp callback (abstract)
    ZUI.View.prototype.rightMouseUp = function() {};

    // mouseMove callback (abstract)
    ZUI.View.prototype.mouseMove = function() {};

    // leftClick callback (abstract)
    ZUI.View.prototype.leftClick = function() {};

    // middleClick callback (abstract)
    ZUI.View.prototype.middleClick = function() {};

    // rightClick callback (abstract)
    ZUI.View.prototype.rightClick = function() {};

    // leftDoubleClick callback (abstract)
    ZUI.View.prototype.leftDoubleClick = function() {};

    // middleDoubleClick callback (abstract)
    ZUI.View.prototype.middleDoubleClick = function() {};

    // mouseWheel callback (abstract)
    ZUI.View.prototype.mouseWheel = function(scroll) {};

    // contextMenu callback (abstract)
    ZUI.View.prototype.contextMenu = function() {};

})();