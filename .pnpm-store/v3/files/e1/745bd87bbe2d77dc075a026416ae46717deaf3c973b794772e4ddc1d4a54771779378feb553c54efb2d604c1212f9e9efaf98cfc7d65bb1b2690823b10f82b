'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var backwards_condition = require('./condition.cjs');
var backwards_configuration = require('./configuration.cjs');
var internal_utils_cloneDeep = require('../internal/utils/cloneDeep.cjs');
var backwards_utils_legacyBaseUtil = require('./utils/legacyBaseUtil.cjs');
var backwards_utils_snakeCase = require('./utils/snakeCase.cjs');
var backwards_expression = require('./expression.cjs');
var backwards_legacyLayer_layer = require('./legacyLayer/layer.cjs');
var backwards_legacyLayer_textlayer = require('./legacyLayer/textlayer.cjs');
var backwards_legacyLayer_subtitleslayer = require('./legacyLayer/subtitleslayer.cjs');
var backwards_legacyLayer_fetchlayer = require('./legacyLayer/fetchlayer.cjs');
var backwards_utils_isObject = require('./utils/isObject.cjs');
var internal_utils_dataStructureUtils = require('../internal/utils/dataStructureUtils.cjs');
var backwards_utils_isEmpty = require('./utils/isEmpty.cjs');
var backwards_utils_isFunction = require('./utils/isFunction.cjs');
require('./utils/smartEscape.cjs');
require('./utils/isNumberLike.cjs');
require('../internal/utils/base64Encode.cjs');

/**
 * A list of keys used by the url() function.
 * @private
 */
var URL_KEYS = [
    'accessibility',
    'api_secret',
    'auth_token',
    'cdn_subdomain',
    'cloud_name',
    'cname',
    'format',
    'placeholder',
    'private_cdn',
    'resource_type',
    'secure',
    'secure_cdn_subdomain',
    'secure_distribution',
    'shorten',
    'sign_url',
    'signature',
    'ssl_detected',
    'type',
    'url_suffix',
    'use_root_path',
    'version'
];
/**
 * Assign key, value to target, when value is not null.<br>
 *   This function mutates the target!
 * @param {object} target the object to assign the values to
 * @param {object} sources one or more objects to get values from
 * @returns {object} the target after the assignment
 */
function assignNotNull(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            // @ts-ignore
            if (source[key] != null) {
                // @ts-ignore
                target[key] = source[key];
            }
        });
    });
    return target;
}
/**
 * Return true if all items in list are strings
 * @function Util.allString
 * @param {Array} list - an array of items
 */
var allStrings = function (list) {
    return list.length && list.every(internal_utils_dataStructureUtils.isString);
};
/**
 * Transformation parameters
 * Depends on 'util', 'transformation'
 */
