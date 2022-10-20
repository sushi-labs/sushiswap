import { GetEnvelopedFn, ComposeContext, Plugin } from '@envelop/types';
import { PluginOrDisabledPlugin } from './enable-if.js';
export declare function envelop<PluginsType extends Plugin<any>[]>(options: {
    plugins: Array<PluginOrDisabledPlugin>;
    enableInternalTracing?: boolean;
}): GetEnvelopedFn<ComposeContext<PluginsType>>;
