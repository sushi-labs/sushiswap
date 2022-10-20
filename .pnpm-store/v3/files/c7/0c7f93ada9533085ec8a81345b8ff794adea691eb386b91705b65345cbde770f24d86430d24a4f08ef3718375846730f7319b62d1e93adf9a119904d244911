'use strict';

/**
 *
 * @private
 * @param {any} a
 */
function isObject(a) {
    if (typeof a !== 'object' || a instanceof Array) {
        return false;
    }
    else {
        return true;
    }
}
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.filterOutNonSupportedKeys = function (userProvidedConfig, validKeys) {
        var obj = Object.create({});
        if (isObject(userProvidedConfig)) {
            Object.keys(userProvidedConfig).forEach(function (key) {
                if (validKeys.indexOf(key) >= 0) {
                    obj[key] = userProvidedConfig[key];
                }
                else {
                    console.warn('Warning - unsupported key provided to configuration: ', key);
                }
            });
            return obj;
        }
        else {
            return Object.create({});
        }
    };
    return Config;
}());

module.exports = Config;
