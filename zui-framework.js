/**
 * By Hans Yu
 */

/**
 * ZUI namespace
 */
var ZUI = {};
	ZUI.activeView = null;
	ZUI.Views = null;

	/**
	 * Initializes ZUI
	 * 
	 * settings
	 *     width
	 *     height
	 *     viewAngle3D
	 *     near3D
	 *     far3D
	 *     container
	 *     firstView
	 *     views
	 */
	ZUI.initialize = function(settings) {
		/* Initialize KineticJS */
		ZUI.Kinetic.stage = new Kinetic.Stage({
			container: settings.container || document.body,
			width: (settings.width + settings.height * 0) || 1024,
			height: (settings.height + settings.width * 0) || 800
		});
		ZUI.Kinetic.layer3D = new Kinetic.Layer();
		ZUI.Kinetic.layer2D = new Kinetic.Layer();
		
		/* Initialize Three.JS */
		ZUI.Three.scene = new THREE.Scene();
		ZUI.Three.renderer = new THREE.WebGLRenderer({
			canvas: ZUI.Kinetic.layer3D.getCanvas().getElement()
		});
		ZUI.Three.camera = new THREE.PerspectiveCamera(
			settings.viewAngle3D || 45,
			(settings.width / settings.height) || (1024 / 800),
			settings.near3D || 1,
			settings.far3D || 10000
		);
		ZUI.Three.renderer.setSize(
			(settings.width + settings.height * 0) || 1024,
			(settings.height + settings.width * 0) || 800
		);
		ZUI.Three.scene.add(ZUI.Three.camera);
		
		/* Store views */
		ZUI.Views = settings.views || {};
		
		/* Set first view */
		ZUI.activeView = settings.firstView || new View();
		
		/* Set up event listeners */
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("click", ZUI._onClick, false);
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("dblclick", ZUI._onDoubleClick, false);
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("mousedown", ZUI._onMouseDown, false);
		document.addEventListener("mouseup", ZUI._onMouseUp, false);
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("mousemove", ZUI._onMouseMove, false);
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("mousewheel", ZUI._onMouseWheel, false);
		ZUI.Kinetic.layer2D.getCanvas().getElement().addEventListener("contextmenu", ZUI._onContextMenu, false);
		
		/* Start render loop */
		ZUI._onRender();
	};
	
	/**
	 * Sets the active view
	 */
	ZUI.setActiveView = function(view) {
		if (ZUI.activeView) {
			ZUI.activeView.onInactive();
		}
		ZUI.activeView = view;
		ZUI.activeView.onActive();
	};
	
	/**
	 * Renders 3D and 2D layers
	 */
	ZUI.render = function() {
		ZUI.Three.renderer.render(ZUI.Three.scene, ZUI.Three.camera);
		ZUI.Kinetic.layer2D.draw();
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
			ZUI.activeView.onLeftMouseDown(event);
		}
		else if (event.button == 1) {
			ZUI.activeView.onMiddleMouseDown(event);
		}
		else if (event.button == 2) {
			ZUI.activeView.onRightMouseDown(event);
		}
	};
	
	/**
	 * Handles mouse up event
	 */
	ZUI._onMouseUp = function(event) {
		if (event.button == 0) {
			ZUI.activeView.onLeftMouseUp(event);
		}
		else if (event.button == 1) {
			ZUI.activeView.onMiddleMouseUp(event);
		}
		else if (event.button == 2) {
			ZUI.activeView.onRightMouseUp(event);
		}
	};
	
	/**
	 * Handles mouse move event
	 */
	ZUI._onMouseMove = function(event) {
		ZUI.activeView.onMouseMove(event);
	};
	
	/**
	 * Handles mouse wheel event
	 */
	ZUI._onMouseWheel = function(event) {
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
		requestAnimationFrame(ZUI._onRender);
		ZUI.activeView.onRender();
	};
	
	/**
	 * ZUI.Kinetic namespace
	 */
	ZUI.Kinetic = {};
		ZUI.Kinetic.stage = null;
		ZUI.Kinetic.layer3D = null;
		ZUI.Kinetic.layer2D = null;
	
	/**
	 * ZUI.Three namespace
	 */
	ZUI.Three = {};
		ZUI.Three.scene = null;
		ZUI.Three.renderer = null;
		ZUI.Three.camera = null;

	/**
	 * View class
	 */
	ZUI.View = function() {};
		ZUI.View.prototype.minMagnification = 1;
		ZUI.View.prototype.maxMagnification = 100;
		
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
		ZUI.View.prototype.onContextMenu = function(event) {};
		ZUI.View.prototype.onRender = function() {};
		ZUI.View.prototype.onActive = function() {};
		ZUI.View.prototype.onInactive = function() {};
