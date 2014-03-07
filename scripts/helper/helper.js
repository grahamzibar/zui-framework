(function() {

    ZUI.Helper.removeFromArray = function(array, item) {
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return item;
    };

    ZUI.Helper.inheritClass = function(parent, child) {
        function protoCreator() {
            this.constructor = child.prototype.constructor;
        }
        protoCreator.prototype = parent.prototype;
        child.prototype = new protoCreator();
    };

    ZUI.Helper.assignDefaultProperty = function (propertyName, obj, defaultProperty) {
        var hasProperties = false;
        if ((typeof defaultProperty) !== 'string') {
            for (var foo in defaultProperty) {
                hasProperties = true;
                break;
            }
        }
        if (obj[propertyName] === undefined) {
            if (hasProperties) {
                obj[propertyName] = {};
            }
            else {
                obj[propertyName] = defaultProperty;
            }
        }
        if ((typeof defaultProperty) !== 'string') {
            for (var foo in defaultProperty) {
                ZUI.Helper.assignDefaultProperty(foo, obj[propertyName], defaultProperty[foo]);
            }
        }
        return obj[propertyName];
    };

})();