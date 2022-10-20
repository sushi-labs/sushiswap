"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncSchema = exports.useLazyLoadedSchema = exports.useSchema = void 0;
const useSchema = (schema) => {
    return {
        onPluginInit({ setSchema }) {
            setSchema(schema);
        },
    };
};
exports.useSchema = useSchema;
const useLazyLoadedSchema = (schemaLoader) => {
    return {
        onEnveloped({ setSchema, context }) {
            setSchema(schemaLoader(context));
        },
    };
};
exports.useLazyLoadedSchema = useLazyLoadedSchema;
const useAsyncSchema = (schemaPromise) => {
    return {
        onPluginInit({ setSchema }) {
            schemaPromise.then(schemaObj => {
                setSchema(schemaObj);
            });
        },
    };
};
exports.useAsyncSchema = useAsyncSchema;