var Param = /** @class */ (function () {
    /**
     * Represents a single parameter.
     * @class Param
     * @param {string} name - The name of the parameter in snake_case
     * @param {string} shortName - The name of the serialized form of the parameter.
     *                         If a value is not provided, the parameter will not be serialized.
     * @param {function} [process=Util.identity ] - Manipulate origValue when value is called
     * @ignore
     */
    function Param(name, shortName, process) {
        if (process === void 0) { process = backwards_utils_legacyBaseUtil.identity; }
        /**
         * The name of the parameter in snake_case
         * @member {string} Param#name
         */
        this.name = name;
        /**
         * The name of the serialized form of the parameter
         * @member {string} Param#shortName
         */
        this.shortName = shortName;
        /**
         * Manipulate origValue when value is called
         * @member {function} Param#process
         */
        this.process = process;
    }
    /**
     * Set a (unprocessed) value for this parameter
     * @function Param#set
     * @param {*} origValue - the value of the parameter
     * @return {Param} self for chaining
     */
    Param.prototype.set = function (origValue) {
        this.origValue = origValue;
        return this;
    };
    /**
     * Generate the serialized form of the parameter
     * @function Param#serialize
     * @return {string} the serialized form of the parameter
     */
    Param.prototype.serialize = function () {
        var val, valid;
        val = this.value();
        valid = Array.isArray(val) || backwards_utils_isObject.isObject(val) || internal_utils_dataStructureUtils.isString(val) ? !backwards_utils_isEmpty.isEmpty(val) : val != null;
        if ((this.shortName != null) && valid) {
            return this.shortName + "_" + val;
        }
        else {
            return '';
        }
    };
    /**
     * Return the processed value of the parameter
     * @function Param#value
     */
    Param.prototype.value = function () {
        return this.process(this.origValue);
    };
    Param.norm_color = function (value) {
        return value != null ? value.replace(/^#/, 'rgb:') : void 0;
    };
    Param.build_array = function (arg) {
        if (arg == null) {
            return [];
        }
        else if (Array.isArray(arg)) {
            return arg;
        }
        else {
            return [arg];
        }
    };
    /**
     * Covert value to video codec string.
     *
     * If the parameter is an object,
     * @param {(string|Object)} param - the video codec as either a String or a Hash
     * @return {string} the video codec string in the format codec:profile:level
     * @example
     * vc_[ :profile : [level]]
     * or
     { codec: 'h264', profile: 'basic', level: '3.1' }
     * @ignore
     */
    Param.process_video_params = function (param) {
        var video;
        switch (param.constructor) {
            case Object:
                video = "";
                if ('codec' in param) {
                    video = param.codec;
                    if ('profile' in param) {
                        video += ":" + param.profile;
                        if ('level' in param) {
                            video += ":" + param.level;
                        }
                    }
                }
                return video;
            case String:
                return param;
            default:
                return null;
        }
    };
    return Param;
}());
var ArrayParam = /** @class */ (function (_super) {
    tslib_es6.__extends(ArrayParam, _super);
    /**
     * A parameter that represents an array.
     * @param {string} name - The name of the parameter in snake_case.
     * @param {string} shortName - The name of the serialized form of the parameter
     *                         If a value is not provided, the parameter will not be serialized.
     * @param {string} [sep='.'] - The separator to use when joining the array elements together
     * @param {function} [process=Util.identity ] - Manipulate origValue when value is called
     * @class ArrayParam
     * @extends Param
     * @ignore
     */
    function ArrayParam(name, shortName, sep, process) {
        if (sep === void 0) { sep = '.'; }
        if (process === void 0) { process = undefined; }
        var _this = _super.call(this, name, shortName, process) || this;
        _this.sep = sep;
        return _this;
    }
    ArrayParam.prototype.serialize = function () {
        if (this.shortName != null) {
            var arrayValue = this.value();
            if (backwards_utils_isEmpty.isEmpty(arrayValue)) {
                return '';
            }
            else if (internal_utils_dataStructureUtils.isString(arrayValue)) {
                return this.shortName + "_" + arrayValue;
            }
            else {
                var flat = arrayValue.map(function (t) { return backwards_utils_isFunction.isFunction(t.serialize) ? t.serialize() : t; }).join(this.sep);
                return this.shortName + "_" + flat;
            }
        }
        else {
            return '';
        }
    };
    ArrayParam.prototype.value = function () {
        var _this = this;
        if (Array.isArray(this.origValue)) {
            return this.origValue.map(function (v) { return _this.process(v); });
        }
        else {
            return this.process(this.origValue);
        }
    };
    ArrayParam.prototype.set = function (origValue) {
        if ((origValue == null) || Array.isArray(origValue)) {
            return _super.prototype.set.call(this, origValue);
        }
        else {
            return _super.prototype.set.call(this, [origValue]);
        }
    };
    return ArrayParam;
}(Param));
var TransformationParam = /** @class */ (function (_super) {
    tslib_es6.__extends(TransformationParam, _super);
    /**
     * A parameter that represents a transformation
     * @param {string} name - The name of the parameter in snake_case
     * @param {string} [shortName='t'] - The name of the serialized form of the parameter
     * @param {string} [sep='.'] - The separator to use when joining the array elements together
     * @param {function} [process=Util.identity ] - Manipulate origValue when value is called
     * @class TransformationParam
     * @extends Param
     * @ignore
     */
    function TransformationParam(name, shortName, sep, process) {
        if (shortName === void 0) { shortName = "t"; }
        if (sep === void 0) { sep = '.'; }
        if (process === void 0) { process = undefined; }
        var _this = _super.call(this, name, shortName, process) || this;
        _this.sep = sep;
        return _this;
    }
    /**
     * Generate string representations of the transformation.
     * @returns {*} Returns either the transformation as a string, or an array of string representations.
     */
    TransformationParam.prototype.serialize = function () {
        var _this = this;
        var result = '';
        var val = this.value();
        if (backwards_utils_isEmpty.isEmpty(val)) {
            return result;
        }
        // val is an array of strings so join them
        if (allStrings(val)) {
            var joined = val.join(this.sep); // creates t1.t2.t3 in case multiple named transformations were configured
            if (!backwards_utils_isEmpty.isEmpty(joined)) {
                // in case options.transformation was not set with an empty string (val != ['']);
                result = this.shortName + "_" + joined;
            }
        }
        else { // Convert val to an array of strings
            result = val.map(function (t) {
                if (internal_utils_dataStructureUtils.isString(t) && !backwards_utils_isEmpty.isEmpty(t)) {
                    return _this.shortName + "_" + t;
                }
                if (backwards_utils_isFunction.isFunction(t.serialize)) {
                    return t.serialize();
                }
                if (backwards_utils_isObject.isObject(t) && !backwards_utils_isEmpty.isEmpty(t)) {
                    return new Transformation(t).serialize();
                }
                return undefined;
            }).filter(function (t) { return t; });
        }
        return result;
    };
    TransformationParam.prototype.set = function (origValue1) {
        this.origValue = origValue1;
        if (Array.isArray(this.origValue)) {
            return _super.prototype.set.call(this, this.origValue);
        }
        else {
            return _super.prototype.set.call(this, [this.origValue]);
        }
    };
    return TransformationParam;
}(Param));
var number_pattern = "([0-9]*)\\.([0-9]+)|([0-9]+)";
var offset_any_pattern = "(" + number_pattern + ")([%pP])?";
var RangeParam = /** @class */ (function (_super) {
    tslib_es6.__extends(RangeParam, _super);
    /**
     * A parameter that represents a range
     * @param {string} name - The name of the parameter in snake_case
     * @param {string} shortName - The name of the serialized form of the parameter
     *                         If a value is not provided, the parameter will not be serialized.
     * @param {function} [process=norm_range_value ] - Manipulate origValue when value is called
     * @class RangeParam
     * @extends Param
     * @ignore
     */
    function RangeParam(name, shortName, process) {
        if (process === void 0) { process = RangeParam.norm_range_value; }
        return _super.call(this, name, shortName, process) || this;
    }
    RangeParam.norm_range_value = function (value) {
        var offset = String(value).match(new RegExp('^' + offset_any_pattern + '$'));
        if (offset) {
            var modifier = offset[5] != null ? 'p' : '';
            value = (offset[1] || offset[4]) + modifier;
        }
        return value;
    };
    return RangeParam;
}(Param));
var RawParam = /** @class */ (function (_super) {
    tslib_es6.__extends(RawParam, _super);
    function RawParam(name, shortName, process) {
        if (process === void 0) { process = backwards_utils_legacyBaseUtil.identity; }
        return _super.call(this, name, shortName, process) || this;
    }
    RawParam.prototype.serialize = function () {
        return this.value();
    };
    return RawParam;
}(Param));
var LayerParam = /** @class */ (function (_super) {
    tslib_es6.__extends(LayerParam, _super);
    function LayerParam() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Parse layer options
    // @return [string] layer transformation string
    // @private
    LayerParam.prototype.value = function () {
        if (this.origValue == null) {
            return '';
        }
        var result;
        if (this.origValue instanceof backwards_legacyLayer_layer) {
            result = this.origValue;
        }
        else if (backwards_utils_isObject.isObject(this.origValue)) {
            var layerOptions = backwards_utils_legacyBaseUtil.withCamelCaseKeys(this.origValue);
            // @ts-ignore
            if (layerOptions.resourceType === "text" || (layerOptions.text != null)) {
                result = new backwards_legacyLayer_textlayer(layerOptions);
            }
            else { // @ts-ignore
                if (layerOptions.resourceType === "subtitles") {
                    result = new backwards_legacyLayer_subtitleslayer(layerOptions);
                }
                else { // @ts-ignore
                    if (layerOptions.resourceType === "fetch" || (layerOptions.url != null)) {
                        result = new backwards_legacyLayer_fetchlayer(layerOptions);
                    }
                    else {
                        result = new backwards_legacyLayer_layer(layerOptions);
                    }
                }
            }
        }
        else if (internal_utils_dataStructureUtils.isString(this.origValue)) {
            if (/^fetch:.+/.test(this.origValue)) {
                result = new backwards_legacyLayer_fetchlayer(this.origValue.substr(6));
            }
            else {
                result = this.origValue;
            }
        }
        else {
            result = '';
        }
        return result.toString();
    };
    LayerParam.textStyle = function (layer) {
        return (new backwards_legacyLayer_textlayer(layer)).textStyleIdentifier();
    };
    return LayerParam;
}(Param));
/**
 * TransformationBase
 * Depends on 'configuration', 'parameters','util'
 * @internal
 */
var TransformationBase = /** @class */ (function () {
    /**
     * The base class for transformations.
     * Members of this class are documented as belonging to the {@link Transformation} class for convenience.
     * @class TransformationBase
     */
    function TransformationBase(options) {
        var _this = this;
        /** @private */
        /** @private */
        var parent;
        var trans;
        parent = void 0;
        trans = {};
        /**
         * Return an options object that can be used to create an identical Transformation
         * @function Transformation#toOptions
         * @return {Object} Returns a plain object representing this transformation
         */
        this.toOptions = function (withChain) {
            var opt = {};
            if (withChain == null) {
                withChain = true;
            }
            // @ts-ignore
            Object.keys(trans).forEach(function (key) { return opt[key] = trans[key].origValue; });
            assignNotNull(opt, _this.otherOptions);
            if (withChain && !backwards_utils_isEmpty.isEmpty(_this.chained)) {
                var list = _this.chained.map(function (tr) { return tr.toOptions(); });
                list.push(opt);
                opt = {};
                assignNotNull(opt, _this.otherOptions);
                // @ts-ignore
                opt.transformation = list;
            }
            return opt;
        };
        /**
         * Set a parent for this object for chaining purposes.
         *
         * @function Transformation#setParent
         * @param {Object} object - the parent to be assigned to
         * @returns {Transformation} Returns this instance for chaining purposes.
         */
        this.setParent = function (object) {
            parent = object;
            if (object != null) {
                // @ts-ignore
                _this.fromOptions(typeof object.toOptions === "function" ? object.toOptions() : void 0);
            }
            return _this;
        };
        /**
         * Returns the parent of this object in the chain
         * @function Transformation#getParent
         * @protected
         * @return {Object} Returns the parent of this object if there is any
         */
        this.getParent = function () {
            return parent;
        };
        // Helper methods to create parameter methods
        // These methods are defined here because they access `trans` which is
        // a private member of `TransformationBase`
        /** @protected */
        this.param = function (value, name, abbr, defaultValue, process) {
            if (process == null) {
                if (backwards_utils_isFunction.isFunction(defaultValue)) {
                    process = defaultValue;
                }
                else {
                    process = backwards_utils_legacyBaseUtil.identity;
                }
            }
            // @ts-ignore
            trans[name] = new Param(name, abbr, process).set(value);
            return _this;
        };
        /** @protected */
        this.rawParam = function (value, name, abbr, defaultValue, process) {
            process = lastArgCallback(arguments);
            // @ts-ignore
            trans[name] = new RawParam(name, abbr, process).set(value);
            return this;
        };
        /** @protected */
        this.rangeParam = function (value, name, abbr, defaultValue, process) {
            process = lastArgCallback(arguments);
            // @ts-ignore
            trans[name] = new RangeParam(name, abbr, process).set(value);
            return this;
        };
        /** @protected */
        this.arrayParam = function (value, name, abbr, sep, defaultValue, process) {
            if (sep === void 0) { sep = ":"; }
            if (defaultValue === void 0) { defaultValue = []; }
            if (process === void 0) { process = undefined; }
            process = lastArgCallback(arguments);
            // @ts-ignore
            trans[name] = new ArrayParam(name, abbr, sep, process).set(value);
            return this;
        };
        /** @protected */
        this.transformationParam = function (value, name, abbr, sep, defaultValue, process) {
            if (sep === void 0) { sep = "."; }
            if (defaultValue === void 0) { defaultValue = undefined; }
            if (process === void 0) { process = undefined; }
            process = lastArgCallback(arguments);
            // @ts-ignore
            trans[name] = new TransformationParam(name, abbr, sep, process).set(value);
            return this;
        };
        this.layerParam = function (value, name, abbr) {
            // @ts-ignore
            trans[name] = new LayerParam(name, abbr).set(value);
            return this;
        };
        // End Helper methods
        /**
         * Get the value associated with the given name.
         * Get the value associated with the given name.
         * @function Transformation#getValue
         * @param {string} name - the name of the parameter
         * @return {*} the processed value associated with the given name
         * @description Use {@link get}.origValue for the value originally provided for the parameter
         */
        this.getValue = function (name) {
            // @ts-ignore
            var value = trans[name] && trans[name].value();
            return value != null ? value : this.otherOptions[name];
        };
        /**
         * Get the parameter object for the given parameter name
         * @function Transformation#get
         * @param {string} name the name of the transformation parameter
         * @returns {Param} the param object for the given name, or undefined
         */
        this.get = function (name) {
            // @ts-ignore
            return trans[name];
        };
        /**
         * Remove a transformation option from the transformation.
         * @function Transformation#remove
         * @param {string} name - the name of the option to remove
         * @return {*} Returns the option that was removed or null if no option by that name was found. The type of the
         *              returned value depends on the value.
         */
        this.remove = function (name) {
            var temp;
            switch (false) {
                // @ts-ignore
                case trans[name] == null:
                    // @ts-ignore
                    temp = trans[name];
                    // @ts-ignore
                    delete trans[name];
                    return temp.origValue;
                case this.otherOptions[name] == null:
                    temp = this.otherOptions[name];
                    delete this.otherOptions[name];
                    return temp;
                default:
                    return null;
            }
        };
        /**
         * Return an array of all the keys (option names) in the transformation.
         * @return {Array<string>} the keys in snakeCase format
         */
        this.keys = function () {
            var key;
            return ((function () {
                var results;
                results = [];
                for (key in trans) {
                    if (key != null) {
                        results.push(key.match(VAR_NAME_RE) ? key : backwards_utils_snakeCase.snakeCase(key));
                    }
                }
                return results;
            })()).sort();
        };
        /**
         * Returns a plain object representation of the transformation. Values are processed.
         * @function Transformation#toPlainObject
         * @return {Object} the transformation options as plain object
         */
        this.toPlainObject = function () {
            var hash, key, list;
            hash = {};
            for (key in trans) {
                // @ts-ignore
                hash[key] = trans[key].value();
                // @ts-ignore
                if (backwards_utils_isObject.isObject(hash[key])) {
                    // @ts-ignore
                    hash[key] = internal_utils_cloneDeep.cloneDeep(hash[key]);
                }
            }
            if (!backwards_utils_isEmpty.isEmpty(this.chained)) {
                list = this.chained.map(function (tr) { return tr.toPlainObject(); });
                list.push(hash);
                hash = {
                    transformation: list
                };
            }
            return hash;
        };
        /**
         * Complete the current transformation and chain to a new one.
         * In the URL, transformations are chained together by slashes.
         * @function Transformation#chain
         * @return {Transformation} Returns this transformation for chaining
         * @example
         * var tr = cloudinary.Transformation.new();
         * tr.width(10).crop('fit').chain().angle(15).serialize()
         * // produces "c_fit,w_10/a_15"
         */
        this.chain = function () {
            var names, tr;
            names = Object.getOwnPropertyNames(trans);
            if (names.length !== 0) {
                tr = new this.constructor(this.toOptions(false));
                this.resetTransformations();
                this.chained.push(tr);
            }
            return this;
        };
        this.resetTransformations = function () {
            trans = {};
            return this;
        };
        this.otherOptions = {};
        this.chained = [];
        this.fromOptions(options);
    }
    /**
     * Merge the provided options with own's options
     * @param {Object} [options={}] key-value list of options
     * @returns {Transformation} Returns this instance for chaining
     */
    TransformationBase.prototype.fromOptions = function (options) {
        if (options === void 0) { options = {}; }
        if (options instanceof TransformationBase) {
            this.fromTransformation(options);
        }
        else {
            if (internal_utils_dataStructureUtils.isString(options) || Array.isArray(options)) {
                options = {
                    transformation: options
                };
            }
            options = internal_utils_cloneDeep.cloneDeep(options);
            // Handling of "if" statements precedes other options as it creates a chained transformation
            // @ts-ignore
            if (options["if"]) {
                // @ts-ignore
                this.set("if", options["if"]);
                // @ts-ignore
                delete options["if"];
            }
            for (var key in options) {
                // @ts-ignore
                var opt = options[key];
                if (opt != null) {
                    if (key.match(VAR_NAME_RE)) {
                        if (key !== '$attr') {
                            this.set('variable', key, opt);
                        }
                    }
                    else {
                        this.set(key, opt);
                    }
                }
            }
        }
        return this;
    };
    TransformationBase.prototype.fromTransformation = function (other) {
        var _this = this;
        if (other instanceof TransformationBase) {
            other.keys().forEach(function (key) {
                return _this.set(key, other.get(key).origValue);
            });
        }
        return this;
    };
    /**
     * Set a parameter.
     * The parameter name `key` is converted to
     * @param {string} key - the name of the parameter
     * @param {*} values - the value of the parameter
     * @returns {Transformation} Returns this instance for chaining
     */
    TransformationBase.prototype.set = function (key) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var camelKey;
        camelKey = backwards_utils_legacyBaseUtil.camelCase(key);
        if (backwards_utils_legacyBaseUtil.contains(methods, camelKey)) {
            // @ts-ignore
            this[camelKey].apply(this, values);
        }
        else {
            this.otherOptions[key] = values[0];
        }
        return this;
    };
    TransformationBase.prototype.hasLayer = function () {
        return this.getValue("overlay") || this.getValue("underlay");
    };
    /**
     * Generate a string representation of the transformation.
     * @function Transformation#serialize
     * @return {string} Returns the transformation as a string
     */
    TransformationBase.prototype.serialize = function () {
        var ifParam, j, len, paramList, ref, ref1, ref2, ref3, ref4, resultArray, t, transformationList, transformationString, transformations, value, variables, vars;
        resultArray = this.chained.map(function (tr) { return tr.serialize(); });
        paramList = this.keys();
        transformations = (ref = this.get("transformation")) != null ? ref.serialize() : void 0;
        ifParam = (ref1 = this.get("if")) != null ? ref1.serialize() : void 0;
        variables = processVar((ref2 = this.get("variables")) != null ? ref2.value() : void 0);
        paramList = backwards_utils_legacyBaseUtil.difference(paramList, ["transformation", "if", "variables"]);
        vars = [];
        transformationList = [];
        for (j = 0, len = paramList.length; j < len; j++) {
            t = paramList[j];
            if (t.match(VAR_NAME_RE)) {
                vars.push(t + "_" + backwards_expression.normalize((ref3 = this.get(t)) != null ? ref3.value() : void 0));
            }
            else {
                transformationList.push((ref4 = this.get(t)) != null ? ref4.serialize() : void 0);
            }
        }
        switch (false) {
            case !internal_utils_dataStructureUtils.isString(transformations):
                transformationList.push(transformations);
                break;
            case !Array.isArray(transformations):
                resultArray = resultArray.concat(transformations);
        }
        transformationList = (function () {
            var k, len1, results;
            results = [];
            for (k = 0, len1 = transformationList.length; k < len1; k++) {
                value = transformationList[k];
                if (Array.isArray(value) && !backwards_utils_isEmpty.isEmpty(value) || !Array.isArray(value) && value) {
                    results.push(value);
                }
            }
            return results;
        })();
        transformationList = vars.sort().concat(variables).concat(transformationList.sort());
        if (ifParam === "if_end") {
            transformationList.push(ifParam);
        }
        else if (!backwards_utils_isEmpty.isEmpty(ifParam)) {
            transformationList.unshift(ifParam);
        }
        transformationString = (transformationList).filter(function (x) { return !!x; }).join(param_separator);
        if (!backwards_utils_isEmpty.isEmpty(transformationString)) {
            resultArray.push(transformationString);
        }
        return (resultArray).filter(function (x) { return !!x; }).join(trans_separator);
    };
    /**
     * Provide a list of all the valid transformation option names
     * @function Transformation#listNames
     * @private
     * @return {Array<string>} a array of all the valid option names
     */
    TransformationBase.listNames = function () {
        return methods;
    };
    /**
     * Returns the attributes for an HTML tag.
     * @function Cloudinary.toHtmlAttributes
     * @return PlainObject
     */
    TransformationBase.prototype.toHtmlAttributes = function () {
        var _this = this;
        var attrName, height, options, ref2, ref3, value, width;
        options = {};
        var snakeCaseKey;
        Object.keys(this.otherOptions).forEach(function (key) {
            value = _this.otherOptions[key];
            snakeCaseKey = backwards_utils_snakeCase.snakeCase(key);
            if (!backwards_utils_legacyBaseUtil.contains(PARAM_NAMES, snakeCaseKey) && !backwards_utils_legacyBaseUtil.contains(URL_KEYS, snakeCaseKey)) {
                attrName = /^html_/.test(key) ? key.slice(5) : key;
                options[attrName] = value;
            }
        });
        // convert all "html_key" to "key" with the same value
        this.keys().forEach(function (key) {
            if (/^html_/.test(key)) {
                options[backwards_utils_legacyBaseUtil.camelCase(key.slice(5))] = _this.getValue(key);
            }
        });
        if (!(this.hasLayer() || this.getValue("angle") || backwards_utils_legacyBaseUtil.contains(["fit", "limit", "lfill"], this.getValue("crop")))) {
            width = (ref2 = this.get("width")) != null ? ref2.origValue : void 0;
            height = (ref3 = this.get("height")) != null ? ref3.origValue : void 0;
            if (parseFloat(width) >= 1.0) {
                if (options.width == null) {
                    options.width = width;
                }
            }
            if (parseFloat(height) >= 1.0) {
                if (options.height == null) {
                    options.height = height;
                }
            }
        }
        return options;
    };
    TransformationBase.isValidParamName = function (name) {
        return methods.indexOf(backwards_utils_legacyBaseUtil.camelCase(name)) >= 0;
    };
    /**
     * Delegate to the parent (up the call chain) to produce HTML
     * @function Transformation#toHtml
     * @return {string} HTML representation of the parent if possible.
     * @example
     * tag = cloudinary.ImageTag.new("sample", {cloud_name: "demo"})
     * // ImageTag {name: "img", publicId: "sample"}
     * tag.toHtml()
     * // <img src="http://res.cloudinary.com/demo/image/upload/sample">
     * tag.transformation().crop("fit").width(300).toHtml()
     * // <img src="http://res.cloudinary.com/demo/image/upload/c_fit,w_300/sample">
     */
    TransformationBase.prototype.toHtml = function () {
        var ref;
        return (ref = this.getParent()) != null ? typeof ref.toHtml === "function" ? ref.toHtml() : void 0 : void 0;
    };
    TransformationBase.prototype.toString = function () {
        return this.serialize();
    };
    TransformationBase.prototype.clone = function () {
        return new TransformationBase(this.toOptions(true));
    };
    return TransformationBase;
}());
var VAR_NAME_RE = /^\$[a-zA-Z0-9]+$/;
var trans_separator = '/';
var param_separator = ',';
function lastArgCallback(args) {
    var callback;
    callback = args != null ? args[args.length - 1] : void 0;
    if (backwards_utils_isFunction.isFunction(callback)) {
        return callback;
    }
    else {
        return void 0;
    }
}
function processVar(varArray) {
    var _a;
    var j, len, name, results, v;
    if (Array.isArray(varArray)) {
        results = [];
        for (j = 0, len = varArray.length; j < len; j++) {
            _a = varArray[j], name = _a[0], v = _a[1];
            results.push(name + "_" + backwards_expression.normalize(v));
        }
        return results;
    }
    else {
        return varArray;
    }
}
// @ts-ignore
function processCustomFunction(_a) {
    var function_type = _a.function_type, source = _a.source;
    if (function_type === 'remote') {
        return [function_type, btoa(source)].join(":");
    }
    else if (function_type === 'wasm') {
        return [function_type, source].join(":");
    }
}
/**
 * Transformation Class methods.
 * This is a list of the parameters defined in Transformation.
 * Values are camelCased.
 * @const Transformation.methods
 * @private
 * @ignore
 * @type {Array<string>}
 */
