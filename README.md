zui-framework
=============

A JavaScript framework for creating 2D single-page web applications. This framework was originally designed for creating applications with 2D zooming-user-interfaces (hence ZUI), but its features have expanded to support the development of 2D single-page applications.


Initializing the ZUI framework
-------------
The ZUI framework must be initialized before its features become functional. To initialize, call the method ```ZUI.initialize(settings)```.

The ```settings``` parameter passed to the method is an object with various parameters defined. The supported parameters are:<br>
```canvas```: The canvas element to be used by the ZUI framework. This must be defined.<br>
```width```: The width of the canvas. If this is undefined then the original width of the canvas will be used.<br>
```height```: The height of the canvas. If this is undefined then the original height of the canvas will be used.<br>
```background```: The background color of the ZUI canvas, defaults to white.<br>
```backgroundAlpha```: The alpha of the ZUI canvas background (0 to 1, inclusive). This parameter is useful when there should be visible content under the ZUI canvas. Defaults to 1 (opaque).<br>
```frameRate```: The frame rate of the ZUI application. Defaults to 60 (frames per second).

Example:
```
ZUI.initialize({
	canvas: document.getElementById("zui-canvas"),
	width: 800,
	height: 600,
	background: "#C7C7C7",
	frameRate: 30
});
```

Creating a View
-------------
The ZUI framework is driven by Views. A ZUI View is an object with various callback methods defined so that the ZUI framework can tell the View about what the View should respond to. How the View responds depends on how the callback method id defined.

The main callback methods of a View are:<br>
```active()```: This method is called when the View becomes active. There can only be one active View at any given time.<br>
```inactive()```: This method is called when the View becomes inactive.<br>
```draw()```:  This method is called when the ZUI framework is ready to draw the next frame. Only the ```draw()``` method of the currently active View will be called.<br>
```remove()```: This method should be manually called when the View is no longer needed. It is intended to handle the View's cleanup procedures. Note the ZUI framework will never call this method automatically.<br>

The View must be defined as a child class of ZUI.View. A View object can then be created using the constructor of the defined View class.

A simple View can be defined as follows:
```
/* Class constructor */
function SimpleView() {
	ZUI.View.call(this);	// Call parent constructor
}
ZUI.Util.inheritClass(ZUI.View, SimpleView);	// Inherit parent prototype

/* Override active callback method */
SimpleView.prototype.active = function() {
	console.log("I am now active.");
};

/* Override inactive callback method */
SimpleView.prototype.inactive = function() {
	console.log("I am now inactive.");
};

/* Override draw callback method */
SimpleView.prototype.draw = function() {
	console.log("We will learn how to draw things later.");
};

/* Override remove callback method */
SimpleView.prototype.remove = function() {
	console.log("Too bad there isn't anything to clean up.");
};
```

There are also callback methods available for user input events. These callback methods will only be called if the View is currently active. Below is a complete list:<br>
```leftMouseDown```: Left mouse button is pressed down.<br>
```middleMouseDown```: Mouse wheel button is pressed down.<br>
```rightMouseDown```: Right mouse button is pressed down.<br>
```leftMouseUp```: Left mouse button is released.<br>
```middleMouseUp```: Mouse wheel button is released.<br>
```rightMouseUp```: Right mouse button is released.<br>
```mouseMove```: Mouse is moved.<br>
```leftClick```: Left mouse button is clicked.<br>
```middleClick```: Mouse scroll button is clicked.<br>
```rightClick```: Right mouse button is clicked.<br>
```leftDoubleClick```: Left mouse button is double clicked.<br>
```middleDoubleClick```: Mouse wheel button is double clicked.<br>
```mouseWheel```: Mouse wheel is scrolled.<br>
```contextMenu```: Context menu is triggered.

Adding ViewObjects to a View
-------------
ViewObjects are objects that get drawn on the ZUI canvas.

There are several types of ViewObjects:<br>
```rect```: Rectangle with support for round edges.<br>
```circle```: Circle or ellipse with horizontal and vertical radius.<br>
```polygon```: Polygon with straight edges connecting multiple vertices.<br>
```path```: Line connecting several vertices.<br>
```text```: Text.<br>
```multilinetext```: Text that supports the newline character "\n".<br>
```svg```: Scalable Vector Graphics.<br>
```advshape```: Complex shape with straight and/or curved edges defined by a path string.

The ```ZUI.ViewObject``` class constructor can be called to create a ViewObject instance. Attributes of the ViewObject can be passed to the constructor in a wrapped object. For a complete list of the available attributes, please see the documentation for the ```ZUI.ViewObject``` class. The following example creates a new ViewObject of type ```circle```:
```
var myViewObject = new ZUI.ViewObject({
	shape: "circle",
	positionScale: "screen",
	sizeScale: "screen",
	x: 200,
	y: 200,
	radius: 100,
	centerAt: "center center",
	strokeWidth: 3,
	strokeColor: "#FF0000",
	fillColor: "#00FFFF"
});
```

To "add" a ViewObject to a View, simply keep a reference of the ViewObject and draw the ViewObject in the View's ```draw``` callback method. To demonstrate:
```
/* Class constructor */
function SimpleView() {
	ZUI.View.call(this);	// Call parent constructor
	
	/* Create a ViewObject */
	this.myCircle = new ZUI.ViewObject({
		shape: "circle",
		positionScale: "screen",
		sizeScale: "screen",
		x: 200,
		y: 200,
		radius: 100,
		centerAt: "center center",
		strokeWidth: 3,
		strokeColor: "#FF0000",
		fillColor: "#00FFFF"
	});
}
ZUI.Util.inheritClass(ZUI.View, SimpleView);	// Inherit parent prototype

/* Override draw callback method */
SimpleView.prototype.draw = function() {
	/* Draw our ViewObject */
	this.myCircle.draw();
};
```

Although the above code is sufficient for drawing a ViewObject, we may also want to keep track of user inputs targeted at the ViewObject. To let the ZUI framework know that a ViewObject is expecting user inputs, simply append the ViewObject to the View's ```viewObjects``` array property and define a callback function for the input event. The following code allows the ViewObject to respond to left click events.
```
/* Class constructor */
function SimpleView() {
	ZUI.View.call(this);	// Call parent constructor
	
	/* Create a ViewObject */
	this.myCircle = new ZUI.ViewObject({
		shape: "circle",
		positionScale: "screen",
		sizeScale: "screen",
		x: 200,
		y: 200,
		radius: 100,
		centerAt: "center center",
		strokeWidth: 3,
		strokeColor: "#FF0000",
		fillColor: "#00FFFF",
		leftClick: function() {
			if (this.radius == 100) this.radius = 150;
			else this.radius = 100;
		}
	});
	
	/* Append our ViewObject to the viewObjects array so that we can keep track of its user inputs */
	this.viewObjects.push(this.myCircle);
}
ZUI.Util.inheritClass(ZUI.View, SimpleView);	// Inherit parent prototype

/* Override draw callback method */
SimpleView.prototype.draw = function() {
	/* Draw our ViewObject */
	this.myCircle.draw();
};

/* Override remove callback method */
SimpleView.prototype.remove = function() {
	/* Remove our ViewObject to prevent memory leak */
	this.myCircle.remove();
};
```

The ZUI framework automatically keeps a reference to each ViewObject created. If a ViewObject is no longer in use, its ```remove()``` method must be called to prevent memory leak.

Controlling the camera
-------------


Changing the active View
-------------


Animation
-------------


Custom events
-------------


Custom context menu
-------------
