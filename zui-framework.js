/**
 * 2D Zooming User Interface (ZUI) Framework
 * By Hans Yu
 */

/* Define requestAnimationFrame for draw loop */
(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

/* ZUI namespace */
function ZUI() {}

/* Div container */
ZUI.container = null;

/* Canvas */
ZUI.canvas = null;

/* Context handle */
ZUI.context = null;

/* Frame rate */
ZUI.frameRate = 60;

/* Interface width */
ZUI.width = 900;

/* Interface height */
ZUI.height = 600;

/* Animation object */
ZUI.animation = null;

/* Whether view is to be changed */
ZUI.isChangeView = false;

/* Whether view changes are animated */
ZUI.isAnimateChangeView = true;

/* Views and animations before and after change */
ZUI.oldView = null;
ZUI.exitOldViewAnimation = null;
ZUI.newView = null;
ZUI.enterNewViewAnimation = null;

/* Mouse status */
ZUI.mouseStatus = {
	x : 0,
	y : 0,
	xLast : 0,
	yLast : 0,
	leftDown : false,
	middleDown : false,
	rightDown : false,
};

/* App status */
ZUI.appStatus = {
	start: 0,
	progress: 0,
};

/* Interface background color */
ZUI.background = {
	red : 255,
	green : 255,
	blue : 255,
	alpha : 0
};

/* Active view */
ZUI.activeView = null;

/* Camera */
ZUI.camera = function() {};
	/* Field of view */
	ZUI.camera.fov = Math.PI / 2;

	/* True position */
	ZUI.camera._x = 0;
	ZUI.camera._y = 0;
	ZUI.camera._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);

	/* Move-to position */
	ZUI.camera.x = 0;
	ZUI.camera.y = 0;
	ZUI.camera.distance = ZUI.camera._distance;

	/* Rate at which the camera moves */
	ZUI.camera.moveRate = 1;

	/* Updates camera position */
	ZUI.camera.update = function() {
		ZUI.camera._x += (ZUI.camera.x - ZUI.camera._x) * ZUI.camera.moveRate;
		ZUI.camera._y += (ZUI.camera.y - ZUI.camera._y) * ZUI.camera.moveRate;
		ZUI.camera._distance += (ZUI.camera.distance - ZUI.camera._distance) * ZUI.camera.moveRate;

		if (Math.abs(ZUI.camera.x - ZUI.camera._x) < ZUI.camera._distance * 0.005) ZUI.camera._x = ZUI.camera.x;
		if (Math.abs(ZUI.camera.y - ZUI.camera._y) < ZUI.camera._distance * 0.005) ZUI.camera._y = ZUI.camera.y;
		if (Math.abs(ZUI.camera.distance - ZUI.camera._distance) < ZUI.camera._distance * 0.005) ZUI.camera._distance = ZUI.camera.distance;
	};

	/* Sets position immediately */
	ZUI.camera.setPosition = function(x, y) {
		ZUI.camera._x = x;
		ZUI.camera.x = x;
		ZUI.camera._y = y;
		ZUI.camera.y = y;
	};

	/* Sets x immediately DEPRECATED */
	ZUI.camera.setX = function(x) {
		ZUI.camera._x = x;
		ZUI.camera.x = x;
	};

	/* Sets y immediately DEPRECATED */
	ZUI.camera.setY = function(y) {
		ZUI.camera._y = y;
		ZUI.camera.y = y;
	};

	/* Sets distance immediately */
	ZUI.camera.setDistance = function(distance) {
		ZUI.camera._distance = distance;
		ZUI.camera.distance = distance;
	};

	/* Projects world coordinates to screen coordinates */
	ZUI.camera.projectPoint = function(x, y) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return {
			x: (x - ZUI.camera._x) * pixelsPerUnit + ZUI.width / 2,
			y: (y - ZUI.camera._y) * pixelsPerUnit + ZUI.height / 2,
		};
	};

	/* Projects world distance to screen distance */
	ZUI.camera.projectDistance = function(distance) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return distance * pixelsPerUnit;
	};

	/* Unprojects screen coordinates to world coordinates */
	ZUI.camera.unprojectPoint = function(x, y) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return {
			x: (x - ZUI.width / 2) / pixelsPerUnit + ZUI.camera._x,
			y: (y - ZUI.height / 2) / pixelsPerUnit + ZUI.camera._y,
		};
	};

	/* Unprojects screen distance to world distance */
	ZUI.camera.unprojectDistance = function(distance) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return distance / pixelsPerUnit;
	};

	/* Resets camera */
	ZUI.camera.reset = function() {
		/* True position */
		ZUI.camera._x = 0;
		ZUI.camera._y = 0;
		ZUI.camera._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);

		/* Move-to position */
		ZUI.camera.x = 0;
		ZUI.camera.y = 0;
		ZUI.camera.distance = ZUI.camera._distance;
	};

