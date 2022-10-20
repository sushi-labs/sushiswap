import { Plugin } from '@envelop/types';
/**
 * This enum is used only internally in order to create nominal type for the disabled plugin
 */
declare enum EnableIfBranded {
    DisabledPlugin = 0
}
export declare type PluginOrDisabledPlugin = Plugin<any> | EnableIfBranded.DisabledPlugin;
export declare function isPluginEnabled(t: PluginOrDisabledPlugin): t is Plugin;
/**
 * Utility function to enable a plugin.
 */
export declare function enableIf<PluginContextType extends Record<any, any> = {}>(condition: boolean, plugin: Plugin<PluginContextType> | (() => Plugin<PluginContextType>)): PluginOrDisabledPlugin;
export {};
