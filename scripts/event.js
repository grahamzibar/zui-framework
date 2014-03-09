(function() {

    // constructor
    ZUI.Event = function(type, target, data) {
        // call base constructor
        ZUI.Base.call(this);

        this.type = type;
        this.target = target;
        this.data = data;
        this.timeStamp = ZUI.Helper.getTime();
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Event);

})();