export declare const functionsSchema: {
    type: string;
    minProperties: number;
    maxProperties: number;
    additionalProperties: boolean;
    patternProperties: {
        '^.{1,256}$': {
            type: string;
            additionalProperties: boolean;
            properties: {
                runtime: {
                    type: string;
                    maxLength: number;
                };
                memory: {
                    enum: number[];
                };
                maxDuration: {
                    type: string;
                    minimum: number;
                    maximum: number;
                };
                includeFiles: {
                    type: string;
                    maxLength: number;
                };
                excludeFiles: {
                    type: string;
                    maxLength: number;
                };
            };
        };
    };
};
export declare const buildsSchema: {
    type: string;
    minItems: number;
    maxItems: number;
    items: {
        type: string;
        additionalProperties: boolean;
        required: string[];
        properties: {
            src: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            use: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            config: {
                type: string;
            };
        };
    };
};
