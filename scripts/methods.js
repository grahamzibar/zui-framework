(function() {

    // initialize ZUI
    ZUI.initialize = function (properties) {
        // transfer properties to this object
        for (var propertyName in properties) {
            ZUI[propertyName] = properties[propertyName];
        }

        // assign default to undefined properties
        //   width
        //   height
        //   background
        //   frameRate
        (function () {
            // define default properties
            var defaultProperties = {
                width: 900,
                height: 600,
                background: '#FFFFFF',
                backgroundAlpha: 0,
                frameRate: 30,
                cameraFollowRate: 1
            };

            // assign default to undefined properties
            for (var propertyName in defaultProperties) {
                ZUI.Helper.assignDefaultProperty(propertyName, ZUI, defaultProperties[propertyName]);
            }
        })();

        // initialize properties that cannot be defined by the user
        if (properties.canvas) {
            ZUI.container = properties.canvas.parentNode;
            ZUI.canvas = properties.canvas;
            ZUI.context = ZUI.canvas.getContext('2d');
        }

        // create and set camera
        ZUI.camera = new ZUI.Camera.DefaultCamera({});

        // create and set context menu
        ZUI.contextMenu = new ZUI.ContextMenu();

        // set canvas size
        ZUI.canvas.width = ZUI.width;
        ZUI.canvas.height = ZUI.height;

        // set cursor
        ZUI.canvas.style.cursor = "default";

        // add event listeners
        ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
        document.addEventListener("mouseup", ZUI.mouseUp, false);
        ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
        ZUI.canvas.addEventListener("click", ZUI.click, false);
        ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
        ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
        ZUI.canvas.addEventListener("DOMMouseScroll", ZUI.mouseWheel, false);

        // intercept contextmenu event
        ZUI.canvas.oncontextmenu = function(event) {
            ZUI.contextMenu(event);
            return false;
        };

        // set first view
        ZUI.activeView = new ZUI.View();
        ZUI.activeView.active();

        // begin draw loop
        requestAnimationFrame(ZUI.draw);
    };

    // draw frame
    ZUI.draw = function (timeStamp) {
        // request next frame
        requestAnimationFrame(ZUI.draw);

        if (timeStamp - ZUI.lastTimeStamp > 1000 / ZUI.frameRate) {
            // update lastTimeStamp
            ZUI.lastTimeStamp = timeStamp - ((timeStamp - ZUI.lastTimeStamp) % 1000 / ZUI.frameRate);

            // update app status
            if (ZUI.appStatus.start == null) {
                ZUI.appStatus.start = timeStamp;
            }
            ZUI.appStatus.progress = timeStamp - ZUI.appStatus.start;

            // update camera
            ZUI.camera.update();

            // call update
            ZUI.update();

            // check whether redraw is required
            var isRedraw = false;
            for (var n = 0; n < ZUI.activeView.renderedObjects.length; n++) {
                if (ZUI.activeView.renderedObjects[n].isUpdated) {
                    ZUI.activeView.renderedObjects[n].render();
                    ZUI.activeView.renderedObjects[n].isUpdated = false;
                    isRedraw = true;
                }
            }

            // redraw if needed
            if (isRedraw) {
                // clear canvas
                ZUI.context.clearRect(0, 0, ZUI.width, ZUI.height);
                if (ZUI.backgroundAlpha > 0) {
                    ZUI.context.save();
                    ZUI.context.globalAlpha = ZUI.backgroundAlpha;
                    ZUI.context.strokeStyle = ZUI.background;
                    ZUI.context.fillStyle = ZUI.background;
                    ZUI.context.fillRect(0, 0, ZUI.width, ZUI.height)
                    ZUI.context.restore();
                }

                // draw active view's rendered objects
                for (var n = 0; n < ZUI.activeView.renderedObjects.length; n++) {
                    ZUI.activeView.renderedObjects[n].draw();
                }
            }

            // check for mouse over/out events
            var x = ZUI.mouseStatus.x;
            var y = ZUI.mouseStatus.y;
            var renderedObjects = ZUI.activeView.renderedObjects;
            var renderedObject = null;
            for (var n = 0; n < renderedObjects.length; n++) {
                if (renderedObjects[n].isInBound(x, y)) {
                    renderedObject = renderedObjects[n];
                }
            }
            for (n = 0; n < renderedObjects.length; n++) {
                if (renderedObjects[n] != renderedObject && renderedObjects[n]._private.isHovered) {
                    renderedObjects[n]._private.isHovered = false;
                    renderedObjects[n].mouseOut();
                }
            }
            if (renderedObject) {
                if (!renderedObject._private.isHovered) {
                    renderedObject._private.isHovered = true;
                    renderedObject.mouseOver();
                }
            }
        }
    };

    // change active view
    ZUI.changeActiveView = function(view) {
        ZUI.activeView.inactive();
        ZUI.activeView = view;
        ZUI.activeView.active();
    };

    // mousedown event handler */
    ZUI.mouseDown = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.mouseStatus.leftDown = true;
            ZUI.activeView.leftMouseDown();
            if (renderedObject) renderedObject.leftMouseDown();
        }
        else if (event.button == 1) {
            ZUI.mouseStatus.middleDown = true;
            ZUI.activeView.middleMouseDown();
            if (renderedObject) renderedObject.middleMouseDown();
        }
        else if (event.button == 2) {
            ZUI.mouseStatus.rightDown = true;
            ZUI.activeView.rightMouseDown();
            if (renderedObject) renderedObject.rightMouseDown();
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mouseup event handler
    ZUI.mouseUp = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.mouseStatus.leftDown = false;
            ZUI.activeView.leftMouseUp();
            if (renderedObject) renderedObject.leftMouseUp();
        }
        else if (event.button == 1) {
            ZUI.mouseStatus.middleDown = false;
            ZUI.activeView.middleMouseUp();
            if (renderedObject) renderedObject.middleMouseUp();
        }
        else if (event.button == 2) {
            ZUI.mouseStatus.rightDown = false;
            ZUI.activeView.rightMouseUp();
            if (renderedObject) renderedObject.rightMouseUp();
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mousemove event handler
    ZUI.mouseMove = function(event) {
        var mousePosition = ZUI.getMousePosition(event);
        ZUI.mouseStatus.xLast = ZUI.mouseStatus.x;
        ZUI.mouseStatus.yLast = ZUI.mouseStatus.y;
        ZUI.mouseStatus.x = mousePosition.x;
        ZUI.mouseStatus.y = mousePosition.y;

        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = 0; n < renderedObjects.length; n++) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
            }
        }

        ZUI.activeView.mouseMove();
        for (n = 0; n < renderedObjects.length; n++) {
            if (renderedObjects[n] != renderedObject && renderedObjects[n].isHovered) {
                renderedObjects[n].isHovered = false;
                renderedObjects[n].mouseOut();
            }
        }
        if (renderedObject) {
            renderedObject.mouseMove();
            if (!renderedObject.isHovered) {
                renderedObject.isHovered = true;
                renderedObject.mouseOver();
            }
        }

        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    /* Click event callback */
    ZUI.click = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            if (ZUI.contextMenu.active) {
                ZUI.contextMenu.close();
            }
            ZUI.activeView.leftClick();
            if (renderedObject) renderedObject.leftClick();
        }
        else if (event.button == 1) {
            ZUI.activeView.middleClick();
            if (renderedObject) renderedObject.middleClick();
        }
        else if (event.button == 2) {
            ZUI.activeView.rightClick();
            if (renderedObject) renderedObject.rightClick();
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // dblclick event handler
    ZUI.doubleClick = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        if (event.button == 0) {
            ZUI.activeView.leftDoubleClick();
            if (renderedObject) renderedObject.leftDoubleClick();
        }
        else if (event.button == 1) {
            ZUI.activeView.middleDoubleClick();
            if (renderedObject) renderedObject.middleDoubleClick();
        }
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // mousewheel / DOMMouseScroll event handler
    ZUI.mouseWheel = function(event) {
        event.preventDefault();
        var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        ZUI.activeView.mouseWheel(scroll);
        if (renderedObject) renderedObject.mouseWheel(scroll);
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // contextmenu event handler
    ZUI.contextMenu = function(event) {
        var x = ZUI.mouseStatus.x;
        var y = ZUI.mouseStatus.y;
        var renderedObjects = ZUI.activeView.renderedObjects;
        var renderedObject = null;
        for (var n = renderedObjects.length - 1; n >= 0; n--) {
            if (renderedObjects[n].isInBound(x, y)) {
                renderedObject = renderedObjects[n];
                break;
            }
        }

        ZUI.activeView.contextMenu();
        if (renderedObject) renderedObject.contextMenu();
        if (ZUI.passInputEvent) {
            ZUI.passInputEvent(event);
        }
    };

    // per-frame update with customized logic (need override)
    ZUI.update = function() {};

})();