/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: 'blocks'
  query: 'Query'
  mutation: never
  subscription: 'Subscription'
  types: {
    Aggregation_interval: {
      name: 'Aggregation_interval'
      enumValues: 'hour' | 'day'
    }
    BigDecimal: unknown
    BigInt: unknown
    Block: {
      kind: 'OBJECT'
      name: 'Block'
      fields: {
        author: {
          name: 'author'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        difficulty: {
          name: 'difficulty'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        gasLimit: {
          name: 'gasLimit'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        gasUsed: {
          name: 'gasUsed'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          }
        }
        number: {
          name: 'number'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        parentHash: {
          name: 'parentHash'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        receiptsRoot: {
          name: 'receiptsRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        size: {
          name: 'size'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        stateRoot: {
          name: 'stateRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        timestamp: {
          name: 'timestamp'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        totalDifficulty: {
          name: 'totalDifficulty'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        transactionsRoot: {
          name: 'transactionsRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        unclesHash: {
          name: 'unclesHash'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
    }
    BlockChangedFilter: {
      kind: 'INPUT_OBJECT'
      name: 'BlockChangedFilter'
      isOneOf: false
      inputFields: [
        {
          name: 'number_gte'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          }
          defaultValue: null
        },
      ]
    }
    Block_filter: {
      kind: 'INPUT_OBJECT'
      name: 'Block_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'number_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'timestamp'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'timestamp_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'timestamp_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'parentHash'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'parentHash_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'parentHash_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'parentHash_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'author_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'author_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'author_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'difficulty_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'difficulty_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalDifficulty'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalDifficulty_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'gasUsed'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasUsed_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'gasUsed_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'gasLimit'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'gasLimit_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'gasLimit_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'receiptsRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'receiptsRoot_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'transactionsRoot_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'stateRoot_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'stateRoot_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'size_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'size_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'unclesHash'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'unclesHash_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'unclesHash_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: '_change_block'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'BlockChangedFilter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'and'
          type: {
            kind: 'LIST'
            name: never
            ofType: { kind: 'INPUT_OBJECT'; name: 'Block_filter'; ofType: null }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: { kind: 'INPUT_OBJECT'; name: 'Block_filter'; ofType: null }
          }
          defaultValue: null
        },
      ]
    }
    Block_height: {
      kind: 'INPUT_OBJECT'
      name: 'Block_height'
      isOneOf: false
      inputFields: [
        {
          name: 'hash'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number'
          type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          defaultValue: null
        },
        {
          name: 'number_gte'
          type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          defaultValue: null
        },
      ]
    }
    Block_orderBy: {
      name: 'Block_orderBy'
      enumValues:
        | 'id'
        | 'number'
        | 'timestamp'
        | 'parentHash'
        | 'author'
        | 'difficulty'
        | 'totalDifficulty'
        | 'gasUsed'
        | 'gasLimit'
        | 'receiptsRoot'
        | 'transactionsRoot'
        | 'stateRoot'
        | 'size'
        | 'unclesHash'
    }
    Boolean: unknown
    Bytes: unknown
    ID: unknown
    Int: unknown
    Int8: unknown
    OrderDirection: { name: 'OrderDirection'; enumValues: 'asc' | 'desc' }
    Query: {
      kind: 'OBJECT'
      name: 'Query'
      fields: {
        _meta: {
          name: '_meta'
          type: { kind: 'OBJECT'; name: '_Meta_'; ofType: null }
        }
        block: {
          name: 'block'
          type: { kind: 'OBJECT'; name: 'Block'; ofType: null }
        }
        blocks: {
          name: 'blocks'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Block'; ofType: null }
              }
            }
          }
        }
      }
    }
    String: unknown
    Subscription: {
      kind: 'OBJECT'
      name: 'Subscription'
      fields: {
        _meta: {
          name: '_meta'
          type: { kind: 'OBJECT'; name: '_Meta_'; ofType: null }
        }
        block: {
          name: 'block'
          type: { kind: 'OBJECT'; name: 'Block'; ofType: null }
        }
        blocks: {
          name: 'blocks'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Block'; ofType: null }
              }
            }
          }
        }
      }
    }
    Timestamp: unknown
    _Block_: {
      kind: 'OBJECT'
      name: '_Block_'
      fields: {
        hash: {
          name: 'hash'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
        }
        number: {
          name: 'number'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          }
        }
        parentHash: {
          name: 'parentHash'
          type: { kind: 'SCALAR'; name: 'Bytes'; ofType: null }
        }
        timestamp: {
          name: 'timestamp'
          type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
    _Meta_: {
      kind: 'OBJECT'
      name: '_Meta_'
      fields: {
        block: {
          name: 'block'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: '_Block_'; ofType: null }
          }
        }
        deployment: {
          name: 'deployment'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        hasIndexingErrors: {
          name: 'hasIndexingErrors'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
      }
    }
    _SubgraphErrorPolicy_: {
      name: '_SubgraphErrorPolicy_'
      enumValues: 'allow' | 'deny'
    }
  }
}

import * as gqlTada from 'gql.tada'
