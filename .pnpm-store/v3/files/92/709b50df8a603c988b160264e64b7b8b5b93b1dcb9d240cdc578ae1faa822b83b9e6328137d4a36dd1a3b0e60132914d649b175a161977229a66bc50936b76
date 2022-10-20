import { OnEnvelopedHook, OnContextBuildingHook, OnExecuteHook, OnParseHook, OnPluginInitHook, OnSchemaChangeHook, OnSubscribeHook, OnValidateHook, OnResolverCalledHook, DefaultArgs } from './hooks.js';
export interface Plugin<PluginContext extends Record<string, any> = {}> {
    /**
     * Invoked for each call to getEnveloped.
     */
    onEnveloped?: OnEnvelopedHook<PluginContext>;
    /**
     * Invoked each time the GraphQL schema has been replaced from within a plugin.
     */
    onSchemaChange?: OnSchemaChangeHook;
    /**
     * Invoked when a plugin is initialized.
     */
    onPluginInit?: OnPluginInitHook;
    /**
     * Invoked for each execute call.
     */
    onExecute?: OnExecuteHook<PluginContext>;
    /**
     * Invoked for each subscribe call.
     */
    onSubscribe?: OnSubscribeHook<PluginContext>;
    /**
     * Invoked for each parse call.
     */
    onParse?: OnParseHook<PluginContext>;
    /**
     * Invoked for each validate call.
     */
    onValidate?: OnValidateHook<PluginContext>;
    /**
     * Invoked for each time the context is builded.
     */
    onContextBuilding?: OnContextBuildingHook<PluginContext>;
    /**
     * Invoked before each resolver has been invoked during the execution phase.
     */
    onResolverCalled?: OnResolverCalledHook<any, DefaultArgs, PluginContext, unknown>;
}
