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
class Config {
    filterOutNonSupportedKeys(userProvidedConfig, validKeys) {
        const obj = Object.create({});
        if (isObject(userProvidedConfig)) {
            Object.keys(userProvidedConfig).forEach((key) => {
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
    }
}
export default Config;
