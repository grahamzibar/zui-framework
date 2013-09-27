/**
 * ZUI namespace
 * Core framework for Zooming User Interface
 * Depends on processing.js
 * By Hans Yu
 */
function ZUI() {}

/* Div container */
ZUI.container = document.getElementById("ZUI_container");

/* Canvas */
ZUI.canvas = document.getElementById("ZUI_canvas");

/* Processing handle */
ZUI.processing = null;

/* Frame rate */
ZUI.frameRate = 60;

/* Interface width */
ZUI.width = 800;

/* Interface height */
ZUI.height = 600;

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
	ZUI.camera._x = ZUI.width / 2;
	ZUI.camera._y = ZUI.height / 2;
	ZUI.camera._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);

	/* Move-to position */
	ZUI.camera.x = ZUI.camera._x;
	ZUI.camera.y = ZUI.camera._y;
	ZUI.camera.distance = ZUI.camera._distance;

	/* Rate at which the camera moves */
	ZUI.camera.moveRate = 0.1;

	/* Sets true position */
	ZUI.camera.setTruePosition = function(x, y, distance) {
		ZUI.camera._x = x;
		ZUI.camera._y = y;
		ZUI.camera._distance = distance;

		ZUI.camera.x = x;
		ZUI.camera.y = y;
		ZUI.camera.distance = distance;
	};

	/* Updates camera position */
	ZUI.camera.update = function() {
		ZUI.camera._x += (ZUI.camera.x - ZUI.camera._x) * ZUI.camera.moveRate;
		ZUI.camera._y += (ZUI.camera.y - ZUI.camera._y) * ZUI.camera.moveRate;
		ZUI.camera._distance += (ZUI.camera.distance - ZUI.camera._distance) * ZUI.camera.moveRate;
	};

	/* Projects world coordinates to screen coordinates */
	ZUI.camera.projectToScreen = function(x, y) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2)
		return {
			x: (x - ZUI.camera._x) * pixelsPerUnit + ZUI.width / 2,
			y: (y - ZUI.camera._y) * pixelsPerUnit + ZUI.height / 2,
		};
	};

/* Draws a list of view objects */
ZUI.drawViewObjects = function(viewObjects) {
	for (var n = 0; n < viewObjects.length; n++) {
		var viewObject = viewObjects[n];
		var vertices = viewObject.vertices;
		ZUI.processing.beginShape();
		for (var m = 0; m < vertices.length; m++) {
			var vertex = ZUI.camera.projectToScreen(vertices[m].x, vertices[m].y);
			ZUI.processing.vertex(vertex.x, vertex.y);
		}
		ZUI.processing.endShape(ZUI.processing.CLOSE);
	}
};

/* Attachment function for Processing */
ZUI.sketchProc = function(processing) {
	/* Processing setup */
	processing.setup = function() {
		/* Set frame rate */
		processing.frameRate(ZUI.frameRate);

		/* Adjust container size */
		ZUI.container.style.width = ZUI.width + "px";
		ZUI.container.style.height = ZUI.height + "px";
		ZUI.container.style.marginLeft = "-" + (ZUI.width / 2) + "px";

		/* Adjust canvas size */
		processing.size(ZUI.width, ZUI.height);

		/* Set background color */
		processing.background(processing.color(ZUI.background.red, ZUI.background.green, ZUI.background.blue, ZUI.background.alpha));
	};

	/* Processing draw */
	processing.draw = function() {
		/* Clear background */
		processing.background(processing.color(ZUI.background.red, ZUI.background.green, ZUI.background.blue, ZUI.background.alpha));

		/* Call draw function of the active view */
		ZUI.activeView.draw();
	};
};

/* Attaches Processing to canvas */
ZUI.attachProcessing = function(firstView) {
	ZUI.activeView = firstView;
	ZUI.activeView.active();
	ZUI.processing = new Processing(ZUI.canvas, ZUI.sketchProc);
};

/* View superclass with overridable methods */
ZUI.View = function() {};
	ZUI.View.prototype.active = function() {};
	ZUI.View.prototype.inactive = function() {};
	ZUI.View.prototype.draw = function() {};