/**
 * Parameters that are filtered out before passing the options to an HTML tag.
 *
 * The list of parameters is a combination of `Transformation::methods` and `Configuration::CONFIG_PARAMS`
 * @const {Array<string>} Transformation.PARAM_NAMES
 * @private
 * @ignore
 * @see toHtmlAttributes
 */
var Transformation = /** @class */ (function (_super) {
    tslib_es6.__extends(Transformation, _super);
    /**
     * Represents a single transformation.
     * @class Transformation
     * @example
     * t = new cloudinary.Transformation();
     * t.angle(20).crop("scale").width("auto");
     *
     * // or
     *
     * t = new cloudinary.Transformation( {angle: 20, crop: "scale", width: "auto"});
     * @see <a href="https://cloudinary.com/documentation/image_transformation_reference"
     *  target="_blank">Available image transformations</a>
     * @see <a href="https://cloudinary.com/documentation/video_transformation_reference"
     *  target="_blank">Available video transformations</a>
     */
    function Transformation(options) {
        return _super.call(this, options) || this;
    }
    /**
     * Convenience constructor
     * @param {Object} options
     * @return {Transformation}
     * @example cl = cloudinary.Transformation.new( {angle: 20, crop: "scale", width: "auto"})
     */
    Transformation.new = function (options) {
        return new Transformation(options);
    };
    /*
      Transformation Parameters
    */
    Transformation.prototype.angle = function (value) {
        this.arrayParam(value, "angle", "a", ".", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.audioCodec = function (value) {
        this.param(value, "audio_codec", "ac");
        return this;
    };
    Transformation.prototype.audioFrequency = function (value) {
        this.param(value, "audio_frequency", "af");
        return this;
    };
    Transformation.prototype.aspectRatio = function (value) {
        this.param(value, "aspect_ratio", "ar", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.background = function (value) {
        this.param(value, "background", "b", Param.norm_color);
        return this;
    };
    Transformation.prototype.bitRate = function (value) {
        this.param(value, "bit_rate", "br");
        return this;
    };
    Transformation.prototype.border = function (value) {
        return this.param(value, "border", "bo", function (border) {
            if (backwards_utils_isObject.isObject(border)) {
                border = Object.assign({}, {
                    color: "black",
                    width: 2
                }, border);
                return border.width + "px_solid_" + Param.norm_color(border.color);
            }
            else {
                return border;
            }
        });
    };
    Transformation.prototype.color = function (value) {
        this.param(value, "color", "co", Param.norm_color);
        return this;
    };
    Transformation.prototype.colorSpace = function (value) {
        this.param(value, "color_space", "cs");
        return this;
    };
    Transformation.prototype.crop = function (value) {
        this.param(value, "crop", "c");
        return this;
    };
    Transformation.prototype.customFunction = function (value) {
        return this.param(value, "custom_function", "fn", function () {
            return processCustomFunction(value);
        });
    };
    Transformation.prototype.customPreFunction = function (value) {
        if (this.get('custom_function')) {
            return;
        }
        return this.rawParam(value, "custom_function", "", function () {
            value = processCustomFunction(value);
            return value ? "fn_pre:" + value : value;
        });
    };
    Transformation.prototype.defaultImage = function (value) {
        this.param(value, "default_image", "d");
        return this;
    };
    Transformation.prototype.delay = function (value) {
        this.param(value, "delay", "dl");
        return this;
    };
    Transformation.prototype.density = function (value) {
        this.param(value, "density", "dn");
        return this;
    };
    Transformation.prototype.duration = function (value) {
        this.rangeParam(value, "duration", "du");
        return this;
    };
    Transformation.prototype.dpr = function (value) {
        return this.param(value, "dpr", "dpr", function (dpr) {
            dpr = dpr.toString();
            if (dpr != null ? dpr.match(/^\d+$/) : void 0) {
                return dpr + ".0";
            }
            else {
                return backwards_expression.normalize(dpr);
            }
        });
    };
    Transformation.prototype.effect = function (value) {
        this.arrayParam(value, "effect", "e", ":", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.else = function () {
        return this.if('else');
    };
    Transformation.prototype.endIf = function () {
        return this.if('end');
    };
    Transformation.prototype.endOffset = function (value) {
        this.rangeParam(value, "end_offset", "eo");
        return this;
    };
    Transformation.prototype.fallbackContent = function (value) {
        this.param(value, "fallback_content");
        return this;
    };
    Transformation.prototype.fetchFormat = function (value) {
        this.param(value, "fetch_format", "f");
        return this;
    };
    Transformation.prototype.format = function (value) {
        this.param(value, "format");
        return this;
    };
    Transformation.prototype.flags = function (value) {
        this.arrayParam(value, "flags", "fl", ".");
        return this;
    };
    Transformation.prototype.gravity = function (value) {
        this.param(value, "gravity", "g");
        return this;
    };
    Transformation.prototype.fps = function (value) {
        return this.param(value, "fps", "fps", function (fps) {
            if (internal_utils_dataStructureUtils.isString(fps)) {
                return fps;
            }
            else if (Array.isArray(fps)) {
                return fps.join("-");
            }
            else {
                return fps;
            }
        });
    };
    Transformation.prototype.height = function (value) {
        var _this = this;
        return this.param(value, "height", "h", function () {
            if (_this.getValue("crop") || _this.getValue("overlay") || _this.getValue("underlay")) {
                return backwards_expression.normalize(value);
            }
            else {
                return null;
            }
        });
    };
    Transformation.prototype.htmlHeight = function (value) {
        this.param(value, "html_height");
        return this;
    };
    Transformation.prototype.htmlWidth = function (value) {
        this.param(value, "html_width");
        return this;
    };
    Transformation.prototype.if = function (value) {
        if (value === void 0) { value = ""; }
        var i, ifVal, j, trIf, trRest;
        switch (value) {
            case "else":
                this.chain();
                return this.param(value, "if", "if");
            case "end":
                this.chain();
                for (i = j = this.chained.length - 1; j >= 0; i = j += -1) {
                    ifVal = this.chained[i].getValue("if");
                    if (ifVal === "end") {
                        break;
                    }
                    else if (ifVal != null) {
                        trIf = Transformation.new().if(ifVal);
                        this.chained[i].remove("if");
                        trRest = this.chained[i];
                        this.chained[i] = Transformation.new().transformation([trIf, trRest]);
                        if (ifVal !== "else") {
                            break;
                        }
                    }
                }
                return this.param(value, "if", "if");
            case "":
                return backwards_condition.new().setParent(this);
            default:
                return this.param(value, "if", "if", function (value) {
                    return backwards_condition.new(value).toString();
                });
        }
    };
    Transformation.prototype.keyframeInterval = function (value) {
        this.param(value, "keyframe_interval", "ki");
        return this;
    };
    Transformation.prototype.ocr = function (value) {
        this.param(value, "ocr", "ocr");
        return this;
    };
    Transformation.prototype.offset = function (value) {
        var _a;
        var end_o, start_o;
        _a = (backwards_utils_isFunction.isFunction(value != null ? value.split : void 0)) ? value.split('..') : Array.isArray(value) ? value : [null, null], start_o = _a[0], end_o = _a[1];
        if (start_o != null) {
            this.startOffset(start_o);
        }
        if (end_o != null) {
            return this.endOffset(end_o);
        }
    };
    Transformation.prototype.opacity = function (value) {
        this.param(value, "opacity", "o", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.overlay = function (value) {
        this.layerParam(value, "overlay", "l");
        return this;
    };
    Transformation.prototype.page = function (value) {
        this.param(value, "page", "pg");
        return this;
    };
    Transformation.prototype.poster = function (value) {
        this.param(value, "poster");
        return this;
    };
    Transformation.prototype.prefix = function (value) {
        this.param(value, "prefix", "p");
        return this;
    };
    Transformation.prototype.quality = function (value) {
        this.param(value, "quality", "q", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.radius = function (value) {
        this.arrayParam(value, "radius", "r", ":", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.rawTransformation = function (value) {
        this.rawParam(value, "raw_transformation");
        return this;
    };
    Transformation.prototype.size = function (value) {
        var _a;
        var height, width;
        if (backwards_utils_isFunction.isFunction(value != null ? value.split : void 0)) {
            _a = value.split('x'), width = _a[0], height = _a[1];
            this.width(width);
            return this.height(height);
        }
    };
    Transformation.prototype.sourceTypes = function (value) {
        this.param(value, "source_types");
        return this;
    };
    Transformation.prototype.sourceTransformation = function (value) {
        return this.param(value, "source_transformation");
    };
    Transformation.prototype.startOffset = function (value) {
        this.rangeParam(value, "start_offset", "so");
        return this;
    };
    Transformation.prototype.streamingProfile = function (value) {
        this.param(value, "streaming_profile", "sp");
        return this;
    };
    Transformation.prototype.transformation = function (value) {
        this.transformationParam(value, "transformation", "t");
        return this;
    };
    Transformation.prototype.underlay = function (value) {
        this.layerParam(value, "underlay", "u");
        return this;
    };
    Transformation.prototype.variable = function (name, value) {
        this.param(value, name, name);
        return this;
    };
    Transformation.prototype.variables = function (values) {
        this.arrayParam(values, "variables");
        return this;
    };
    Transformation.prototype.videoCodec = function (value) {
        this.param(value, "video_codec", "vc", Param.process_video_params);
        return this;
    };
    Transformation.prototype.videoSampling = function (value) {
        this.param(value, "video_sampling", "vs");
        return this;
    };
    Transformation.prototype.width = function (value) {
        var _this = this;
        this.param(value, "width", "w", function () {
            if (_this.getValue("crop") || _this.getValue("overlay") || _this.getValue("underlay")) {
                return backwards_expression.normalize(value);
            }
            else {
                return null;
            }
        });
        return this;
    };
    Transformation.prototype.x = function (value) {
        this.param(value, "x", "x", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.y = function (value) {
        this.param(value, "y", "y", backwards_expression.normalize);
        return this;
    };
    Transformation.prototype.zoom = function (value) {
        this.param(value, "zoom", "z", backwards_expression.normalize);
        return this;
    };
    return Transformation;
}(TransformationBase));
/**
 * Transformation Class methods.
 * This is a list of the parameters defined in Transformation.
 * Values are camelCased.
 */
var methods = [
    "angle",
    "audioCodec",
    "audioFrequency",
    "aspectRatio",
    "background",
    "bitRate",
    "border",
    "color",
    "colorSpace",
    "crop",
    "customFunction",
    "customPreFunction",
    "defaultImage",
    "delay",
    "density",
    "duration",
    "dpr",
    "effect",
    "else",
    "endIf",
    "endOffset",
    "fallbackContent",
    "fetchFormat",
    "format",
    "flags",
    "gravity",
    "fps",
    "height",
    "htmlHeight",
    "htmlWidth",
    "if",
    "keyframeInterval",
    "ocr",
    "offset",
    "opacity",
    "overlay",
    "page",
    "poster",
    "prefix",
    "quality",
    "radius",
    "rawTransformation",
    "size",
    "sourceTypes",
    "sourceTransformation",
    "startOffset",
    "streamingProfile",
    "transformation",
    "underlay",
    "variable",
    "variables",
    "videoCodec",
    "videoSampling",
    "width",
    "x",
    "y",
    "zoom"
];
/**
 * Parameters that are filtered out before passing the options to an HTML tag.
 *
 * The list of parameters is a combination of `Transformation::methods` and `Configuration::CONFIG_PARAMS`
 */
var PARAM_NAMES = methods.map(backwards_utils_snakeCase.snakeCase).concat(backwards_configuration.CONFIG_PARAMS);

exports.URL_KEYS = URL_KEYS;
exports["default"] = Transformation;
