(function() {

    // constructor
    ZUI.ContextMenu = function() {
        // call base constructor
        ZUI.Base.call(this);

        // properties
        this.options = null;
        this.x = 0;
        this.y = 0;
        this.active = false;
        this.container = document.createElement('div');

        // set up DOM element
        this.container.className = 'zui-contextMenu';
        this.container.style.border = '1px solid #B4B4B4';
        this.container.style.width = '160px';
        this.container.style.height = 'auto';
        this.container.style.minHeight = '0';
        this.container.style.position = 'relative';
        this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
        this.container.style.top = this.y + 'px';
        this.container.oncontextmenu = function() {
            return false;
        };
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.ContextMenu);

    // open
    ZUI.ContextMenu.prototype.open = function(x, y, options) {
        // close context menu if already open
        if (this.active) {
            this.close();
        }

        // set position, if specified
        if (x === undefined && y === undefined) {
            this.x = ZUI.mouseStatus.x;
            this.y = ZUI.mouseStatus.y;
            this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
            this.container.style.top = this.y + 'px';
        }
        else {
            this.x = x;
            this.y = y;
            this.container.style.left = ((this.x > ZUI.width / 2) ? (this.x - 162) : this.x) + 'px';
            this.container.style.top = this.y + 'px';
        }

        // add options
        this.options = options;
        for (var n = 0; n < options.length; n++) {
            this.container.appendChild(options[n].container);
            options[n].contextMenu = this;
        }

        // append context menu container to document
        ZUI.container.appendChild(this.container);

        // change status to active
        this.active = true;
    };

    // close
    ZUI.ContextMenu.prototype.close = function() {
        // remove context menu container from document
        ZUI.container.removeChild(this.container);

        // clear options
        this.options = null;
        this.container.innerHTML = '';

        // change status to inactive
        this.active = false;
    };

    ///////////////////////////////////////////////////////////////////////////////

    // constructor
    ZUI.ContextMenu.Option = function(label, callback, data, enabled, autoClose) {
        // call base constructor
        ZUI.Base.call(this);

        // properties
        this.label = label;
        this.callback = callback;
        this.data = data;
        this.enabled = (enabled === undefined) ? true : enabled;
        this.autoClose = (autoClose === undefined) ? true : autoClose;
        this.contextMenu = null;
        this.container = document.createElement("span");

        // set up DOM element
        this.container.className = "zui-contextMenu-option";
        this.container.style.padding = "3px 20px";
        this.container.style.display = "block";
        this.container.style.width = "120px";
        if (this.enabled) {
            this.container.style.backgroundColor = "#FFFFFF";
            this.container.style.color = "#3C3C3C";
        }
        else {
            this.container.style.backgroundColor = "#FFFFFF";
            this.container.style.color = "#B4B4B4";
        }
        this.container.innerHTML = label;
        this.container.onmouseover = (function() {
            if (this.enabled) {
                this.container.style.backgroundColor = "#787878";
                this.container.style.color = "#FFFFFF";
            }
            else {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#B4B4B4";
            }
        }).bind(this);
        this.container.onmouseout = (function() {
            if (this.enabled) {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#3C3C3C";
            }
            else {
                this.container.style.backgroundColor = "#FFFFFF";
                this.container.style.color = "#B4B4B4";
            }
        }).bind(this);
        this.container.onclick = (function(){
            this.callback(this.data);
            if (this.autoClose && this.contextMenu.active) {
                this.contextMenu.close();
            }
        }).bind(this);
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.ContextMenu.Option);

})();
