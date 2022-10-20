'use strict';

var backwards_utils_snakeCase = require('../utils/snakeCase.cjs');

var Layer = /** @class */ (function () {
    /**
     * Layer
     * @constructor Layer
     * @param {Object} options - layer parameters
     */
    function Layer(options) {
        var _this = this;
        this.options = {};
        if (options != null) {
            ["resourceType", "type", "publicId", "format"].forEach(function (key) {
                var ref;
                // @ts-ignore
                return _this.options[key] = (ref = options[key]) != null ? ref : options[backwards_utils_snakeCase.snakeCase(key)];
            });
        }
    }
    Layer.prototype.resourceType = function (value) {
        this.options.resourceType = value;
        return this;
    };
    Layer.prototype.type = function (value) {
        this.options.type = value;
        return this;
    };
    Layer.prototype.publicId = function (value) {
        this.options.publicId = value;
        return this;
    };
    /**
     * Get the public ID, formatted for layer parameter
     * @function Layer#getPublicId
     * @return {String} public ID
     */
    Layer.prototype.getPublicId = function () {
        var ref;
        return (ref = this.options.publicId) != null ? ref.replace(/\//g, ":") : void 0;
    };
    /**
     * Get the public ID, with format if present
     * @function Layer#getFullPublicId
     * @return {String} public ID
     */
    Layer.prototype.getFullPublicId = function () {
        if (this.options.format != null) {
            return this.getPublicId() + "." + this.options.format;
        }
        else {
            return this.getPublicId();
        }
    };
    Layer.prototype.format = function (value) {
        this.options.format = value;
        return this;
    };
    /**
     * generate the string representation of the layer
     * @function Layer#toString
     */
    Layer.prototype.toString = function () {
        var components = [];
        if (this.options.publicId == null) {
            throw "Must supply publicId";
        }
        if (!(this.options.resourceType === "image")) {
            components.push(this.options.resourceType);
        }
        if (!(this.options.type === "upload")) {
            components.push(this.options.type);
        }
        components.push(this.getFullPublicId());
        return components.filter(function (x) { return !!x; }).join(":");
    };
    Layer.prototype.clone = function () {
        return new Layer(this.options);
    };
    return Layer;
}());

module.exports = Layer;
