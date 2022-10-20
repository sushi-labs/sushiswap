import { Project } from 'ts-morph';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
export declare const BaseFunctionConfigSchema: {
    readonly type: "object";
    readonly properties: {
        readonly runtime: {
            readonly type: "string";
        };
        readonly memory: {
            readonly type: "number";
        };
        readonly maxDuration: {
            readonly type: "number";
        };
        readonly regions: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
        };
    };
};
export declare type BaseFunctionConfig = FromSchema<typeof BaseFunctionConfigSchema>;
export declare function getConfig<T extends JSONSchema = typeof BaseFunctionConfigSchema>(project: Project, sourcePath: string, schema?: T): FromSchema<T> | null;
