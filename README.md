zui-framework
=============
A JavaScript framework for creating 2D single-page web applications. This framework was originally designed for creating applications with 2D zooming-user-interface (hence ZUI), but its features have expanded to support the development of 2D single-page applications.


Initializing the ZUI framework
-------------
The ZUI framework must be initialized before its features become functional. To initialize, call the method ```ZUI.initialize(settings)```.

The ```settings``` parameter passed to the method is an object with various parameters defined. The supported parameters are:<br>
```canvas```: The canvas element to be used by the ZUI framework. This must be defined.<br>
```width```: The width of the canvas. If this is undefined then the original width of the canvas will be used.<br>
```height```: The height of the canvas. If this is undefined then the original height of the canvas will be used.<br>
```background```: The background color of the ZUI canvas, defaults to ```"#FFFFFF"``` (white).<br>
```backgroundAlpha```: The alpha of the ZUI canvas background (0 to 1, inclusive). This parameter is useful when there should be visible content under the ZUI canvas. Defaults to ```1``` (opaque).<br>
```frameRate```: The frame rate of the ZUI application. Defaults to ```60``` (frames per second).

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
The ZUI framework is driven by Views. A ZUI View is an object with various callback methods defined so that the ZUI framework can tell the View about what the View should respond to. How the View responds depends on how the corresponding callback method is defined.

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
	positionScale: "world",
	sizeScale: "world",
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

The ZUI framework automatically keeps a reference of each ViewObject created. If a ViewObject is no longer in use, its ```remove()``` method must be called to prevent memory leak.

Controlling the camera
-------------
The ZUI framework has one pre-defined camera object, ```ZUI.camera```, with several configurable properties:<br>
```fov```: Field of view in radians, defaults to ```Math.PI / 2```.<br>
```x```: Destination x position.<br>
```y```: Destination y position.<br>
```distance```: Destination distance.<br>
```_x```: True x position.<br>
```_y```: True y position.<br>
```_distance```: True distance.<br>
```moveRate```: The rate for which the camera moves towards its destination (0 to 1, inclusive). This parameter is used to produce camera easing effect. Defaults to ```1``` (no easing, moves to destination instantly).<br>
```autoUpdate```: Boolean value indicating whether the camera automatically updates at each frame. Defaults to ```false```.

The camera object also offers several useful methods:<br>
```update()```: Updates the camera. This should be called each frame to move the camera towards its destination.<br>
```setPosition(x, y)```: Sets the true position of the camera.<br>
```setDistance(distance)```: Sets the true distance of the camera.<br>
```projectPoint(x, y)```: Projects the given ZUI world coordinates to screen coordinates.<br>
```projectDistance(distance)```: Projects the given ZUI world distance to screen distance.<br>
```unprojectPoint(x, y)```: Unprojects the given screen coordinates to ZUI world coordinates.<br>
```unprojectDistance(distance)```: Unprojects the given screen distance to ZUI world distance.<br>
```reset()```: Resets the camera's state.

The following draw callback function will cause the camera to continuously pan towards the right:
```
/* Override draw callback method */
SimpleView.prototype.draw() {
	/* Update camera for each frame */
	ZUI.camera.update();
	
	/* Draw ViewObjects */
	// ...
	
	/* Pan camera to the right */
	ZUI.camera.x += 0.2;
};
```

Changing the active View
-------------
Once the ZUI framework is initialized, an empty View object is set as the active View. Therefore, the active View must be changed manually after ZUI initialization. To change the active View, simply call ```ZUI.changeActiveView(view)```. The old active View will have its ```inactive()``` callback method invoked, then the ```active()``` callback method of the new active View will be called. The following example sets an instance of the ```SimpleView``` class as the new active View.
```
var mySimpleView = new SimpleView();
ZUI.changeActiveView(mySimpleView);
```

Custom events
-------------
The ZUI framework supports custom events that are regulated by the ZUI framework. There are two important classes for this feature: the ```ZUI.Event``` class and the ```ZUI.EventListener``` class.

An Event object can be created with the ```ZUI.Event``` constructor. The constructor takes three parameters: the type of the Event, the target of the Event, and additional data associated with the Event. The following example creates an Event object of type ```"surprise"``` targeted at our ```mySimpleView``` object, with the message ```"You won the lottery! Not."``` embedded in the additional data object.
```
var myEvent = new ZUI.Event("surprise", mySimpleView, {
	message: "You won the lottery! Not."
});
```

An EventListener object can be created with the ```ZUI.EventListener``` constructor. The constructors takes four parameters: the type of Event to listen for, the target of the Event, the callback function, and additional data associated with the EventListener. The callback function receives three parameters: ```event```, ```eventData```, and ```listenerData```. An EventListener must be added to the ZUI framework with the method ```ZUI.addEventListener(eventListener)``` before it becomes functional. The following example creates an EventListener that listens for the ```myEvent``` Event we just created and logs the Event's message when the Event gets fired.
```
/* Create EventListener object */
var myEventListener = new ZUI.EventListener("surprise", mySimpleView, function(event, eventData, listenerData) {
	// Note listenerData is null, since that is what we defined as the additional data for this EventListener
	
	console.log(listenerData.message);
}, null);

/* Add our EventListener to the ZUI framework */
ZUI.addEventListener(myEventListener);
```

Of course, nothing will happen unless we actually fire the Event. An Event can be fired with the method ```ZUI.fireEvent(event)```. The following code will fire our Event when ```SimpleView``` becomes active.
```
/* Override active callback method */
SimpleView.prototype.active = function() {
	/* Create an Event */
	var myEvent = new ZUI.Event("surprise", mySimpleView, {
		message: "You won the lottery! Not."
	});
	
	/* Fire our Event */
	ZUI.fireEvent(myEvent);
};
```

To remove an EventListener from the ZUI framework, call the method ```ZUI.removeEventListener(eventListener)```. The following removes the EventListener we just created.
```
ZUI.removeEventListener(myEventListener);
```

Custom context menu
-------------

Animation
-------------

