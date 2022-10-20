'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_cloneDeep = require('../internal/utils/cloneDeep.cjs');
var backwards_utils_isObject = require('./utils/isObject.cjs');

/**
 * Class for defining account configuration options.
 * Depends on 'utils'
 */
/**
 * Assign values from sources if they are not defined in the destination.
 * Once a value is set it does not change
 * @function Util.defaults
 * @param {Object} destination - the object to assign defaults to
 * @param sources
 * @param {...Object} source - the source object(s) to assign defaults from
 * @return {Object} destination after it was modified
 */
var useDefaultValues = function (destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return sources.reduce(function (dest, source) {
        var key, value;
        for (key in source) {
            // @ts-ignore
            value = source[key];
            // @ts-ignore
            if (dest[key] === void 0) {
                // @ts-ignore
                dest[key] = value;
            }
        }
        return dest;
    }, destination);
};
/**
 * Class for defining account configuration options.
 * @constructor Configuration
 * @param {Object} options - The account configuration parameters to set.
 * @see <a href="https://cloudinary.com/documentation/solution_overview#configuration_parameters"
 *  target="_new">Available configuration options</a>
 */
var Configuration = /** @class */ (function () {
    function Configuration(options) {
        this.configuration = options == null ? {} : internal_utils_cloneDeep.cloneDeep(options);
        useDefaultValues(this.configuration, DEFAULT_CONFIGURATION_PARAMS);
    }
    /**
     * Initializes the configuration. This method is a convenience method that invokes both
     *  {@link Configuration#fromEnvironment|fromEnvironment()} (Node.js environment only)
     *  and {@link Configuration#fromDocument|fromDocument()}.
     *  It first tries to retrieve the configuration from the environment variable.
     *  If not available, it tries from the document meta tags.
     * @function Configuration#init
     * @return {Configuration} returns `this` for chaining
     * @see fromDocument
     * @see fromEnvironment
     */
    Configuration.prototype.init = function () {
        this.fromEnvironment();
        this.fromDocument();
        return this;
    };
    /**
     * Set a new configuration item
     * @function Configuration#set
     * @param {string} name - the name of the item to set
     * @param {*} value - the value to be set
     * @return {Configuration}
     *
     */
    Configuration.prototype.set = function (name, value) {
        // @ts-ignore
        this.configuration[name] = value;
        return this;
    };
    /**
     * Get the value of a configuration item
     * @function Configuration#get
     * @param {string} name - the name of the item to set
     * @return {*} the configuration item
     */
    Configuration.prototype.get = function (name) {
        return this.configuration[name];
    };
    Configuration.prototype.merge = function (config) {
        Object.assign(this.configuration, internal_utils_cloneDeep.cloneDeep(config));
        return this;
    };
    /**
     * Initialize Cloudinary from HTML meta tags.
     * @function Configuration#fromDocument
     * @return {Configuration}
     * @example <meta name="cloudinary_cloud_name" content="mycloud">
     *
     */
    Configuration.prototype.fromDocument = function () {
        var el, i, len, meta_elements;
        meta_elements = typeof document !== "undefined" && document !== null ? document.querySelectorAll('meta[name^="cloudinary_"]') : void 0;
        if (meta_elements) {
            for (i = 0, len = meta_elements.length; i < len; i++) {
                el = meta_elements[i];
                this.configuration[el.getAttribute('name').replace('cloudinary_', '')] = el.getAttribute('content');
            }
        }
        return this;
    };
    /**
     * Initialize Cloudinary from the `CLOUDINARY_URL` environment variable.
     *
     * This function will only run under Node.js environment.
     * @function Configuration#fromEnvironment
     * @requires Node.js
     */
    Configuration.prototype.fromEnvironment = function () {
        var _this = this;
        var cloudinary_url, query, uri, uriRegex;
        if (typeof process !== "undefined" && process !== null && process.env && process.env.CLOUDINARY_URL) {
            cloudinary_url = process.env.CLOUDINARY_URL;
            uriRegex = /cloudinary:\/\/(?:(\w+)(?:\:([\w-]+))?@)?([\w\.-]+)(?:\/([^?]*))?(?:\?(.+))?/;
            uri = uriRegex.exec(cloudinary_url);
            if (uri) {
                if (uri[3] != null) {
                    this.configuration['cloud_name'] = uri[3];
                }
                if (uri[1] != null) {
                    this.configuration['api_key'] = uri[1];
                }
                if (uri[2] != null) {
                    this.configuration['api_secret'] = uri[2];
                }
                if (uri[4] != null) {
                    this.configuration['private_cdn'] = uri[4] != null;
                }
                if (uri[4] != null) {
                    this.configuration['secure_distribution'] = uri[4];
                }
                query = uri[5];
                if (query != null) {
                    query.split('&').forEach(function (value) {
                        var _a = value.split('='), k = _a[0], v = _a[1];
                        if (v == null) {
                            // @ts-ignore
                            v = true;
                        }
                        _this.configuration[k] = v;
                    });
                }
            }
        }
        return this;
    };
    /**
     * Create or modify the Cloudinary client configuration
     *
     * Warning: `config()` returns the actual internal configuration object. modifying it will change the configuration.
     *
     * This is a backward compatibility method. For new code, use get(), merge() etc.
     * @function Configuration#config
     * @param {hash|string|boolean} new_config
     * @param {string} new_value
     * @returns {*} configuration, or value
     *
     * @see {@link fromEnvironment} for initialization using environment variables
     * @see {@link fromDocument} for initialization using HTML meta tags
     */
    Configuration.prototype.config = function (new_config, new_value) {
        switch (false) {
            case new_value === void 0:
                this.set(new_config, new_value);
                return this.configuration;
            case typeof new_config != 'string':
                return this.get(new_config);
            case !backwards_utils_isObject.isObject(new_config):
                this.merge(new_config);
                return this.configuration;
            default:
                // Backward compatibility - return the internal object
                return this.configuration;
        }
    };
    /**
     * Returns a copy of the configuration parameters
     * @function Configuration#toOptions
     * @returns {Object} a key:value collection of the configuration parameters
     */
    Configuration.prototype.toOptions = function () {
        return internal_utils_cloneDeep.cloneDeep(this.configuration);
    };
    return Configuration;
}());
var DEFAULT_CONFIGURATION_PARAMS = {
    responsive_class: 'cld-responsive',
    responsive_use_breakpoints: true,
    round_dpr: true,
    secure: (typeof window !== "undefined" && window !== null ? window.location ? window.location.protocol : void 0 : void 0) === 'https:'
};
var CONFIG_PARAMS = [
    "api_key",
    "api_secret",
    "callback",
    "cdn_subdomain",
    "cloud_name",
    "cname",
    "private_cdn",
    "protocol",
    "resource_type",
    "responsive",
    "responsive_class",
    "responsive_use_breakpoints",
    "responsive_width",
    "round_dpr",
    "secure",
    "secure_cdn_subdomain",
    "secure_distribution",
    "shorten",
    "type",
    "upload_preset",
    "url_suffix",
    "use_root_path",
    "version",
    "externalLibraries",
    "max_timeout_ms"
];

exports.CONFIG_PARAMS = CONFIG_PARAMS;
exports["default"] = Configuration;
