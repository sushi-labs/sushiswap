"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TransientStorage = /** @class */ (function () {
    function TransientStorage() {
        /**
         * The current values of the transient storage, keyed by contract address and then slot
         */
        this._storage = new Map();
        /**
         * Each change to storage is recorded in the journal. This is never cleared.
         */
        this._changeJournal = [];
        /**
         * The length of the journal at the beginning of each call in the call stack.
         */
        this._indices = [0];
    }
    /**
     * Get the value for the given address and key
     * @param addr the address for which transient storage is accessed
     * @param key the key of the address to get
     */
    TransientStorage.prototype.get = function (addr, key) {
        var map = this._storage.get(addr.toString());
        if (!map) {
            return Buffer.alloc(32);
        }
        var value = map.get(key.toString('hex'));
        if (!value) {
            return Buffer.alloc(32);
        }
        return value;
    };
    /**
     * Put the given value for the address and key
     * @param addr the address of the contract for which the key is being set
     * @param key the slot to set for the address
     * @param value the new value of the transient storage slot to set
     */
    TransientStorage.prototype.put = function (addr, key, value) {
        var _a;
        if (key.length !== 32) {
            throw new Error('Transient storage key must be 32 bytes long');
        }
        if (value.length > 32) {
            throw new Error('Transient storage value cannot be longer than 32 bytes');
        }
        var addrString = addr.toString();
        if (!this._storage.has(addrString)) {
            this._storage.set(addrString, new Map());
        }
        var map = this._storage.get(addrString);
        var keyStr = key.toString('hex');
        var prevValue = (_a = map.get(keyStr)) !== null && _a !== void 0 ? _a : Buffer.alloc(32);
        this._changeJournal.push({
            addr: addrString,
            key: keyStr,
            prevValue: prevValue,
        });
        map.set(keyStr, value);
    };
    /**
     * Commit all the changes since the last checkpoint
     */
    TransientStorage.prototype.commit = function () {
        if (this._indices.length === 0)
            throw new Error('Nothing to commit');
        // by discarding the length of the array from the last time checkpoint was called, all changes are included in the last stack
        this._indices.pop();
    };
    /**
     * To be called whenever entering a new context. If revert is called after checkpoint, all changes after the latest checkpoint are reverted.
     */
    TransientStorage.prototype.checkpoint = function () {
        this._indices.push(this._changeJournal.length);
    };
    /**
     * Revert transient storage to the last checkpoint
     */
    TransientStorage.prototype.revert = function () {
        var lastCheckpoint = this._indices.pop();
        if (typeof lastCheckpoint === 'undefined')
            throw new Error('Nothing to revert');
        for (var i = this._changeJournal.length - 1; i >= lastCheckpoint; i--) {
            var _a = this._changeJournal[i], key = _a.key, prevValue = _a.prevValue, addr = _a.addr;
            this._storage.get(addr).set(key, prevValue);
        }
        this._changeJournal.splice(lastCheckpoint, this._changeJournal.length - lastCheckpoint);
    };
    /**
     * Create a JSON representation of the current transient storage state
     */
    TransientStorage.prototype.toJSON = function () {
        var e_1, _a, e_2, _b;
        var result = {};
        try {
            for (var _c = __values(this._storage.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), address = _e[0], map = _e[1];
                result[address] = {};
                try {
                    for (var _f = (e_2 = void 0, __values(map.entries())), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var _h = __read(_g.value, 2), key = _h[0], value = _h[1];
                        result[address][key] = value.toString('hex');
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    return TransientStorage;
}());
exports.default = TransientStorage;
//# sourceMappingURL=transientStorage.js.map