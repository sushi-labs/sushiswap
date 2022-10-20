export const useSchema = (schema) => {
    return {
        onPluginInit({ setSchema }) {
            setSchema(schema);
        },
    };
};
export const useLazyLoadedSchema = (schemaLoader) => {
    return {
        onEnveloped({ setSchema, context }) {
            setSchema(schemaLoader(context));
        },
    };
};
export const useAsyncSchema = (schemaPromise) => {
    return {
        onPluginInit({ setSchema }) {
            schemaPromise.then(schemaObj => {
                setSchema(schemaObj);
            });
        },
    };
};
