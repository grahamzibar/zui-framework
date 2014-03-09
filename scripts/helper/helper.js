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
        if ((typeof defaultProperty) !== 'string' && !(defaultProperty instanceof Array)) {
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
        if ((typeof defaultProperty) !== 'string' && !(defaultProperty instanceof Array)) {
            for (var foo in defaultProperty) {
                ZUI.Helper.assignDefaultProperty(foo, obj[propertyName], defaultProperty[foo]);
            }
        }
        return obj[propertyName];
    };

    // get mouse position from event
    ZUI.Helper.getMousePosition = function(event) {
        var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
        return {
            x: event.clientX - canvasBoundingRect.left,
            y: event.clientY - canvasBoundingRect.top
        };
    };

    // disable pointer events on canvas
    ZUI.Helper.disablePointerEvents = function() {
        ZUI.canvas.style.pointerEvents = "none";
    };

    // restore point events on canvas
    ZUI.Helper.restorePointerEvents = function() {
        ZUI.canvas.style.pointerEvents = "auto";
    };

    // interpret the scale option and returns the updated value
    ZUI.Helper.interpretScale = function(value, scale) {
        if (scale === ZUI.Def.ScreenScale) {
            return value;
        }
        else if (scale === ZUI.Def.WorldScale) {
            // point
            if (isNaN(value)) {
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
        var adjustedPosition = {
            x: position.x + positionOffset.x,
            y: position.y + positionOffset.y
        }

        if (centerAt.horizontal === ZUI.Def.Left) {
            adjustedPosition.x -= 0;
        }
        else if (centerAt.horizontal === ZUI.Def.Center) {
            adjustedPosition.x -= width / 2;
        }
        else if (centerAt.horizontal === ZUI.Def.Right) {
            adjustedPosition.x -= width;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        if (centerAt.vertical === ZUI.Def.Top) {
            adjustedPosition.y -= 0;
        }
        else if (centerAt.vertical === ZUI.Def.Center) {
            adjustedPosition.y -= height / 2;
        }
        else if (centerAt.vertical === ZUI.Def.Bottom) {
            adjustedPosition.y -= height;
        }
        else {
            throw {
                name: 'InvalidPropertyException',
                message: 'Value of centerAt is invalid.'
            };
        }

        return adjustedPosition;
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

    // parses an SVG path and outputs an object
    ZUI.Helper.parseSVGPath = function(path) {
        // splits the path string into instructions
        var instructions = [];
        for (var n = 0; n < path.length;) {
            var instruction = path[n];
            var next = ZUI.Helper.regexIndexOf(path, "[A-Za-z]", n + 1);
            if (next < 0) next = path.length;
            var args = path.substring(n + 1, next).replace(new RegExp("([0-9])-", "gi"), "$1,-").trim().replace(new RegExp("[\t\n ,]+", "gi"), ",").split(/[,]+/);
            for (var m = 0; m < args.length; m++) {
                args[m] = Number(args[m]);
            }
            instructions.push({
                type: instruction,
                args: args
            });
            n = next;
        }

        // process instructions
        var objs = []
        var lastX = 0, lastY = 0;
        for (n = 0; n < instructions.length; n++) {
            if (instructions[n].type == "M") {			// moveto (absolute)
                var obj = {};
                obj.type = "moveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "m") {		// moveto (relative)
                var obj = {};
                obj.type = "moveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "Z" || instructions[n].type == "z") {	// closepath
                var obj = {};
                obj.type = "closePath";
                obj.args = [];
                objs.push(obj);
            }
            else if (instructions[n].type == "L") {		// lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "l") {		// lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "H") {		// horizontal lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0], lastY];
                objs.push(obj);
                lastX = instructions[n].args[0];
            }
            else if (instructions[n].type == "h") {		// horizontal lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [instructions[n].args[0] + lastX, lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
            }
            else if (instructions[n].type == "V") {		// vertical lineto (absolute)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [lastX, instructions[n].args[0]];
                objs.push(obj);
                lastY = instructions[n].args[0];
            }
            else if (instructions[n].type == "v") {		// vertical lineto (relative)
                var obj = {};
                obj.type = "lineTo";
                obj.args = [lastX, instructions[n].args[0] + lastY];
                objs.push(obj);
                lastY += instructions[n].args[0];
            }
            else if (instructions[n].type == "C") {		// curveto (absolute)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4], instructions[n].args[5]];
                objs.push(obj);
                lastX = instructions[n].args[4];
                lastY = instructions[n].args[5];
            }
            else if (instructions[n].type == "c") {		// curveto (relative)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4] + lastX, instructions[n].args[5] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[4];
                lastY += instructions[n].args[5];
            }
            else if (instructions[n].type == "S") {		// shorthand/smooth curveto (absolute)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "s") {		// shorthand/smooth curveto (relative)
                var obj = {};
                obj.type = "bezierCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
            else if (instructions[n].type == "Q") {		// quadratic Bezier curveto (absolute)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "q") {		// quadratic Bezier curveto (relative)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
            else if (instructions[n].type == "T") {		// shorthand/smooth quadratic Bezier curveto (absolute)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1]];
                objs.push(obj);
                lastX = instructions[n].args[0];
                lastY = instructions[n].args[1];
            }
            else if (instructions[n].type == "t") {		// shorthand/smooth quadratic Bezier curveto (relative)
                var obj = {};
                obj.type = "quadraticCurveTo";
                obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
                objs.push(obj);
                lastX += instructions[n].args[0];
                lastY += instructions[n].args[1];
            }
            else if (instructions[n].type == "A") {		// elliptical arc (absolute), NOT THE SAME AS THE SVG COMMAND
                var obj = {};
                obj.type = "arcTo";
                obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4]];
                objs.push(obj);
                lastX = instructions[n].args[2];
                lastY = instructions[n].args[3];
            }
            else if (instructions[n].type == "a") {		// elliptical arc (relative), NOT THE SAME AS THE SVG COMMAND
                var obj = {};
                obj.type = "arcTo";
                obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4]];
                objs.push(obj);
                lastX += instructions[n].args[2];
                lastY += instructions[n].args[3];
            }
        }

        return objs;
    };

})();