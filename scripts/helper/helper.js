(function() {

    // remove an item from an array
    ZUI.Helper.removeFromArray = function(array, item) {
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return item;
    };

    // inherit parent class prototype without calling parent constructor
    ZUI.Helper.inheritClass = function(parent, child) {
        function protoCreator() {
            this.constructor = child.prototype.constructor;
        }
        protoCreator.prototype = parent.prototype;
        child.prototype = new protoCreator();
    };

    // assign default property to an object recursively if the property is undefined
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

    // interpret the scale option and returns the updated value
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

    // interpret the centerAt option and returns the updated position
    ZUI.Helper.interpretCenterAt = function(position, positionOffset, width, height, centerAt) {
        var adustedPosition = {
            x: position.x + positionOffset.x,
            y: position.y + positionOffset.y
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

    // check whether a color string is valid
    ZUI.Helper.isValidColor = function(str) {
        if (!str || !str.match) {
            return null;
        }
        else {
            return str.match(/^#[a-f0-9]{6}$/i) !== null;
        }
    };

    // check whether a string ends with a suffix
    ZUI.Helper.isEndsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // convert number to to string with comma-separators
    ZUI.Helper.getNumberWithComma = function(number) {
        /* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
        var parts = (number + '').split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // get index of a regex in a string
    ZUI.Helper.regexIndexOf = function(string, regex, start) {
        var index = string.substring(start || 0).search(regex);
        return (index >= 0) ? (index + (start || 0)) : index;
    };

    // get time in milliseconds since 1970/01/01
    ZUI.Helper.getTime = function() {
        return (new Date()).getTime();
    };

    // stop bubbling through DOM hierarchy
    ZUI.Helper.stopBubble = function(event) {
        event.stopPropagation();
    };

    // get color string from color components
    ZUI.Helper.getColorString = function(red, green, blue) {
        if (red.red !== undefined && red.green !== undefined && red.blue !== undefined) {
            var color = red;
            red = color.red;
            green = color.green;
            blue = color.blue;
        }
        var _red = red.toString(16);
        if (_red.length == 1) _red = '0' + _red;
        var _green = green.toString(16);
        if (_green.length == 1) _green = '0' + _green;
        var _blue = blue.toString(16);
        if (_blue.length == 1) _blue = '0' + _blue;
        return '#' + _red + _green + _blue;
    };

    // get color components from a color string
    ZUI.Helper.getColorComponents = function(color) {
        var _color = color.substring(0);
        if (_color[0] == '#') {
            _color = color.substring(1);
        }
        var red = parseInt(_color.substring(0, 2), 16);
        var green = parseInt(_color.substring(2, 4), 16);
        var blue = parseInt(_color.substring(4, 6), 16);
        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            return null;
        }
        else {
            return {
                red: red,
                green: green,
                blue: blue
            };
        }
    };

    // get property from its path string
    ZUI.Helper.readPropertyPath = function(propertyPath) {
        var parts = propertyPath.split('.');
        var scope = window;
        for (var n = 0; n < parts.length; n++) {
            scope = scope[parts[n]];
            if (scope === undefined || scope === null) {
                throw {
                    name: 'BadPathException',
                    message: 'The path ' + propertyPath + ' cannot be found.'
                };
                return undefined;
            }
        }
        return scope;
    };

})();