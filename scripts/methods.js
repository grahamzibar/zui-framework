(function() {

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
                backgroundAlpha: 1,
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

        // define context menu
        ZUI.contextMenu = new ZUI.ContextMenu();

        // disable default context menu
        ZUI.canvas.oncontextmenu = function(event) {
            ZUI.contextMenu(event);
            return false;
        };

        // set default cursor
        ZUI.canvas.style.cursor = "default";

        // set canvas size
        ZUI.canvas.width = ZUI.width;
        ZUI.canvas.height = ZUI.height;

        // add event listeners
        ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
        document.addEventListener("mouseup", ZUI.mouseUp, false);
        ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
        ZUI.canvas.addEventListener("click", ZUI.click, false);
        ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
        ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
        ZUI.canvas.addEventListener("DOMMouseScroll", ZUI.mouseWheel, false);
        ZUI.canvas.addEventListener("gesturestart", ZUI.gestureStart, false);
        ZUI.canvas.addEventListener("gesturechange", ZUI.gestureChange, false);
        ZUI.canvas.addEventListener("gestureend", ZUI.gestureEnd, false);

        // set first view
        ZUI.activeView = new ZUI.View();
        ZUI.activeView.active();

        // begin draw loop
        requestAnimationFrame(ZUI.draw);
    };

})();