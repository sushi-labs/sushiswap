/**
 * This enum is used only internally in order to create nominal type for the disabled plugin
 */
var EnableIfBranded;
(function (EnableIfBranded) {
    EnableIfBranded[EnableIfBranded["DisabledPlugin"] = 0] = "DisabledPlugin";
})(EnableIfBranded || (EnableIfBranded = {}));
export function isPluginEnabled(t) {
    return t !== EnableIfBranded.DisabledPlugin && t !== null;
}
/**
 * Utility function to enable a plugin.
 */
export function enableIf(condition, plugin) {
    if (condition) {
        return typeof plugin === 'function' ? plugin() : plugin;
    }
    return EnableIfBranded.DisabledPlugin;
}