/* Execute an animation while pausing normal drawing routine */
ZUI.animate = function(animation) {
	ZUI.animation = animation;
	if (ZUI.animation != null) {
		ZUI.animation.reset();
	}
	if (this.animation.begin) {
		ZUI.animation.begin();
	}
};

/* Converts a number to a string with comma separators */
ZUI.getNumberWithComma = function(number) {
	/* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
	var parts = (number + "").split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

/* Converts canvas to an image displayed in a new window */
ZUI.toImageInWindow = function() {
	window.open(ZUI.canvas.toDataURL());
};

/* Initialization */
ZUI.initialize = function(settings) {
	/* Set canvas and container handles */
	if (settings.canvas) {
		ZUI.canvas = settings.canvas;
		ZUI.context = ZUI.canvas.getContext("2d");
		ZUI.container = ZUI.canvas.parentNode;
	}
	else {
		//TODO
	}

	/* Set width and height */
	if (settings.width && settings.height) {
		ZUI.width = settings.width;
		ZUI.height = settings.height;
		$(ZUI.canvas).width(ZUI.width);
		$(ZUI.canvas).height(ZUI.height);
	}
	else {
		ZUI.width = $(ZUI.canvas).width();
		ZUI.height = $(ZUI.canvas).height();
	}

	/* Set background */
	ZUI.background = (settings.background == undefined) ? "#ffffff" : settings.background;
	ZUI.backgroundAlpha = (settings.backgroundAlpha == undefined) ? 1 : settings.backgroundAlpha;

	/* Set frame rate */
	if (settings.frameRate) {
		ZUI.frameRate = settings.frameRate;
	}
	else {
		ZUI.frameRate = 60;
	}

	/* Add listeneres for input events */
	ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
	document.addEventListener("mouseup", ZUI.mouseUp, false);
	ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
	ZUI.canvas.addEventListener("click", ZUI.click, false);
	ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
	ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
	ZUI.canvas.addEventListener("contextmenu", ZUI.contextMenu, false);

	/* Set first view */
	ZUI.activeView = new ZUI.View();

	/* Activate first view */
	ZUI.activeView.active();

	/* Begin draw loop */
	requestAnimationFrame(ZUI.draw);
};

/* Gets called every frame */
ZUI.draw = function(timestamp) {
	/* Update app status */
	if (ZUI.appStatus.start == null) {
		ZUI.appStatus.start = timestamp;
	}
	ZUI.appStatus.progress = timestamp = ZUI.appStatus.start;

	/* Request next frame */
	requestAnimationFrame(ZUI.draw);

	/* Call update function */
	ZUI.update();

	/* Clear canvas */
	ZUI.context.clearRect(0, 0, ZUI.width, ZUI.height);
	ZUI.context.save();
	ZUI.context.globalAlpha = ZUI.backgroundAlpha;
	ZUI.context.strokeStyle = ZUI.background;
	ZUI.context.fillStyle = ZUI.background;
	ZUI.context.fillRect(0, 0, ZUI.width, ZUI.height)
	ZUI.context.restore();

	/* Draw */
	if (ZUI.animation == null) {
		if (ZUI.isChangeView) {
			ZUI.activeView.inactive();
			ZUI.activeView = ZUI.newView;
			ZUI.isChangeView = false;
			ZUI.oldView = null;
			ZUI.newView = null;
			ZUI.activeView.active();
			ZUI.animate(ZUI.enterNewViewAnimation);
		}
		else {
			ZUI.activeView.draw();
		}
	}
	else {
		if (!ZUI.animation.isOver()) {
			ZUI.animation.next();
		}
		else {
			if (ZUI.animation.end) {
				ZUI.animation.end();
			}
			ZUI.animation = null;
		}
	}
};

/* Change active view */
ZUI.changeActiveView = function(view, exitAnimation, entryAnimation) {
	ZUI.oldView = ZUI.activeView;
	ZUI.newView = view;
	if (!ZUI.isAnimateChangeView) {
		exitAnimation = null;
		entryAnimation = null;
	}
	ZUI.exitOldViewAnimation = exitAnimation;
	ZUI.enterNewViewAnimation = entryAnimation;
	ZUI.isChangeView = true;
	ZUI.animate(ZUI.exitOldViewAnimation);
};

/* Called every frame regardless of view, override with custom function */
ZUI.update = function() {};

/* Callback for mouse down event */
ZUI.mouseDown = function(event) {
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = true;
		ZUI.activeView.leftMouseDown();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = true;
		ZUI.activeView.middleMouseDown();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = true;
		ZUI.activeView.rightMouseDown();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for mouse up event */
ZUI.mouseUp = function(event) {
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = false;
		ZUI.activeView.leftMouseUp();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = false;
		ZUI.activeView.middleMouseUp();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = false;
		ZUI.activeView.rightMouseUp();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for mouse move event */
ZUI.mouseMove = function(event) {
	var mousePosition = ZUI.getMousePosition(event);
	ZUI.mouseStatus.xLast = ZUI.mouseStatus.x;
	ZUI.mouseStatus.yLast = ZUI.mouseStatus.y;
	ZUI.mouseStatus.x = mousePosition.x;
	ZUI.mouseStatus.y = mousePosition.y;
	ZUI.activeView.mouseMove();
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for click event */
ZUI.click = function(event) {
	if (event.button == 0) {
		ZUI.activeView.leftClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleClick();
	}
	else if (event.button == 2) {
		ZUI.activeView.rightClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for double click event */
ZUI.doubleClick = function(event) {
	if (event.button == 0) {
		ZUI.activeView.leftDoubleClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleDoubleClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

ZUI.mouseWheel = function(event) {
	event.preventDefault();
	var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	ZUI.activeView.mouseWheel(scroll);
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for context menu event */
ZUI.contextMenu = function(event) {
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Overriddable function for passing input events to another element, takes event as parameter */
ZUI.passInputEvent = null;

/* Gets mouse position in screen coordinates */
ZUI.getMousePosition = function(event) {
	var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
	return {
		x: event.clientX - canvasBoundingRect.left,
		y: event.clientY - canvasBoundingRect.top
	};
};

/* Checks whether a string describes a valid color */
ZUI.isValidColor = function(str) {
	if (!str || !str.match) {
		return null;
	}
	else {
		return str.match(/^#[a-f0-9]{6}$/i) !== null;
	}
};

/* Animation class */
ZUI.Animation = function(frames, drawFrame, begin, end) {
	this.frames = frames;
	this.drawFrame = drawFrame;
	this.begin = begin;
	this.end = end;
	this.currentFrame = 0;
};

	/* Draw next frame */
	ZUI.Animation.prototype.next = function() {
		this.drawFrame(this.currentFrame);
		this.currentFrame++;
	};

	/* Determines whether animation is over */
	ZUI.Animation.prototype.isOver = function() {
		if (this.currentFrame < this.frames) return false;
		else return true;
	};

	/* Resets animation */
	ZUI.Animation.prototype.reset = function() {
		this.currentFrame = 0;
	};

/* View superclass with abstract and overridable methods */
ZUI.View = function() {};
	ZUI.View.prototype.active = function() {};
	ZUI.View.prototype.inactive = function() {};
	ZUI.View.prototype.draw = function() {};
	ZUI.View.prototype.leftMouseDown = function() {};
	ZUI.View.prototype.middleMouseDown = function() {};
	ZUI.View.prototype.rightMouseDown = function() {};
	ZUI.View.prototype.leftMouseUp = function() {};
	ZUI.View.prototype.middleMouseUp = function() {};
	ZUI.View.prototype.rightMouseUp = function() {};
	ZUI.View.prototype.mouseMove = function() {};
	ZUI.View.prototype.leftClick = function() {};
	ZUI.View.prototype.middleClick = function() {};
	ZUI.View.prototype.rightClick = function() {};
	ZUI.View.prototype.leftDoubleClick = function() {};
	ZUI.View.prototype.middleDoubleClick = function() {};
	ZUI.View.prototype.mouseWheel = function(scroll) {};
	ZUI.View.prototype.getLoadProgress = function() {};		//return Number between 0 and 1, inclusive

/* View object class */
ZUI.ViewObject = function(attributes) {
	/* Set shape and its attributes */
	if (!attributes.type) return null;
	this.shape = attributes.shape;
	if (this.shape == "rect") {
		this.x = (attributes.x == undefined) ? 0 : attributes.x;
		this.y = (attributes.y == undefined) ? 0 : attributes.y;
		this.width = (attributes.width == undefined) ? 0 : attributes.width;
		this.height = (attributes.height == undefined) ? 0 : attributes.height;
		if (attributes.radius == undefined) {
			this.ltradius = (attributes.ltradius == undefined) ? 0 : attributes.ltradius;
			this.rtradius = (attributes.rtradius == undefined) ? 0 : attributes.rtradius;
			this.lbradius = (attributes.lbradius == undefined) ? 0 : attributes.lbradius;
			this.rbradius = (attributes.rbradius == undefined) ? 0 : attributes.rbradius;
		}
		else {
			this.ltradius = attributes.radius;
			this.rtradius = attributes.radius;
			this.lbradius = attributes.radius;
			this.rbradius = attributes.radius;
		}
	}
	else if (this.shape == "circle") {
		this.x = (attributes.x == undefined) ? 0 : attributes.x;
		this.y = (attributes.y == undefined) ? 0 : attributes.y;
		this.radius = (attributes.radius == undefined) ? 0 : attributes.radius;
		this.hradius = (attributes.hradius == undefined) ? 0 : attributes.hradius;
		this.vradius = (attributes.vradius == undefined) ? 0 : attributes.vradius;
	}
	else if (this.shape == "polygon") {
		this.x = (attributes.x == undefined) ? 0 : attributes.x;
		this.y = (attributes.y == undefined) ? 0 : attributes.y;
		this.vertices = (attributes.vertices == undefined || attributes.vertices.length == undefined) ? [] : attributes.vertices;
	}
	else if (this.shape == "path") {
		this.x = (attributes.x == undefined) ? 0 : attributes.x;
		this.y = (attributes.y == undefined) ? 0 : attributes.y;
		this.vertices = (attributes.vertices == undefined || attributes.vertices.length == undefined) ? [] : attributes.vertices;
	}
	else if (this.shape == "text") {
		this.x = (attributes.x == undefined) ? 0 : attributes.x;
		this.y = (attributes.y == undefined) ? 0 : attributes.y;
		this.centerAt = (attributes.centerAt == undefined) ? "center center" : attributes.centerAt;
		this.content = (attributes.content == undefined) ? "" : attributes.content;
	}
	else if (this.shape == "advpath") {
		//TODO
	}
	else if (this.shape == "advshape") {
		//TODO
	}
	else return null;

	/* Set stroke and fill */
	this.stroke = (attributes.stroke == undefined) ? true : attributes.stroke;
	this.strokeColor = (attributes.strokeColor == undefined) ? "#000000" : attributes.strokeColor;
	this.strokeWidth = (attributes.strokeWidth == undefined) ? 1 : attributes.strokeWidth;
	this.fill = (attributes.fill == undefined) ? true : attributes.fill;
	this.fillColor = (attributes.fillColor == undefined) ? "#000000" : attributes.fillColor;
	this.alpha = (attributes.alpha == undefined) ? 1 : attributes.alpha;

	/* Set scale */
	this.scale = (attributes.scale == undefined) ? "world" : attributes.scale;
};

ZUI.ViewObject.prototype.draw = function() {
	if (this.shape == "rect") {
		if (this.scale == "world") {
			var position = ZUI.camera.projectPoint(this.x, this.y);
			this.screenX = position.x;
			this.screenY = position.y;
			this.screenWidth = ZUI.camera.projectDistance(this.width);
			this.screenHeight = ZUI.camera.projectDistance(this.height);
			this.screenLtradius = ZUI.camera.projectDistance(this.ltradius);
			this.screenRtradius = ZUI.camera.projectDistance(this.rtradius);
			this.screenLbradius = ZUI.camera.projectDistance(this.lbradius);
			this.screenRbradius = ZUI.camera.projectDistance(this.rbradius);
		}
		else if (this.scale == "screen") {
			this.screenX = this.x;
			this.screenY = this.y;
			this.screenWidth = this.width;
			this.screenHeight = this.height;
			this.screenLtradius = this.ltradius;
			this.screenRtradius = this.rtradius;
			this.screenLbradius = this.lbradius;
			this.screenRbradius = this.rbradius;
		}
		ZUI.context.save();
		ZUI.context.strokeStyle = this.strokeColor;
		ZUI.context.lineWidth = this.strokeWidth;
		ZUI.context.fillStyle = this.fillColor;
		ZUI.context.globalAlpha = this.alpha;
		ZUI.context.beginPath();
		ZUI.context.moveTo(this.screenX + this.screenLtradius, this.screenY);
		ZUI.context.arcTo(this.screenX + this.screenWidth, this.screenY, this.screenX + this.screenWidth, this.screenY + this.screenHeight, this.screenRtradius);
		ZUI.context.arcTo(this.screenX + this.screenWidth, this.screenY + this.screenHeight, this.screenX, this.screenY + this.screenHeight, this.screenRbradius);
		ZUI.context.arcTo(this.screenX, this.screenY + this.screenHeight, this.screenX, this.screenY, this.screenLbradius);
		ZUI.context.arcTo(this.screenX, this.screenY, this.screenX + this.screenWidth, this.screenY, this.screenLtradius);
		ZUI.context.closePath();
		if (this.stroke) {
			ZUI.context.stroke();
		}
		if (this.fill) {
			ZUI.context.fill();
		}
		ZUI.context.restore();
	}
	else if (this.shape == "circle") {
	}
	else if (this.shape == "polygon") {
	}
	else if (this.shape == "path") {
	}
	else if (this.shape == "text") {
	}
	else if (this.shape == "advpath") {
		//TODO
	}
	else if (this.shape == "advshape") {
		//TODO
	}
};

