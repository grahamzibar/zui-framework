/**
 * By Hans Yu
 */

/**
 * ZUI namespace
 */
var ZUI = {};
	ZUI.activeView = null;
	ZUI.Views = null;
	ZUI.isLeftMouseDown = false;
	ZUI.isMiddleMouseDown = false;
	ZUI.isRightMouseDown = false;
	ZUI.lastMousePosition = null;
	ZUI.mousePosition = null;

	/**
	 * Initializes ZUI
	 * 
	 * settings
	 *     width
	 *     height
	 *     viewAngle3D
	 *     container
	 *     firstView
	 *     views
	 *     clearColor
	 */
	ZUI.initialize = function(settings) {
		/* Initialize Three.JS */
		ZUI.Three.scene = new THREE.Scene();
		ZUI.Three.renderer = new THREE.WebGLRenderer();
		ZUI.Three.canvas = ZUI.Three.renderer.domElement;
		((typeof settings.container === "undefined") ? document.body : settings.container).appendChild(ZUI.Three.canvas);
		ZUI.Three.camera = new THREE.PerspectiveCamera(
			(typeof settings.viewAngle3D === "undefined") ? 45 : settings.viewAngle3D,
			(typeof (settings.width / settings.height) === "undefined") ? 1024 / 800 : settings.width / settings.height,
			0.1,
			10000
		);
		ZUI.Three.cameraController = new ZUI.Three.CameraController(ZUI.Three.camera);
		ZUI.Three.renderer.setSize(
			(typeof (settings.width + settings.height * 0) === "undefined") ? 1024 : settings.width,
			(typeof (settings.height + settings.width * 0) === "undefined") ? 800 : settings.height
		);
		ZUI.Three.renderer.setClearColor((typeof settings.clearColor === "undefined") ? 0xffffff : settings.clearColor, 1);
		ZUI.Three.scene.add(ZUI.Three.camera);
		
		/* Store views */
		ZUI.views = (typeof settings.view === "undefined") ? {} : settings.views;
		
		/* Set first view */
		ZUI.setActiveView((typeof settings.firstView === "undefined") ? new View() : settings.firstView);
		ZUI.Three.cameraController.distance = (ZUI.activeView.maxMagnification + ZUI.activeView.minMagnification) / 2;
		
		/* Set up event listeners */
		ZUI.Three.canvas.addEventListener("click", ZUI._onClick, false);
		ZUI.Three.canvas.addEventListener("dblclick", ZUI._onDoubleClick, false);
		ZUI.Three.canvas.addEventListener("mousedown", ZUI._onMouseDown, false);
		document.addEventListener("mouseup", ZUI._onMouseUp, false);
		ZUI.Three.canvas.addEventListener("mousemove", ZUI._onMouseMove, false);
		ZUI.Three.canvas.addEventListener("mousewheel", ZUI._onMouseWheel, false);
		ZUI.Three.canvas.addEventListener("contextmenu", ZUI._onContextMenu, false);
		
		/* Start render loop */
		ZUI._onRender();
	};
	
	/**
	 * Sets the active view
	 */
	ZUI.setActiveView = function(view) {
		/* Set magnification for new view */
		if (ZUI.Three.cameraController.distance > view.maxMagnification) {
			ZUI.Three.cameraController.distance = view.maxMagnification;
		}
		else if (ZUI.Three.cameraController.distance < view.minMagnification) {
			ZUI.Three.cameraController.distance = view.minMagnification;
		}
		
		/* Set new active view */
		if (ZUI.activeView) {
			ZUI._onInactive();
		}
		ZUI.activeView = view;
		ZUI._onActive();
	};
	
	/**
	 * Renders 3D and 2D layers
	 */
	ZUI.render = function() {
		ZUI.Three.renderer.render(ZUI.Three.scene, ZUI.Three.camera);
	};
	
	/**
	 * Updates camera
	 */
	ZUI.updateCamera = function() {
		ZUI.Three.cameraController.update();
	};
	
	/**
	 * Gets the mouse position
	 */
	ZUI.getMousePosition = function(event) {
		var canvasBoundingRect = ZUI.Three.canvas.getBoundingClientRect();
		return {
			x: event.clientX - canvasBoundingRect.left,
			y: event.clientY - canvasBoundingRect.top
		};
	};
	
	/**
	 * Handles mouse down event
	 */
	ZUI._onClick = function(event) {
		if (event.button == 0) {
			ZUI.activeView.onLeftClick(event);
		}
		else if (event.button == 1) {
			ZUI.activeView.onMiddleClick(event);
		}
		else if (event.button == 2) {
			ZUI.activeView.onRightClick(event);
		}
	};
	
	/**
	 * Handles mouse down event
	 */
	ZUI._onDoubleClick = function(event) {
		event.preventDefault();
		if (event.button == 0) {
			ZUI.activeView.onLeftDoubleClick(event);
		}
		else if (event.button == 1) {
			ZUI.activeView.onMiddleDoubleClick(event);
		}
		else if (event.button == 2) {
			ZUI.activeView.onRightDoubleClick(event);
		}
	};
	
	/**
	 * Handles mouse down event
	 */
	ZUI._onMouseDown = function(event) {
		if (event.button == 0) {
			ZUI.isLeftMouseDown = true;
			ZUI.activeView.onLeftMouseDown(event);
		}
		else if (event.button == 1) {
			ZUI.isMiddleMouseDown = true;
			ZUI.activeView.onMiddleMouseDown(event);
		}
		else if (event.button == 2) {
			ZUI.isRightMouseDown = true;
			ZUI.activeView.onRightMouseDown(event);
		}
	};
	
	/**
	 * Handles mouse up event
	 */
	ZUI._onMouseUp = function(event) {
		if (event.button == 0) {
			ZUI.isLeftMouseDown = false;
			ZUI.activeView.onLeftMouseUp(event);
		}
		else if (event.button == 1) {
			ZUI.isMiddleMouseDown = false;
			ZUI.activeView.onMiddleMouseUp(event);
		}
		else if (event.button == 2) {
			ZUI.isRightMouseDown = false;
			ZUI.activeView.onRightMouseUp(event);
		}
	};
	
	/**
	 * Handles mouse move event
	 */
	ZUI._onMouseMove = function(event) {
		ZUI.lastMousePosition = ZUI.mousePosition;
		ZUI.mousePosition = ZUI.getMousePosition(event);
		ZUI.activeView.onMouseMove(event);
	};
	
	/**
	 * Handles mouse wheel event
	 */
	ZUI._onMouseWheel = function(event) {
		/* Update magnification of activeView */
		ZUI.Three.cameraController.distance -= Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) * ZUI.Three.cameraController.distance * 0.05;
		
		ZUI.activeView.onMouseWheel(event);
	};
	
	/**
	 * Handles context menu event
	 */
	ZUI._onContextMenu = function(event) {
		event.preventDefault();
		ZUI.activeView.onContextMenu(event);
	};
	
	/**
	 * Handles render event
	 */
	ZUI._onRender = function() {
		/* Request next frame */
		requestAnimationFrame(ZUI._onRender);
		
		/* Check magnification for minimum or maximum limit */
		if (ZUI.Three.cameraController.distance < ZUI.activeView.minMagnification) {
			ZUI.Three.cameraController.distance = ZUI.activeView.minMagnification;
			ZUI.activeView.onMinMagnification();
		}
		else if (ZUI.Three.cameraController.distance > ZUI.activeView.maxMagnification) {
			ZUI.Three.cameraController.distance = ZUI.activeView.maxMagnification;
			ZUI.activeView.onMaxMagnification();
		}
		
		ZUI.activeView.onRender();
	};
	
	/**
	 * Handles active event
	 */
	ZUI._onActive = function() {
		/* Add objects to layers */
		for (var n = 0; n < ZUI.activeView.objects3D.length; n++) {
			ZUI.Three.scene.add(ZUI.activeView.objects3D[n]);
		}
		
		ZUI.activeView.onActive();
	};
	
	/**
	 * Handles inactive event
	 */
	ZUI._onInactive = function() {
		/* Remove objects from layers */
		for (var n = 0; n < ZUI.activeView.objects3D.length; n++) {
			ZUI.Three.scene.remove(ZUI.activeView.objects3D[n]);
		}
		
		ZUI.activeView.onInactive();
	};
	
	/**
	 * ZUI.Three namespace
	 */
	ZUI.Three = {};
		ZUI.Three.canvas = null;
		ZUI.Three.scene = null;
		ZUI.Three.renderer = null;
		ZUI.Three.camera = null;
		ZUI.Three.cameraController = null;
		
		ZUI.Three.CameraController = function(camera) {
			this.camera = camera;
			this.pan = Math.PI / 2;
			this.tilt = 0;
			this.lookAt = new THREE.Vector3(0, 0, 0);
			this.distance = 0;
		};
		
			ZUI.Three.CameraController.prototype.update = function() {
				this.camera.position.x = this.distance * Math.cos(this.tilt) * Math.cos(this.pan) + this.lookAt.x;
				this.camera.position.y = this.distance * Math.sin(this.tilt) + this.lookAt.y;
				this.camera.position.z = this.distance * Math.cos(this.tilt) * Math.sin(this.pan) + this.lookAt.z;
				this.camera.lookAt(this.lookAt);
			};
	
	/**
	 * ZUI.View class
	 * Should be inherited
	 */
	ZUI.View = function() {
		this.minMagnification = 1;
		this.maxMagnification = 100;
		this.objects3D = [];
	};
	
		ZUI.View.prototype.addObject3D = function(object) {
			this.objects3D.push(object);
			if (ZUI.activeView == this) {
				ZUI.Three.scene.add(object);
			}
		};
	
		/* Event handlers default behaviour */
		ZUI.View.prototype.onLeftClick = function(event) {};
		ZUI.View.prototype.onMiddleClick = function(event) {};
		ZUI.View.prototype.onRightClick = function(event) {};
		ZUI.View.prototype.onLeftDoubleClick = function(event) {};
		ZUI.View.prototype.onMiddleDoubleClick = function(event) {};
		ZUI.View.prototype.onRightDoubleClick = function(event) {};
		ZUI.View.prototype.onLeftMouseDown = function(event) {};
		ZUI.View.prototype.onMiddleMouseDown = function(event) {};
		ZUI.View.prototype.onRightMouseDown = function(event) {};
		ZUI.View.prototype.onLeftMouseUp = function(event) {};
		ZUI.View.prototype.onMiddleMouseUp = function(event) {};
		ZUI.View.prototype.onRightMouseUp = function(event) {};
		ZUI.View.prototype.onMouseMove = function(event) {};
		ZUI.View.prototype.onMouseWheel = function(event) {};
		ZUI.View.prototype.onContextMenu = function(event) {};
		ZUI.View.prototype.onRender = function() {};
		ZUI.View.prototype.onActive = function() {};
		ZUI.View.prototype.onInactive = function() {};
		ZUI.View.prototype.onMinMagnification = function() {};
		ZUI.View.prototype.onMaxMagnification = function() {};
