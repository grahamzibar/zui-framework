zui-framework
=============

A JavaScript framework for creating 2D single-page web applications. This framework was originally designed for creating applications with 2D zooming-user-interfaces (hence ZUI), but its features have expanded to support the development of 2D single-page applications.


Initializing the ZUI framework
-------------
The ZUI framework must be initialized before its features become functional. To initialize, call the method ```ZUI.initialize(settings)```.

The ```settings``` parameter passed to the method is an object with various parameters defined. The supported parameters are:
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


Adding ViewObjects to a View
-------------


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
