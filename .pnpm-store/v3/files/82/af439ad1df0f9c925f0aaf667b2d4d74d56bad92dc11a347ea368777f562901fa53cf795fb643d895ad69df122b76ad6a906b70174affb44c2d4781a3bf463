export interface Schema {
    $id?: string;
    id?: string;
    $schema?: string;
    $ref?: string;
    title?: string;
    description?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number | boolean;
    minimum?: number;
    exclusiveMinimum?: number | boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    additionalItems?: boolean | Schema;
    items?: Schema | Schema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[] | boolean;
    additionalProperties?: boolean | Schema;
    definitions?: {
        [name: string]: Schema;
    };
    properties?: {
        [name: string]: Schema;
    };
    patternProperties?: {
        [name: string]: Schema;
    };
    dependencies?: {
        [name: string]: Schema | string[];
    };
    const?: any;
    enum?: any[];
    type?: string | string[];
    format?: string;
    allOf?: Schema[];
    anyOf?: Schema[];
    oneOf?: Schema[];
    not?: Schema;
    if?: Schema;
    then?: Schema;
    else?: Schema;
}
//# sourceMappingURL=schema.d.ts.map