(function() {

    ZUI.Hash = function() {
        // call base constructor
        ZUI.Base.call(this);

        this._private.pairs = [];
    };

    // inherit base
    ZUI.Helper.inheritClass(ZUI.Base, ZUI.Hash);

    // adds a new key-value pair or sets an existing key's value
    ZUI.Hash.prototype.put = function(key, value) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                this._private.pairs[n].value = value;
                return;
            }
        }
        this._private.pairs.push({
            key: key,
            value: value
        });
    };

    // gets a key's value
    ZUI.Hash.prototype.get = function(key) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                return this._private.pairs[n].value;
            }
        }
        return null;
    };

    // deletes a key-value pair
    ZUI.Hash.prototype.delete = function(key) {
        for (var n = 0; n < this._private.pairs.length; n++) {
            if (this._private.pairs[n].key == key) {
                this._private.pairs.splice(n, 1);
                return;
            }
        }
    };

    // returns a list of keys
    ZUI.Hash.prototype.getKeys = function() {
        var keys = [];
        for (var n = 0; n < this._private.pairs.length; n++) {
            keys.push(this._private.pairs[n].key);
        }
        return keys;
    };

    // returns the number of key:value pairs
    ZUI.Hash.prototype.getSize = function() {
        return this._private.pairs.length;
    };

})();