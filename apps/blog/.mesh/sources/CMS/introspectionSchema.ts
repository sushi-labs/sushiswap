// @ts-nocheck
import { buildASTSchema } from 'graphql'

const schemaAST = {
  kind: 'Document',
  definitions: [
    {
      kind: 'SchemaDefinition',
      operationTypes: [
        {
          kind: 'OperationTypeDefinition',
          operation: 'query',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Query',
            },
          },
        },
        {
          kind: 'OperationTypeDefinition',
          operation: 'mutation',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Mutation',
            },
          },
        },
      ],
      directives: [],
    },
    {
      kind: 'ScalarTypeDefinition',
      description: {
        kind: 'StringValue',
        value:
          'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
        block: true,
      },
      name: {
        kind: 'Name',
        value: 'JSON',
      },
      directives: [],
    },
    {
      kind: 'ScalarTypeDefinition',
      description: {
        kind: 'StringValue',
        value:
          'A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.',
        block: true,
      },
      name: {
        kind: 'Name',
        value: 'DateTime',
      },
      directives: [],
    },
    {
      kind: 'ScalarTypeDefinition',
      description: {
        kind: 'StringValue',
        value: 'The `Long` scalar type represents 52-bit integers',
        block: true,
      },
      name: {
        kind: 'Name',
        value: 'Long',
      },
      directives: [],
    },
    {
      kind: 'ScalarTypeDefinition',
      description: {
        kind: 'StringValue',
        value: 'The `Upload` scalar type represents a file upload.',
        block: true,
      },
      name: {
        kind: 'Name',
        value: 'Upload',
      },
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Error',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'code',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'message',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Pagination',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'total',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'page',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'pageSize',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'pageCount',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ResponseCollectionMeta',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'pagination',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Pagination',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'EnumTypeDefinition',
      name: {
        kind: 'Name',
        value: 'PublicationState',
      },
      values: [
        {
          kind: 'EnumValueDefinition',
          name: {
            kind: 'Name',
            value: 'LIVE',
          },
          directives: [],
        },
        {
          kind: 'EnumValueDefinition',
          name: {
            kind: 'Name',
            value: 'PREVIEW',
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'IDFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'BooleanFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'BooleanFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'StringFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'IntFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IntFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Int',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'LongFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Long',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Long',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'LongFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Long',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Long',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Long',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'FloatFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'FloatFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'DateTimeFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DateTime',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DateTime',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DateTime',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DateTime',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DateTime',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'JSONFilterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'JSON',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'JSON',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSONFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'eq',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ne',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'startsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'endsWith',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContains',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'containsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notContainsi',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'gte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'lte',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'null',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notNull',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'in',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'JSON',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'notIn',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'JSON',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'between',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'JSON',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedDivider',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedMedia',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'file',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'caption',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedRichText',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'body',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedSeoInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'metaTitle',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'metaDescription',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'shareImage',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedSeo',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'metaTitle',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'metaDescription',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'shareImage',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ComponentSharedSlider',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'files',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UploadFileFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileRelationResponseCollection',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'alternativeText',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'caption',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'width',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IntFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'height',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IntFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'formats',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSONFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'hash',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ext',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'mime',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'size',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'FloatFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'url',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'previewUrl',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider_metadata',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSONFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'alternativeText',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'caption',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'width',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'height',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'formats',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'hash',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'ext',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'mime',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'size',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Float',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'url',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'previewUrl',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider_metadata',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFile',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'alternativeText',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'caption',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'width',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'height',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'formats',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'hash',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'ext',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'mime',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'size',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Float',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'url',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'previewUrl',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'provider_metadata',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'related',
          },
          arguments: [],
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'GenericMorph',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFile',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UploadFileEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UploadFileRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UploadFileEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerSchedulerFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'scheduledDatetime',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'uid',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contentId',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'LongFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'scheduleType',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'SchedulerSchedulerFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'SchedulerSchedulerFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerSchedulerInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'scheduledDatetime',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'uid',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'contentId',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'scheduleType',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerScheduler',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'scheduledDatetime',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'uid',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'contentId',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Long',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'scheduleType',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerSchedulerEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerScheduler',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerSchedulerEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'SchedulerSchedulerEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'SchedulerSchedulerEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'I18NLocaleFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'code',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'I18NLocaleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'I18NLocaleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'I18NLocaleFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'I18NLocale',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'code',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'I18NLocaleEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'I18NLocale',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'I18NLocaleEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'I18NLocaleEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'I18NLocaleEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'I18NLocaleEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsPermissionFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'action',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsPermissionFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsPermissionFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsPermissionFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsPermission',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'action',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsPermissionEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsPermission',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsPermissionRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsPermissionEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRoleFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'type',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'permissions',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsPermissionFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'users',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsRoleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsRoleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRoleInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'type',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'permissions',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'users',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRole',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'type',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'permissions',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UsersPermissionsPermissionFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsPermissionRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'users',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UsersPermissionsUserFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRoleEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRole',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRoleEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRoleEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsRoleEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'username',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'password',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'resetPasswordToken',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'confirmationToken',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'confirmed',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'BooleanFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'blocked',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'BooleanFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsUserFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsUserFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'username',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'password',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'resetPasswordToken',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'confirmationToken',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'confirmed',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'blocked',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUser',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'username',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'confirmed',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'blocked',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUser',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsUserEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUserRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsUserEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'UnionTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AboutBlocksDynamicZone',
      },
      directives: [],
      types: [
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedMedia',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedRichText',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedSlider',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Error',
          },
        },
      ],
    },
    {
      kind: 'ScalarTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AboutBlocksDynamicZoneInput',
      },
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AboutInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'title',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'blocks',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'AboutBlocksDynamicZoneInput',
                },
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'About',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'title',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'blocks',
          },
          arguments: [],
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'AboutBlocksDynamicZone',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AboutEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'About',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AboutEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AboutEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'UnionTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleBlocksDynamicZone',
      },
      directives: [],
      types: [
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedDivider',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedMedia',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedRichText',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedSlider',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Error',
          },
        },
      ],
    },
    {
      kind: 'ScalarTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleBlocksDynamicZoneInput',
      },
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'title',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'authors',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'categories',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'publishedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ArticleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ArticleFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'title',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'cover',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'authors',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'categories',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'blocks',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ArticleBlocksDynamicZoneInput',
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'publishedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Article',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'title',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'cover',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'authors',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'AuthorFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'categories',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'CategoryFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'blocks',
          },
          arguments: [],
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ArticleBlocksDynamicZone',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'publishedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Article',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ArticleEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'ArticleRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ArticleEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'handle',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'AuthorFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'AuthorFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'avatar',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'handle',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Author',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'avatar',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'handle',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ArticleFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'publicationState',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PublicationState',
                },
              },
              defaultValue: {
                kind: 'EnumValue',
                value: 'LIVE',
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Author',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'AuthorEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'AuthorRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'AuthorEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryFiltersInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'IDFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'StringFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleFiltersInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTimeFilterInput',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'and',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'CategoryFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'or',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'CategoryFiltersInput',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'not',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryFiltersInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Category',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'slug',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ArticleFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'publicationState',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PublicationState',
                },
              },
              defaultValue: {
                kind: 'EnumValue',
                value: 'LIVE',
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleRelationResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Category',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryEntityResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'CategoryEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'meta',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ResponseCollectionMeta',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'CategoryRelationResponseCollection',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'CategoryEntity',
                  },
                },
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'GlobalInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'siteName',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'favicon',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'siteDescription',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'defaultSeo',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ComponentSharedSeoInput',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Global',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'siteName',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'favicon',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'siteDescription',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'defaultSeo',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ComponentSharedSeo',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createdAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updatedAt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'DateTime',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'GlobalEntity',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ID',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'attributes',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Global',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'GlobalEntityResponse',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'data',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'GlobalEntity',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'UnionTypeDefinition',
      name: {
        kind: 'Name',
        value: 'GenericMorph',
      },
      directives: [],
      types: [
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedDivider',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedMedia',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedRichText',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedSeo',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'ComponentSharedSlider',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'UploadFile',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'SchedulerScheduler',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'I18NLocale',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'UsersPermissionsPermission',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'UsersPermissionsRole',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'UsersPermissionsUser',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'About',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Article',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Author',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Category',
          },
        },
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Global',
          },
        },
      ],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'FileInfoInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'alternativeText',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'caption',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsMe',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'username',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'confirmed',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'blocked',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Boolean',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'role',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsMeRole',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsMeRole',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'id',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ID',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'name',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'description',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'type',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsRegisterInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'username',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'email',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'password',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsLoginInput',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'identifier',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'password',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'provider',
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'String',
              },
            },
          },
          directives: [],
          defaultValue: {
            kind: 'StringValue',
            value: 'local',
          },
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsPasswordPayload',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'ok',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsLoginPayload',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'jwt',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'user',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsMe',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsCreateRolePayload',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'ok',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsUpdateRolePayload',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'ok',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'UsersPermissionsDeleteRolePayload',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'ok',
          },
          arguments: [],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'Boolean',
              },
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'PaginationArg',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'page',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'pageSize',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'start',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'limit',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          directives: [],
        },
      ],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Query',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'uploadFile',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'uploadFiles',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UploadFileFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'schedulerScheduler',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'SchedulerSchedulerFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'i18NLocale',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'I18NLocaleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'i18NLocales',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'I18NLocaleFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'I18NLocaleEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'usersPermissionsRole',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'usersPermissionsRoles',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UsersPermissionsRoleFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsRoleEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'usersPermissionsUser',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'usersPermissionsUsers',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UsersPermissionsUserFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUserEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'about',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AboutEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'article',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'articles',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ArticleFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'publicationState',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PublicationState',
                },
              },
              defaultValue: {
                kind: 'EnumValue',
                value: 'LIVE',
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'author',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'authors',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'AuthorFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'category',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'categories',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'filters',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'CategoryFiltersInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'pagination',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'PaginationArg',
                },
              },
              defaultValue: {
                kind: 'ObjectValue',
                fields: [],
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'sort',
              },
              type: {
                kind: 'ListType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              defaultValue: {
                kind: 'ListValue',
                values: [],
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntityResponseCollection',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'global',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'GlobalEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'me',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsMe',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Mutation',
      },
      fields: [
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createUploadFile',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UploadFileInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateUploadFile',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UploadFileInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteUploadFile',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createSchedulerScheduler',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'SchedulerSchedulerInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateSchedulerScheduler',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'SchedulerSchedulerInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteSchedulerScheduler',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SchedulerSchedulerEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateAbout',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'AboutInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AboutEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteAbout',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AboutEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createArticle',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ArticleInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateArticle',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ArticleInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteArticle',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'ArticleEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createAuthor',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'AuthorInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateAuthor',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'AuthorInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteAuthor',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'AuthorEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'createCategory',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'CategoryInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateCategory',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'CategoryInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteCategory',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'CategoryEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateGlobal',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'GlobalInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'GlobalEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'deleteGlobal',
          },
          arguments: [],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'GlobalEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'upload',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'refId',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'ref',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'String',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'field',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'String',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'info',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'FileInfoInput',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'file',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'Upload',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'multipleUpload',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'refId',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'ID',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'ref',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'String',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'field',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'String',
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'files',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'ListType',
                  type: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'Upload',
                    },
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'UploadFileEntityResponse',
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'updateFileInfo',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'info',
              },
              type: {
                kind: 'NamedType',
                name: {
                  kind: 'Name',
                  value: 'FileInfoInput',
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UploadFileEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'removeFile',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UploadFileEntityResponse',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Create a new role',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'createUsersPermissionsRole',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsRoleInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsCreateRolePayload',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Update an existing role',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'updateUsersPermissionsRole',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsRoleInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsUpdateRolePayload',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Delete an existing role',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'deleteUsersPermissionsRole',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsDeleteRolePayload',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Create a new user',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'createUsersPermissionsUser',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsUserInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsUserEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Update an existing user',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'updateUsersPermissionsUser',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'data',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsUserInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsUserEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Delete an existing user',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'deleteUsersPermissionsUser',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'id',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'ID',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsUserEntityResponse',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          name: {
            kind: 'Name',
            value: 'login',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'input',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsLoginInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsLoginPayload',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Register a user',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'register',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'input',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'UsersPermissionsRegisterInput',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'UsersPermissionsLoginPayload',
              },
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Request a reset password token',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'forgotPassword',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'email',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsPasswordPayload',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Reset user password. Confirm with a code (resetToken from forgotPassword)',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'resetPassword',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'password',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'passwordConfirmation',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              directives: [],
            },
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'code',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsLoginPayload',
            },
          },
          directives: [],
        },
        {
          kind: 'FieldDefinition',
          description: {
            kind: 'StringValue',
            value: 'Confirm an email users email address',
            block: true,
          },
          name: {
            kind: 'Name',
            value: 'emailConfirmation',
          },
          arguments: [
            {
              kind: 'InputValueDefinition',
              name: {
                kind: 'Name',
                value: 'confirmation',
              },
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: {
                    kind: 'Name',
                    value: 'String',
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'UsersPermissionsLoginPayload',
            },
          },
          directives: [],
        },
      ],
      interfaces: [],
      directives: [],
    },
  ],
}

export default buildASTSchema(schemaAST, {
  assumeValid: true,
  assumeValidSDL: true,
})
