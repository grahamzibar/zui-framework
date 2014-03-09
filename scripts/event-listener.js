(function() {

    // constructor
    ZUI.EventListener = function(type, target, callback, data) {
        // call base constructor
        ZUI.Base.call(this);

        this.type = type;
        this.target = target;
        this.callback = callback;
        this.data = data;
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.EventListener);

})();