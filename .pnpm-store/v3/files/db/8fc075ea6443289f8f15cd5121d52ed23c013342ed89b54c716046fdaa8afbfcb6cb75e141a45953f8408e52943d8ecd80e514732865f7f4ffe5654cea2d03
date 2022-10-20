import Condition from './condition.js';
import { CONFIG_PARAMS } from './configuration.js';
import { cloneDeep } from '../internal/utils/cloneDeep.js';
import { camelCase, contains, difference, } from "./utils/legacyBaseUtil.js";
import { snakeCase } from "./utils/snakeCase.js";
import Expression from './expression.js';
import Layer from './legacyLayer/layer.js';
import TextLayer from './legacyLayer/textlayer.js';
import SubtitlesLayer from './legacyLayer/subtitleslayer.js';
import FetchLayer from './legacyLayer/fetchlayer.js';
import { isObject } from "./utils/isObject.js";
import { isString } from "../internal/utils/dataStructureUtils.js";
import { isEmpty } from "./utils/isEmpty.js";
import { isFunction } from "./utils/isFunction.js";
import { identity, withCamelCaseKeys } from "./utils/legacyBaseUtil.js";
/**
 * A list of keys used by the url() function.
 * @private
 */
export const URL_KEYS = [
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
function assignNotNull(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
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
const allStrings = function (list) {
    return list.length && list.every(isString);
};
/**
 * Transformation parameters
 * Depends on 'util', 'transformation'
 */
class Param {
    /**
     * Represents a single parameter.
     * @class Param
     * @param {string} name - The name of the parameter in snake_case
     * @param {string} shortName - The name of the serialized form of the parameter.
     *                         If a value is not provided, the parameter will not be serialized.
     * @param {function} [process=Util.identity ] - Manipulate origValue when value is called
     * @ignore
     */
    constructor(name, shortName, process = identity) {
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
    set(origValue) {
        this.origValue = origValue;
        return this;
    }
    /**
     * Generate the serialized form of the parameter
     * @function Param#serialize
     * @return {string} the serialized form of the parameter
     */
    serialize() {
        var val, valid;
        val = this.value();
        valid = Array.isArray(val) || isObject(val) || isString(val) ? !isEmpty(val) : val != null;
        if ((this.shortName != null) && valid) {
            return `${this.shortName}_${val}`;
        }
        else {
            return '';
        }
    }
    /**
     * Return the processed value of the parameter
     * @function Param#value
     */
    value() {
        return this.process(this.origValue);
    }
    static norm_color(value) {
        return value != null ? value.replace(/^#/, 'rgb:') : void 0;
    }
    static build_array(arg) {
        if (arg == null) {
            return [];
        }
        else if (Array.isArray(arg)) {
            return arg;
        }
        else {
            return [arg];
        }
    }
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
    static process_video_params(param) {
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
    }
}
class ArrayParam extends Param {
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
    constructor(name, shortName, sep = '.', process = undefined) {
        super(name, shortName, process);
        this.sep = sep;
    }
    serialize() {
        if (this.shortName != null) {
            let arrayValue = this.value();
            if (isEmpty(arrayValue)) {
                return '';
            }
            else if (isString(arrayValue)) {
                return `${this.shortName}_${arrayValue}`;
            }
            else {
                let flat = arrayValue.map((t) => isFunction(t.serialize) ? t.serialize() : t).join(this.sep);
                return `${this.shortName}_${flat}`;
            }
        }
        else {
            return '';
        }
    }
    value() {
        if (Array.isArray(this.origValue)) {
            return this.origValue.map(v => this.process(v));
        }
        else {
            return this.process(this.origValue);
        }
    }
    set(origValue) {
        if ((origValue == null) || Array.isArray(origValue)) {
            return super.set(origValue);
        }
        else {
            return super.set([origValue]);
        }
    }
}
class TransformationParam extends Param {
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
    constructor(name, shortName = "t", sep = '.', process = undefined) {
        super(name, shortName, process);
        this.sep = sep;
    }
    /**
     * Generate string representations of the transformation.
     * @returns {*} Returns either the transformation as a string, or an array of string representations.
     */
    serialize() {
        let result = '';
        const val = this.value();
        if (isEmpty(val)) {
            return result;
        }
        // val is an array of strings so join them
        if (allStrings(val)) {
            const joined = val.join(this.sep); // creates t1.t2.t3 in case multiple named transformations were configured
            if (!isEmpty(joined)) {
                // in case options.transformation was not set with an empty string (val != ['']);
                result = `${this.shortName}_${joined}`;
            }
        }
        else { // Convert val to an array of strings
            result = val.map((t) => {
                if (isString(t) && !isEmpty(t)) {
                    return `${this.shortName}_${t}`;
                }
                if (isFunction(t.serialize)) {
                    return t.serialize();
                }
                if (isObject(t) && !isEmpty(t)) {
                    return new Transformation(t).serialize();
                }
                return undefined;
            }).filter((t) => t);
        }
        return result;
    }
    set(origValue1) {
        this.origValue = origValue1;
        if (Array.isArray(this.origValue)) {
            return super.set(this.origValue);
        }
        else {
            return super.set([this.origValue]);
        }
    }
}
const number_pattern = "([0-9]*)\\.([0-9]+)|([0-9]+)";
const offset_any_pattern = "(" + number_pattern + ")([%pP])?";
class RangeParam extends Param {
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
    constructor(name, shortName, process = RangeParam.norm_range_value) {
        super(name, shortName, process);
    }
    static norm_range_value(value) {
        let offset = String(value).match(new RegExp('^' + offset_any_pattern + '$'));
        if (offset) {
            let modifier = offset[5] != null ? 'p' : '';
            value = (offset[1] || offset[4]) + modifier;
        }
        return value;
    }
}
class RawParam extends Param {
    constructor(name, shortName, process = identity) {
        super(name, shortName, process);
    }
    serialize() {
        return this.value();
    }
}
class LayerParam extends Param {
    // Parse layer options
    // @return [string] layer transformation string
    // @private
    value() {
        if (this.origValue == null) {
            return '';
        }
        let result;
        if (this.origValue instanceof Layer) {
            result = this.origValue;
        }
        else if (isObject(this.origValue)) {
            let layerOptions = withCamelCaseKeys(this.origValue);
            // @ts-ignore
            if (layerOptions.resourceType === "text" || (layerOptions.text != null)) {
                result = new TextLayer(layerOptions);
            }
            else { // @ts-ignore
                if (layerOptions.resourceType === "subtitles") {
                    result = new SubtitlesLayer(layerOptions);
                }
                else { // @ts-ignore
                    if (layerOptions.resourceType === "fetch" || (layerOptions.url != null)) {
                        result = new FetchLayer(layerOptions);
                    }
                    else {
                        result = new Layer(layerOptions);
                    }
                }
            }
        }
        else if (isString(this.origValue)) {
            if (/^fetch:.+/.test(this.origValue)) {
                result = new FetchLayer(this.origValue.substr(6));
            }
            else {
                result = this.origValue;
            }
        }
        else {
            result = '';
        }
        return result.toString();
    }
    static textStyle(layer) {
        return (new TextLayer(layer)).textStyleIdentifier();
    }
}
/**
 * TransformationBase
 * Depends on 'configuration', 'parameters','util'
 * @internal
 */
class TransformationBase {
    /**
     * The base class for transformations.
     * Members of this class are documented as belonging to the {@link Transformation} class for convenience.
     * @class TransformationBase
     */
    constructor(options) {
        /** @private */
        /** @private */
        let parent;
        let trans;
        parent = void 0;
        trans = {};
        /**
         * Return an options object that can be used to create an identical Transformation
         * @function Transformation#toOptions
         * @return {Object} Returns a plain object representing this transformation
         */
        this.toOptions = (withChain) => {
            let opt = {};
            if (withChain == null) {
                withChain = true;
            }
            // @ts-ignore
            Object.keys(trans).forEach(key => opt[key] = trans[key].origValue);
            assignNotNull(opt, this.otherOptions);
            if (withChain && !isEmpty(this.chained)) {
                let list = this.chained.map((tr) => tr.toOptions());
                list.push(opt);
                opt = {};
                assignNotNull(opt, this.otherOptions);
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
        this.setParent = (object) => {
            parent = object;
            if (object != null) {
                // @ts-ignore
                this.fromOptions(typeof object.toOptions === "function" ? object.toOptions() : void 0);
            }
            return this;
        };
        /**
         * Returns the parent of this object in the chain
         * @function Transformation#getParent
         * @protected
         * @return {Object} Returns the parent of this object if there is any
         */
        this.getParent = () => {
            return parent;
        };
        // Helper methods to create parameter methods
        // These methods are defined here because they access `trans` which is
        // a private member of `TransformationBase`
        /** @protected */
        this.param = (value, name, abbr, defaultValue, process) => {
            if (process == null) {
                if (isFunction(defaultValue)) {
                    process = defaultValue;
                }
                else {
                    process = identity;
                }
            }
            // @ts-ignore
            trans[name] = new Param(name, abbr, process).set(value);
            return this;
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
        this.arrayParam = function (value, name, abbr, sep = ":", defaultValue = [], process = undefined) {
            process = lastArgCallback(arguments);
            // @ts-ignore
            trans[name] = new ArrayParam(name, abbr, sep, process).set(value);
            return this;
        };
        /** @protected */
        this.transformationParam = function (value, name, abbr, sep = ".", defaultValue = undefined, process = undefined) {
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
            let value = trans[name] && trans[name].value();
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
                        results.push(key.match(VAR_NAME_RE) ? key : snakeCase(key));
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
                if (isObject(hash[key])) {
                    // @ts-ignore
                    hash[key] = cloneDeep(hash[key]);
                }
            }
            if (!isEmpty(this.chained)) {
                list = this.chained.map((tr) => tr.toPlainObject());
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
    fromOptions(options = {}) {
        if (options instanceof TransformationBase) {
            this.fromTransformation(options);
        }
        else {
            if (isString(options) || Array.isArray(options)) {
                options = {
                    transformation: options
                };
            }
            options = cloneDeep(options);
            // Handling of "if" statements precedes other options as it creates a chained transformation
            // @ts-ignore
            if (options["if"]) {
                // @ts-ignore
                this.set("if", options["if"]);
                // @ts-ignore
                delete options["if"];
            }
            for (let key in options) {
                // @ts-ignore
                let opt = options[key];
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
    }
    fromTransformation(other) {
        if (other instanceof TransformationBase) {
            other.keys().forEach(key => this.set(key, other.get(key).origValue));
        }
        return this;
    }
    /**
     * Set a parameter.
     * The parameter name `key` is converted to
     * @param {string} key - the name of the parameter
     * @param {*} values - the value of the parameter
     * @returns {Transformation} Returns this instance for chaining
     */
    set(key, ...values) {
        let camelKey;
        camelKey = camelCase(key);
        if (contains(methods, camelKey)) {
            // @ts-ignore
            this[camelKey].apply(this, values);
        }
        else {
            this.otherOptions[key] = values[0];
        }
        return this;
    }
    hasLayer() {
        return this.getValue("overlay") || this.getValue("underlay");
    }
    /**
     * Generate a string representation of the transformation.
     * @function Transformation#serialize
     * @return {string} Returns the transformation as a string
     */
    serialize() {
        var ifParam, j, len, paramList, ref, ref1, ref2, ref3, ref4, resultArray, t, transformationList, transformationString, transformations, value, variables, vars;
        resultArray = this.chained.map((tr) => tr.serialize());
        paramList = this.keys();
        transformations = (ref = this.get("transformation")) != null ? ref.serialize() : void 0;
        ifParam = (ref1 = this.get("if")) != null ? ref1.serialize() : void 0;
        variables = processVar((ref2 = this.get("variables")) != null ? ref2.value() : void 0);
        paramList = difference(paramList, ["transformation", "if", "variables"]);
        vars = [];
        transformationList = [];
        for (j = 0, len = paramList.length; j < len; j++) {
            t = paramList[j];
            if (t.match(VAR_NAME_RE)) {
                vars.push(t + "_" + Expression.normalize((ref3 = this.get(t)) != null ? ref3.value() : void 0));
            }
            else {
                transformationList.push((ref4 = this.get(t)) != null ? ref4.serialize() : void 0);
            }
        }
        switch (false) {
            case !isString(transformations):
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
                if (Array.isArray(value) && !isEmpty(value) || !Array.isArray(value) && value) {
                    results.push(value);
                }
            }
            return results;
        })();
        transformationList = vars.sort().concat(variables).concat(transformationList.sort());
        if (ifParam === "if_end") {
            transformationList.push(ifParam);
        }
        else if (!isEmpty(ifParam)) {
            transformationList.unshift(ifParam);
        }
        transformationString = (transformationList).filter(x => !!x).join(param_separator);
        if (!isEmpty(transformationString)) {
            resultArray.push(transformationString);
        }
        return (resultArray).filter((x) => !!x).join(trans_separator);
    }
    /**
     * Provide a list of all the valid transformation option names
     * @function Transformation#listNames
     * @private
     * @return {Array<string>} a array of all the valid option names
     */
    static listNames() {
        return methods;
    }
    /**
     * Returns the attributes for an HTML tag.
     * @function Cloudinary.toHtmlAttributes
     * @return PlainObject
     */
    toHtmlAttributes() {
        let attrName, height, options, ref2, ref3, value, width;
        options = {};
        let snakeCaseKey;
        Object.keys(this.otherOptions).forEach(key => {
            value = this.otherOptions[key];
            snakeCaseKey = snakeCase(key);
            if (!contains(PARAM_NAMES, snakeCaseKey) && !contains(URL_KEYS, snakeCaseKey)) {
                attrName = /^html_/.test(key) ? key.slice(5) : key;
                options[attrName] = value;
            }
        });
        // convert all "html_key" to "key" with the same value
        this.keys().forEach(key => {
            if (/^html_/.test(key)) {
                options[camelCase(key.slice(5))] = this.getValue(key);
            }
        });
        if (!(this.hasLayer() || this.getValue("angle") || contains(["fit", "limit", "lfill"], this.getValue("crop")))) {
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
    }
    static isValidParamName(name) {
        return methods.indexOf(camelCase(name)) >= 0;
    }
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
    toHtml() {
        var ref;
        return (ref = this.getParent()) != null ? typeof ref.toHtml === "function" ? ref.toHtml() : void 0 : void 0;
    }
    toString() {
        return this.serialize();
    }
    clone() {
        return new TransformationBase(this.toOptions(true));
    }
}
const VAR_NAME_RE = /^\$[a-zA-Z0-9]+$/;
const trans_separator = '/';
const param_separator = ',';
function lastArgCallback(args) {
    var callback;
    callback = args != null ? args[args.length - 1] : void 0;
    if (isFunction(callback)) {
        return callback;
    }
    else {
        return void 0;
    }
}
function processVar(varArray) {
    var j, len, name, results, v;
    if (Array.isArray(varArray)) {
        results = [];
        for (j = 0, len = varArray.length; j < len; j++) {
            [name, v] = varArray[j];
            results.push(`${name}_${Expression.normalize(v)}`);
        }
        return results;
    }
    else {
        return varArray;
    }
}
// @ts-ignore
function processCustomFunction({ function_type, source }) {
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
class Transformation extends TransformationBase {
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
    constructor(options) {
        super(options);
    }
    /**
     * Convenience constructor
     * @param {Object} options
     * @return {Transformation}
     * @example cl = cloudinary.Transformation.new( {angle: 20, crop: "scale", width: "auto"})
     */
    static new(options) {
        return new Transformation(options);
    }
    /*
      Transformation Parameters
    */
    angle(value) {
        this.arrayParam(value, "angle", "a", ".", Expression.normalize);
        return this;
    }
    audioCodec(value) {
        this.param(value, "audio_codec", "ac");
        return this;
    }
    audioFrequency(value) {
        this.param(value, "audio_frequency", "af");
        return this;
    }
    aspectRatio(value) {
        this.param(value, "aspect_ratio", "ar", Expression.normalize);
        return this;
    }
    background(value) {
        this.param(value, "background", "b", Param.norm_color);
        return this;
    }
    bitRate(value) {
        this.param(value, "bit_rate", "br");
        return this;
    }
    border(value) {
        return this.param(value, "border", "bo", (border) => {
            if (isObject(border)) {
                border = Object.assign({}, {
                    color: "black",
                    width: 2
                }, border);
                return `${border.width}px_solid_${Param.norm_color(border.color)}`;
            }
            else {
                return border;
            }
        });
    }
    color(value) {
        this.param(value, "color", "co", Param.norm_color);
        return this;
    }
    colorSpace(value) {
        this.param(value, "color_space", "cs");
        return this;
    }
    crop(value) {
        this.param(value, "crop", "c");
        return this;
    }
    customFunction(value) {
        return this.param(value, "custom_function", "fn", () => {
            return processCustomFunction(value);
        });
    }
    customPreFunction(value) {
        if (this.get('custom_function')) {
            return;
        }
        return this.rawParam(value, "custom_function", "", () => {
            value = processCustomFunction(value);
            return value ? `fn_pre:${value}` : value;
        });
    }
    defaultImage(value) {
        this.param(value, "default_image", "d");
        return this;
    }
    delay(value) {
        this.param(value, "delay", "dl");
        return this;
    }
    density(value) {
        this.param(value, "density", "dn");
        return this;
    }
    duration(value) {
        this.rangeParam(value, "duration", "du");
        return this;
    }
    dpr(value) {
        return this.param(value, "dpr", "dpr", (dpr) => {
            dpr = dpr.toString();
            if (dpr != null ? dpr.match(/^\d+$/) : void 0) {
                return dpr + ".0";
            }
            else {
                return Expression.normalize(dpr);
            }
        });
    }
    effect(value) {
        this.arrayParam(value, "effect", "e", ":", Expression.normalize);
        return this;
    }
    else() {
        return this.if('else');
    }
    endIf() {
        return this.if('end');
    }
    endOffset(value) {
        this.rangeParam(value, "end_offset", "eo");
        return this;
    }
    fallbackContent(value) {
        this.param(value, "fallback_content");
        return this;
    }
    fetchFormat(value) {
        this.param(value, "fetch_format", "f");
        return this;
    }
    format(value) {
        this.param(value, "format");
        return this;
    }
    flags(value) {
        this.arrayParam(value, "flags", "fl", ".");
        return this;
    }
    gravity(value) {
        this.param(value, "gravity", "g");
        return this;
    }
    fps(value) {
        return this.param(value, "fps", "fps", (fps) => {
            if (isString(fps)) {
                return fps;
            }
            else if (Array.isArray(fps)) {
                return fps.join("-");
            }
            else {
                return fps;
            }
        });
    }
    height(value) {
        return this.param(value, "height", "h", () => {
            if (this.getValue("crop") || this.getValue("overlay") || this.getValue("underlay")) {
                return Expression.normalize(value);
            }
            else {
                return null;
            }
        });
    }
    htmlHeight(value) {
        this.param(value, "html_height");
        return this;
    }
    htmlWidth(value) {
        this.param(value, "html_width");
        return this;
    }
    if(value = "") {
        var i, ifVal, j, ref, trIf, trRest;
        switch (value) {
            case "else":
                this.chain();
                return this.param(value, "if", "if");
            case "end":
                this.chain();
                for (i = j = ref = this.chained.length - 1; j >= 0; i = j += -1) {
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
                return Condition.new().setParent(this);
            default:
                return this.param(value, "if", "if", (value) => {
                    return Condition.new(value).toString();
                });
        }
    }
    keyframeInterval(value) {
        this.param(value, "keyframe_interval", "ki");
        return this;
    }
    ocr(value) {
        this.param(value, "ocr", "ocr");
        return this;
    }
    offset(value) {
        var end_o, start_o;
        [start_o, end_o] = (isFunction(value != null ? value.split : void 0)) ? value.split('..') : Array.isArray(value) ? value : [null, null];
        if (start_o != null) {
            this.startOffset(start_o);
        }
        if (end_o != null) {
            return this.endOffset(end_o);
        }
    }
    opacity(value) {
        this.param(value, "opacity", "o", Expression.normalize);
        return this;
    }
    overlay(value) {
        this.layerParam(value, "overlay", "l");
        return this;
    }
    page(value) {
        this.param(value, "page", "pg");
        return this;
    }
    poster(value) {
        this.param(value, "poster");
        return this;
    }
    prefix(value) {
        this.param(value, "prefix", "p");
        return this;
    }
    quality(value) {
        this.param(value, "quality", "q", Expression.normalize);
        return this;
    }
    radius(value) {
        this.arrayParam(value, "radius", "r", ":", Expression.normalize);
        return this;
    }
    rawTransformation(value) {
        this.rawParam(value, "raw_transformation");
        return this;
    }
    size(value) {
        let height, width;
        if (isFunction(value != null ? value.split : void 0)) {
            [width, height] = value.split('x');
            this.width(width);
            return this.height(height);
        }
    }
    sourceTypes(value) {
        this.param(value, "source_types");
        return this;
    }
    sourceTransformation(value) {
        return this.param(value, "source_transformation");
    }
    startOffset(value) {
        this.rangeParam(value, "start_offset", "so");
        return this;
    }
    streamingProfile(value) {
        this.param(value, "streaming_profile", "sp");
        return this;
    }
    transformation(value) {
        this.transformationParam(value, "transformation", "t");
        return this;
    }
    underlay(value) {
        this.layerParam(value, "underlay", "u");
        return this;
    }
    variable(name, value) {
        this.param(value, name, name);
        return this;
    }
    variables(values) {
        this.arrayParam(values, "variables");
        return this;
    }
    videoCodec(value) {
        this.param(value, "video_codec", "vc", Param.process_video_params);
        return this;
    }
    videoSampling(value) {
        this.param(value, "video_sampling", "vs");
        return this;
    }
    width(value) {
        this.param(value, "width", "w", () => {
            if (this.getValue("crop") || this.getValue("overlay") || this.getValue("underlay")) {
                return Expression.normalize(value);
            }
            else {
                return null;
            }
        });
        return this;
    }
    x(value) {
        this.param(value, "x", "x", Expression.normalize);
        return this;
    }
    y(value) {
        this.param(value, "y", "y", Expression.normalize);
        return this;
    }
    zoom(value) {
        this.param(value, "zoom", "z", Expression.normalize);
        return this;
    }
}
/**
 * Transformation Class methods.
 * This is a list of the parameters defined in Transformation.
 * Values are camelCased.
 */
const methods = [
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
const PARAM_NAMES = methods.map(snakeCase).concat(CONFIG_PARAMS);
export default Transformation;
