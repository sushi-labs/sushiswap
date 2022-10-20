import { mapSchema, MapperKind } from '@graphql-tools/utils';
export default class FilterTypes {
    constructor(filter) {
        this.filter = filter;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig, _transformedSchema) {
        return mapSchema(originalWrappingSchema, {
            [MapperKind.TYPE]: (type) => {
                if (this.filter(type)) {
                    return undefined;
                }
                return null;
            },
        });
    }
}
