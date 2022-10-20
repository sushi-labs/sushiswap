"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableIf = exports.isPluginEnabled = void 0;
/**
 * This enum is used only internally in order to create nominal type for the disabled plugin
 */
var EnableIfBranded;
(function (EnableIfBranded) {
    EnableIfBranded[EnableIfBranded["DisabledPlugin"] = 0] = "DisabledPlugin";
})(EnableIfBranded || (EnableIfBranded = {}));
function isPluginEnabled(t) {
    return t !== EnableIfBranded.DisabledPlugin && t !== null;
}
exports.isPluginEnabled = isPluginEnabled;
/**
 * Utility function to enable a plugin.
 */
function enableIf(condition, plugin) {
    if (condition) {
        return typeof plugin === 'function' ? plugin() : plugin;
    }
    return EnableIfBranded.DisabledPlugin;
}
exports.enableIf = enableIf;
