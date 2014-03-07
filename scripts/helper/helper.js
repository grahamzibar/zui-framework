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

    ZUI.Helper.interpretScale = function(value, scale) {
        if (scale === ZUI.Def.ScreenScale) {
            return value;
        }
        else if (scale === ZUI.Def.WorldScale) {
            // point
            if (isNaN(Number(value))) {
                return ZUI.camera.projectPoint(value);
            }

            // distance
            else {
                return ZUI.camera.projectDistance(value);
            }
        }
        else {
            return null;
        }
    };

    ZUI.Helper.interpretCenterAt = function(position, width, height, centerAt) {
        var adustedPosition = {
            x: position.x,
            y: position.y
        }

        if (this.centerAt.horizontal === ZUI.Def.Left) {
            adustedPosition.x -= 0;
        }
        else if (this.centerAt.horizontal === ZUI.Def.Center) {
            adustedPosition.x -= width / 2;
        }
        else if (this.centerAt.horizontal === ZUI.Def.Right) {
            adustedPosition.x -= width;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        if (this.centerAt.vertical === ZUI.Def.Top) {
            adustedPosition.y -= 0;
        }
        else if (this.centerAt.vertical === ZUI.Def.Center) {
            adustedPosition.y -= height / 2;
        }
        else if (this.centerAt.vertical === ZUI.Def.Bottom) {
            adustedPosition.y -= height;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        return adustedPosition;
    };

})();