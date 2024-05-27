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
  name: 'bonds'
  query: 'Query'
  mutation: never
  subscription: 'Subscription'
  types: {
    Aggregation_interval: {
      name: 'Aggregation_interval'
      enumValues: 'hour' | 'day'
    }
    BalancerWeightedPool: {
      kind: 'OBJECT'
      name: 'BalancerWeightedPool'
      fields: {
        constituentTokens: {
          name: 'constituentTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
              }
            }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        poolId: {
          name: 'poolId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        vaultAddress: {
          name: 'vaultAddress'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    BalancerWeightedPool_filter: {
      kind: 'INPUT_OBJECT'
      name: 'BalancerWeightedPool_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_in'
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
          name: 'vaultAddress_not_in'
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
          name: 'vaultAddress_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vaultAddress_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_in'
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
          name: 'poolId_not_in'
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
          name: 'poolId_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'poolId_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'constituentTokens'
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
          name: 'constituentTokens_not'
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
          name: 'constituentTokens_contains'
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
          name: 'constituentTokens_contains_nocase'
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
          name: 'constituentTokens_not_contains'
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
          name: 'constituentTokens_not_contains_nocase'
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
          name: 'constituentTokens_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BalancerWeightedPool_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BalancerWeightedPool_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    BalancerWeightedPool_orderBy: {
      name: 'BalancerWeightedPool_orderBy'
      enumValues: 'id' | 'vaultAddress' | 'poolId' | 'constituentTokens'
    }
    BigDecimal: unknown
    BigInt: unknown
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
    BondPurchase: {
      kind: 'OBJECT'
      name: 'BondPurchase'
      fields: {
        amount: {
          name: 'amount'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        auctioneer: {
          name: 'auctioneer'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        market: {
          name: 'market'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Market'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        owner: {
          name: 'owner'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        ownerTokenTbv: {
          name: 'ownerTokenTbv'
          type: { kind: 'OBJECT'; name: 'OwnerTokenTbv'; ofType: null }
        }
        payout: {
          name: 'payout'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        payoutToken: {
          name: 'payoutToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        payoutTokenTbv: {
          name: 'payoutTokenTbv'
          type: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
        }
        postPurchasePrice: {
          name: 'postPurchasePrice'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        purchasePrice: {
          name: 'purchasePrice'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        quoteToken: {
          name: 'quoteToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        recipient: {
          name: 'recipient'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        referrer: {
          name: 'referrer'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        teller: {
          name: 'teller'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        timestamp: {
          name: 'timestamp'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
      }
    }
    BondPurchase_filter: {
      kind: 'INPUT_OBJECT'
      name: 'BondPurchase_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_in'
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
          name: 'market_not_in'
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
          name: 'market_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_'
          type: { kind: 'INPUT_OBJECT'; name: 'Market_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_in'
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
          name: 'owner_not_in'
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
          name: 'owner_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'amount_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'amount_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'payout'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payout_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'payout_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'recipient'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_in'
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
          name: 'recipient_not_in'
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
          name: 'recipient_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'recipient_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_in'
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
          name: 'referrer_not_in'
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
          name: 'referrer_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'referrer_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
          name: 'teller'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_in'
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
          name: 'teller_not_in'
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
          name: 'teller_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_in'
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
          name: 'auctioneer_not_in'
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
          name: 'auctioneer_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_in'
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
          name: 'payoutToken_not_in'
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
          name: 'payoutToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_in'
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
          name: 'quoteToken_not_in'
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
          name: 'quoteToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'purchasePrice'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchasePrice_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'purchasePrice_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'postPurchasePrice_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_in'
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
          name: 'ownerTokenTbv_not_in'
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
          name: 'ownerTokenTbv_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'ownerTokenTbv_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'OwnerTokenTbv_filter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_in'
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
          name: 'payoutTokenTbv_not_in'
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
          name: 'payoutTokenTbv_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutTokenTbv_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'PayoutTokenTbv_filter'
            ofType: null
          }
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BondPurchase_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BondPurchase_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    BondPurchase_orderBy: {
      name: 'BondPurchase_orderBy'
      enumValues:
        | 'id'
        | 'market'
        | 'market__id'
        | 'market__name'
        | 'market__type'
        | 'market__network'
        | 'market__chainId'
        | 'market__auctioneer'
        | 'market__teller'
        | 'market__marketId'
        | 'market__owner'
        | 'market__vesting'
        | 'market__start'
        | 'market__conclusion'
        | 'market__vestingType'
        | 'market__isInstantSwap'
        | 'market__hasClosed'
        | 'market__totalBondedAmount'
        | 'market__totalPayoutAmount'
        | 'market__creationBlockTimestamp'
        | 'market__callbackAddress'
        | 'market__capacity'
        | 'market__capacityInQuote'
        | 'market__minPrice'
        | 'market__price'
        | 'market__scale'
        | 'market__averageBondPrice'
        | 'market__bondsIssued'
        | 'owner'
        | 'amount'
        | 'payout'
        | 'recipient'
        | 'referrer'
        | 'timestamp'
        | 'teller'
        | 'auctioneer'
        | 'payoutToken'
        | 'payoutToken__id'
        | 'payoutToken__network'
        | 'payoutToken__chainId'
        | 'payoutToken__address'
        | 'payoutToken__decimals'
        | 'payoutToken__symbol'
        | 'payoutToken__name'
        | 'payoutToken__typeName'
        | 'payoutToken__usedAsPayout'
        | 'payoutToken__usedAsQuote'
        | 'payoutToken__totalPayoutAmount'
        | 'payoutToken__purchaseCount'
        | 'quoteToken'
        | 'quoteToken__id'
        | 'quoteToken__network'
        | 'quoteToken__chainId'
        | 'quoteToken__address'
        | 'quoteToken__decimals'
        | 'quoteToken__symbol'
        | 'quoteToken__name'
        | 'quoteToken__typeName'
        | 'quoteToken__usedAsPayout'
        | 'quoteToken__usedAsQuote'
        | 'quoteToken__totalPayoutAmount'
        | 'quoteToken__purchaseCount'
        | 'network'
        | 'chainId'
        | 'purchasePrice'
        | 'postPurchasePrice'
        | 'ownerTokenTbv'
        | 'ownerTokenTbv__id'
        | 'ownerTokenTbv__owner'
        | 'ownerTokenTbv__token'
        | 'ownerTokenTbv__network'
        | 'ownerTokenTbv__chainId'
        | 'ownerTokenTbv__tbv'
        | 'payoutTokenTbv'
        | 'payoutTokenTbv__id'
        | 'payoutTokenTbv__network'
        | 'payoutTokenTbv__chainId'
        | 'payoutTokenTbv__tbv'
    }
    BondToken: {
      kind: 'OBJECT'
      name: 'BondToken'
      fields: {
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        decimals: {
          name: 'decimals'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        expiry: {
          name: 'expiry'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        symbol: {
          name: 'symbol'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        teller: {
          name: 'teller'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        type: {
          name: 'type'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        underlying: {
          name: 'underlying'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
      }
    }
    BondToken_filter: {
      kind: 'INPUT_OBJECT'
      name: 'BondToken_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_in'
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
          name: 'decimals_not_in'
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
          name: 'symbol'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_in'
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
          name: 'symbol_not_in'
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
          name: 'symbol_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_in'
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
          name: 'underlying_not_in'
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
          name: 'underlying_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'underlying_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'expiry_in'
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
          name: 'expiry_not_in'
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
          name: 'teller'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_in'
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
          name: 'teller_not_in'
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
          name: 'teller_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'type'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_in'
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
          name: 'type_not_in'
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
          name: 'type_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_ends_with_nocase'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BondToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'BondToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    BondToken_orderBy: {
      name: 'BondToken_orderBy'
      enumValues:
        | 'id'
        | 'decimals'
        | 'symbol'
        | 'underlying'
        | 'underlying__id'
        | 'underlying__network'
        | 'underlying__chainId'
        | 'underlying__address'
        | 'underlying__decimals'
        | 'underlying__symbol'
        | 'underlying__name'
        | 'underlying__typeName'
        | 'underlying__usedAsPayout'
        | 'underlying__usedAsQuote'
        | 'underlying__totalPayoutAmount'
        | 'underlying__purchaseCount'
        | 'expiry'
        | 'teller'
        | 'network'
        | 'chainId'
        | 'type'
    }
    Boolean: unknown
    Bytes: unknown
    ID: unknown
    Int: unknown
    Int8: unknown
    Market: {
      kind: 'OBJECT'
      name: 'Market'
      fields: {
        auctioneer: {
          name: 'auctioneer'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        averageBondPrice: {
          name: 'averageBondPrice'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
        }
        bondPurchases: {
          name: 'bondPurchases'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
            }
          }
        }
        bondsIssued: {
          name: 'bondsIssued'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        callbackAddress: {
          name: 'callbackAddress'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        capacity: {
          name: 'capacity'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        capacityInQuote: {
          name: 'capacityInQuote'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        conclusion: {
          name: 'conclusion'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        creationBlockTimestamp: {
          name: 'creationBlockTimestamp'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        hasClosed: {
          name: 'hasClosed'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        isInstantSwap: {
          name: 'isInstantSwap'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
        marketId: {
          name: 'marketId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        minPrice: {
          name: 'minPrice'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        name: {
          name: 'name'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        owner: {
          name: 'owner'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        payoutToken: {
          name: 'payoutToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        price: {
          name: 'price'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        quoteToken: {
          name: 'quoteToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        scale: {
          name: 'scale'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        start: {
          name: 'start'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
        }
        teller: {
          name: 'teller'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        totalBondedAmount: {
          name: 'totalBondedAmount'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        totalPayoutAmount: {
          name: 'totalPayoutAmount'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        tunes: {
          name: 'tunes'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'Tune'; ofType: null }
            }
          }
        }
        type: {
          name: 'type'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        vesting: {
          name: 'vesting'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        vestingType: {
          name: 'vestingType'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    MarketOwnerCount: {
      kind: 'OBJECT'
      name: 'MarketOwnerCount'
      fields: {
        count: {
          name: 'count'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    MarketOwnerCount_filter: {
      kind: 'INPUT_OBJECT'
      name: 'MarketOwnerCount_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_in'
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
          name: 'count_not_in'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'MarketOwnerCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'MarketOwnerCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    MarketOwnerCount_orderBy: {
      name: 'MarketOwnerCount_orderBy'
      enumValues: 'id' | 'count'
    }
    Market_filter: {
      kind: 'INPUT_OBJECT'
      name: 'Market_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_in'
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
          name: 'name_not_in'
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
          name: 'name_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_in'
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
          name: 'type_not_in'
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
          name: 'type_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'type_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'auctioneer'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_in'
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
          name: 'auctioneer_not_in'
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
          name: 'auctioneer_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'auctioneer_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_in'
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
          name: 'teller_not_in'
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
          name: 'teller_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'teller_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'marketId_in'
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
          name: 'marketId_not_in'
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
          name: 'owner'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_in'
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
          name: 'owner_not_in'
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
          name: 'owner_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_in'
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
          name: 'payoutToken_not_in'
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
          name: 'payoutToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_in'
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
          name: 'quoteToken_not_in'
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
          name: 'quoteToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vesting_in'
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
          name: 'vesting_not_in'
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
          name: 'start'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'start_in'
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
          name: 'start_not_in'
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
          name: 'conclusion'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'conclusion_in'
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
          name: 'conclusion_not_in'
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
          name: 'vestingType'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_in'
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
          name: 'vestingType_not_in'
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
          name: 'vestingType_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'vestingType_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'isInstantSwap'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'isInstantSwap_not'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'isInstantSwap_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'isInstantSwap_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'hasClosed'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'hasClosed_not'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'hasClosed_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'hasClosed_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalBondedAmount_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'creationBlockTimestamp_in'
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
          name: 'creationBlockTimestamp_not_in'
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
          name: 'callbackAddress'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_in'
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
          name: 'callbackAddress_not_in'
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
          name: 'callbackAddress_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'callbackAddress_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacity_in'
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
          name: 'capacity_not_in'
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
          name: 'capacityInQuote'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacityInQuote_not'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'capacityInQuote_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'capacityInQuote_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'minPrice'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'minPrice_in'
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
          name: 'minPrice_not_in'
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
          name: 'price'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'price_in'
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
          name: 'price_not_in'
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
          name: 'scale'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'scale_in'
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
          name: 'scale_not_in'
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
          name: 'averageBondPrice'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'averageBondPrice_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'tunes_'
          type: { kind: 'INPUT_OBJECT'; name: 'Tune_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondPurchases_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'BondPurchase_filter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'bondsIssued'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondsIssued_in'
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
          name: 'bondsIssued_not_in'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'Market_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'Market_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    Market_orderBy: {
      name: 'Market_orderBy'
      enumValues:
        | 'id'
        | 'name'
        | 'type'
        | 'network'
        | 'chainId'
        | 'auctioneer'
        | 'teller'
        | 'marketId'
        | 'owner'
        | 'payoutToken'
        | 'payoutToken__id'
        | 'payoutToken__network'
        | 'payoutToken__chainId'
        | 'payoutToken__address'
        | 'payoutToken__decimals'
        | 'payoutToken__symbol'
        | 'payoutToken__name'
        | 'payoutToken__typeName'
        | 'payoutToken__usedAsPayout'
        | 'payoutToken__usedAsQuote'
        | 'payoutToken__totalPayoutAmount'
        | 'payoutToken__purchaseCount'
        | 'quoteToken'
        | 'quoteToken__id'
        | 'quoteToken__network'
        | 'quoteToken__chainId'
        | 'quoteToken__address'
        | 'quoteToken__decimals'
        | 'quoteToken__symbol'
        | 'quoteToken__name'
        | 'quoteToken__typeName'
        | 'quoteToken__usedAsPayout'
        | 'quoteToken__usedAsQuote'
        | 'quoteToken__totalPayoutAmount'
        | 'quoteToken__purchaseCount'
        | 'vesting'
        | 'start'
        | 'conclusion'
        | 'vestingType'
        | 'isInstantSwap'
        | 'hasClosed'
        | 'totalBondedAmount'
        | 'totalPayoutAmount'
        | 'creationBlockTimestamp'
        | 'callbackAddress'
        | 'capacity'
        | 'capacityInQuote'
        | 'minPrice'
        | 'price'
        | 'scale'
        | 'averageBondPrice'
        | 'tunes'
        | 'bondPurchases'
        | 'bondsIssued'
    }
    OrderDirection: { name: 'OrderDirection'; enumValues: 'asc' | 'desc' }
    OwnerBalance: {
      kind: 'OBJECT'
      name: 'OwnerBalance'
      fields: {
        balance: {
          name: 'balance'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        bondToken: {
          name: 'bondToken'
          type: { kind: 'OBJECT'; name: 'BondToken'; ofType: null }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        owner: {
          name: 'owner'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        tokenId: {
          name: 'tokenId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
      }
    }
    OwnerBalance_filter: {
      kind: 'INPUT_OBJECT'
      name: 'OwnerBalance_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tokenId_in'
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
          name: 'tokenId_not_in'
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
          name: 'owner'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_in'
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
          name: 'owner_not_in'
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
          name: 'owner_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balance_in'
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
          name: 'balance_not_in'
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
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'bondToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_in'
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
          name: 'bondToken_not_in'
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
          name: 'bondToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'bondToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'BondToken_filter'; ofType: null }
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'OwnerBalance_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'OwnerBalance_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    OwnerBalance_orderBy: {
      name: 'OwnerBalance_orderBy'
      enumValues:
        | 'id'
        | 'tokenId'
        | 'owner'
        | 'balance'
        | 'network'
        | 'chainId'
        | 'bondToken'
        | 'bondToken__id'
        | 'bondToken__decimals'
        | 'bondToken__symbol'
        | 'bondToken__expiry'
        | 'bondToken__teller'
        | 'bondToken__network'
        | 'bondToken__chainId'
        | 'bondToken__type'
    }
    OwnerTokenTbv: {
      kind: 'OBJECT'
      name: 'OwnerTokenTbv'
      fields: {
        bondPurchases: {
          name: 'bondPurchases'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
            }
          }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        owner: {
          name: 'owner'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        tbv: {
          name: 'tbv'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        token: {
          name: 'token'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    OwnerTokenTbv_filter: {
      kind: 'INPUT_OBJECT'
      name: 'OwnerTokenTbv_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_in'
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
          name: 'owner_not_in'
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
          name: 'owner_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'owner_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_in'
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
          name: 'token_not_in'
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
          name: 'token_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'tbv'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'tbv_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'bondPurchases_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'BondPurchase_filter'
            ofType: null
          }
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'OwnerTokenTbv_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'OwnerTokenTbv_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    OwnerTokenTbv_orderBy: {
      name: 'OwnerTokenTbv_orderBy'
      enumValues:
        | 'id'
        | 'owner'
        | 'token'
        | 'network'
        | 'chainId'
        | 'tbv'
        | 'bondPurchases'
    }
    Pair: {
      kind: 'OBJECT'
      name: 'Pair'
      fields: {
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        token0: {
          name: 'token0'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        token1: {
          name: 'token1'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
      }
    }
    Pair_filter: {
      kind: 'INPUT_OBJECT'
      name: 'Pair_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_in'
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
          name: 'token0_not_in'
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
          name: 'token0_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token0_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_in'
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
          name: 'token1_not_in'
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
          name: 'token1_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token1_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
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
            ofType: { kind: 'INPUT_OBJECT'; name: 'Pair_filter'; ofType: null }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: { kind: 'INPUT_OBJECT'; name: 'Pair_filter'; ofType: null }
          }
          defaultValue: null
        },
      ]
    }
    Pair_orderBy: {
      name: 'Pair_orderBy'
      enumValues:
        | 'id'
        | 'token0'
        | 'token0__id'
        | 'token0__network'
        | 'token0__chainId'
        | 'token0__address'
        | 'token0__decimals'
        | 'token0__symbol'
        | 'token0__name'
        | 'token0__typeName'
        | 'token0__usedAsPayout'
        | 'token0__usedAsQuote'
        | 'token0__totalPayoutAmount'
        | 'token0__purchaseCount'
        | 'token1'
        | 'token1__id'
        | 'token1__network'
        | 'token1__chainId'
        | 'token1__address'
        | 'token1__decimals'
        | 'token1__symbol'
        | 'token1__name'
        | 'token1__typeName'
        | 'token1__usedAsPayout'
        | 'token1__usedAsQuote'
        | 'token1__totalPayoutAmount'
        | 'token1__purchaseCount'
    }
    PayoutToken: {
      kind: 'OBJECT'
      name: 'PayoutToken'
      fields: {
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    PayoutTokenTbv: {
      kind: 'OBJECT'
      name: 'PayoutTokenTbv'
      fields: {
        bondPurchases: {
          name: 'bondPurchases'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
            }
          }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        payoutToken: {
          name: 'payoutToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        quoteToken: {
          name: 'quoteToken'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
        tbv: {
          name: 'tbv'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
      }
    }
    PayoutTokenTbv_filter: {
      kind: 'INPUT_OBJECT'
      name: 'PayoutTokenTbv_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_in'
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
          name: 'payoutToken_not_in'
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
          name: 'payoutToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'payoutToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_in'
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
          name: 'quoteToken_not_in'
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
          name: 'quoteToken_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'quoteToken_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'tbv'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'tbv_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'tbv_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'bondPurchases_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'BondPurchase_filter'
            ofType: null
          }
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PayoutTokenTbv_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PayoutTokenTbv_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    PayoutTokenTbv_orderBy: {
      name: 'PayoutTokenTbv_orderBy'
      enumValues:
        | 'id'
        | 'payoutToken'
        | 'payoutToken__id'
        | 'payoutToken__network'
        | 'payoutToken__chainId'
        | 'payoutToken__address'
        | 'payoutToken__decimals'
        | 'payoutToken__symbol'
        | 'payoutToken__name'
        | 'payoutToken__typeName'
        | 'payoutToken__usedAsPayout'
        | 'payoutToken__usedAsQuote'
        | 'payoutToken__totalPayoutAmount'
        | 'payoutToken__purchaseCount'
        | 'quoteToken'
        | 'quoteToken__id'
        | 'quoteToken__network'
        | 'quoteToken__chainId'
        | 'quoteToken__address'
        | 'quoteToken__decimals'
        | 'quoteToken__symbol'
        | 'quoteToken__name'
        | 'quoteToken__typeName'
        | 'quoteToken__usedAsPayout'
        | 'quoteToken__usedAsQuote'
        | 'quoteToken__totalPayoutAmount'
        | 'quoteToken__purchaseCount'
        | 'network'
        | 'chainId'
        | 'tbv'
        | 'bondPurchases'
    }
    PayoutToken_filter: {
      kind: 'INPUT_OBJECT'
      name: 'PayoutToken_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PayoutToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PayoutToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    PayoutToken_orderBy: { name: 'PayoutToken_orderBy'; enumValues: 'id' }
    PurchaseCount: {
      kind: 'OBJECT'
      name: 'PurchaseCount'
      fields: {
        count: {
          name: 'count'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    PurchaseCount_filter: {
      kind: 'INPUT_OBJECT'
      name: 'PurchaseCount_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_in'
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
          name: 'count_not_in'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PurchaseCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'PurchaseCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    PurchaseCount_orderBy: {
      name: 'PurchaseCount_orderBy'
      enumValues: 'id' | 'count'
    }
    Query: {
      kind: 'OBJECT'
      name: 'Query'
      fields: {
        _meta: {
          name: '_meta'
          type: { kind: 'OBJECT'; name: '_Meta_'; ofType: null }
        }
        balancerWeightedPool: {
          name: 'balancerWeightedPool'
          type: { kind: 'OBJECT'; name: 'BalancerWeightedPool'; ofType: null }
        }
        balancerWeightedPools: {
          name: 'balancerWeightedPools'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'BalancerWeightedPool'
                  ofType: null
                }
              }
            }
          }
        }
        bondPurchase: {
          name: 'bondPurchase'
          type: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
        }
        bondPurchases: {
          name: 'bondPurchases'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
              }
            }
          }
        }
        bondToken: {
          name: 'bondToken'
          type: { kind: 'OBJECT'; name: 'BondToken'; ofType: null }
        }
        bondTokens: {
          name: 'bondTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'BondToken'; ofType: null }
              }
            }
          }
        }
        market: {
          name: 'market'
          type: { kind: 'OBJECT'; name: 'Market'; ofType: null }
        }
        marketOwnerCount: {
          name: 'marketOwnerCount'
          type: { kind: 'OBJECT'; name: 'MarketOwnerCount'; ofType: null }
        }
        marketOwnerCounts: {
          name: 'marketOwnerCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'MarketOwnerCount'
                  ofType: null
                }
              }
            }
          }
        }
        markets: {
          name: 'markets'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Market'; ofType: null }
              }
            }
          }
        }
        ownerBalance: {
          name: 'ownerBalance'
          type: { kind: 'OBJECT'; name: 'OwnerBalance'; ofType: null }
        }
        ownerBalances: {
          name: 'ownerBalances'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'OwnerBalance'; ofType: null }
              }
            }
          }
        }
        ownerTokenTbv: {
          name: 'ownerTokenTbv'
          type: { kind: 'OBJECT'; name: 'OwnerTokenTbv'; ofType: null }
        }
        ownerTokenTbvs: {
          name: 'ownerTokenTbvs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'OwnerTokenTbv'; ofType: null }
              }
            }
          }
        }
        pair: {
          name: 'pair'
          type: { kind: 'OBJECT'; name: 'Pair'; ofType: null }
        }
        pairs: {
          name: 'pairs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Pair'; ofType: null }
              }
            }
          }
        }
        payoutToken: {
          name: 'payoutToken'
          type: { kind: 'OBJECT'; name: 'PayoutToken'; ofType: null }
        }
        payoutTokenTbv: {
          name: 'payoutTokenTbv'
          type: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
        }
        payoutTokenTbvs: {
          name: 'payoutTokenTbvs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
              }
            }
          }
        }
        payoutTokens: {
          name: 'payoutTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PayoutToken'; ofType: null }
              }
            }
          }
        }
        purchaseCount: {
          name: 'purchaseCount'
          type: { kind: 'OBJECT'; name: 'PurchaseCount'; ofType: null }
        }
        purchaseCounts: {
          name: 'purchaseCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PurchaseCount'; ofType: null }
              }
            }
          }
        }
        quoteToken: {
          name: 'quoteToken'
          type: { kind: 'OBJECT'; name: 'QuoteToken'; ofType: null }
        }
        quoteTokens: {
          name: 'quoteTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'QuoteToken'; ofType: null }
              }
            }
          }
        }
        token: {
          name: 'token'
          type: { kind: 'OBJECT'; name: 'Token'; ofType: null }
        }
        tokens: {
          name: 'tokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
              }
            }
          }
        }
        tune: {
          name: 'tune'
          type: { kind: 'OBJECT'; name: 'Tune'; ofType: null }
        }
        tunes: {
          name: 'tunes'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Tune'; ofType: null }
              }
            }
          }
        }
        uniqueBonder: {
          name: 'uniqueBonder'
          type: { kind: 'OBJECT'; name: 'UniqueBonder'; ofType: null }
        }
        uniqueBonderCount: {
          name: 'uniqueBonderCount'
          type: { kind: 'OBJECT'; name: 'UniqueBonderCount'; ofType: null }
        }
        uniqueBonderCounts: {
          name: 'uniqueBonderCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueBonderCount'
                  ofType: null
                }
              }
            }
          }
        }
        uniqueBonders: {
          name: 'uniqueBonders'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'UniqueBonder'; ofType: null }
              }
            }
          }
        }
        uniqueTokenBonder: {
          name: 'uniqueTokenBonder'
          type: { kind: 'OBJECT'; name: 'UniqueTokenBonder'; ofType: null }
        }
        uniqueTokenBonderCount: {
          name: 'uniqueTokenBonderCount'
          type: { kind: 'OBJECT'; name: 'UniqueTokenBonderCount'; ofType: null }
        }
        uniqueTokenBonderCounts: {
          name: 'uniqueTokenBonderCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueTokenBonderCount'
                  ofType: null
                }
              }
            }
          }
        }
        uniqueTokenBonders: {
          name: 'uniqueTokenBonders'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueTokenBonder'
                  ofType: null
                }
              }
            }
          }
        }
      }
    }
    QuoteToken: {
      kind: 'OBJECT'
      name: 'QuoteToken'
      fields: {
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    QuoteToken_filter: {
      kind: 'INPUT_OBJECT'
      name: 'QuoteToken_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'QuoteToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'QuoteToken_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    QuoteToken_orderBy: { name: 'QuoteToken_orderBy'; enumValues: 'id' }
    String: unknown
    Subscription: {
      kind: 'OBJECT'
      name: 'Subscription'
      fields: {
        _meta: {
          name: '_meta'
          type: { kind: 'OBJECT'; name: '_Meta_'; ofType: null }
        }
        balancerWeightedPool: {
          name: 'balancerWeightedPool'
          type: { kind: 'OBJECT'; name: 'BalancerWeightedPool'; ofType: null }
        }
        balancerWeightedPools: {
          name: 'balancerWeightedPools'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'BalancerWeightedPool'
                  ofType: null
                }
              }
            }
          }
        }
        bondPurchase: {
          name: 'bondPurchase'
          type: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
        }
        bondPurchases: {
          name: 'bondPurchases'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'BondPurchase'; ofType: null }
              }
            }
          }
        }
        bondToken: {
          name: 'bondToken'
          type: { kind: 'OBJECT'; name: 'BondToken'; ofType: null }
        }
        bondTokens: {
          name: 'bondTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'BondToken'; ofType: null }
              }
            }
          }
        }
        market: {
          name: 'market'
          type: { kind: 'OBJECT'; name: 'Market'; ofType: null }
        }
        marketOwnerCount: {
          name: 'marketOwnerCount'
          type: { kind: 'OBJECT'; name: 'MarketOwnerCount'; ofType: null }
        }
        marketOwnerCounts: {
          name: 'marketOwnerCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'MarketOwnerCount'
                  ofType: null
                }
              }
            }
          }
        }
        markets: {
          name: 'markets'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Market'; ofType: null }
              }
            }
          }
        }
        ownerBalance: {
          name: 'ownerBalance'
          type: { kind: 'OBJECT'; name: 'OwnerBalance'; ofType: null }
        }
        ownerBalances: {
          name: 'ownerBalances'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'OwnerBalance'; ofType: null }
              }
            }
          }
        }
        ownerTokenTbv: {
          name: 'ownerTokenTbv'
          type: { kind: 'OBJECT'; name: 'OwnerTokenTbv'; ofType: null }
        }
        ownerTokenTbvs: {
          name: 'ownerTokenTbvs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'OwnerTokenTbv'; ofType: null }
              }
            }
          }
        }
        pair: {
          name: 'pair'
          type: { kind: 'OBJECT'; name: 'Pair'; ofType: null }
        }
        pairs: {
          name: 'pairs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Pair'; ofType: null }
              }
            }
          }
        }
        payoutToken: {
          name: 'payoutToken'
          type: { kind: 'OBJECT'; name: 'PayoutToken'; ofType: null }
        }
        payoutTokenTbv: {
          name: 'payoutTokenTbv'
          type: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
        }
        payoutTokenTbvs: {
          name: 'payoutTokenTbvs'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
              }
            }
          }
        }
        payoutTokens: {
          name: 'payoutTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PayoutToken'; ofType: null }
              }
            }
          }
        }
        purchaseCount: {
          name: 'purchaseCount'
          type: { kind: 'OBJECT'; name: 'PurchaseCount'; ofType: null }
        }
        purchaseCounts: {
          name: 'purchaseCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'PurchaseCount'; ofType: null }
              }
            }
          }
        }
        quoteToken: {
          name: 'quoteToken'
          type: { kind: 'OBJECT'; name: 'QuoteToken'; ofType: null }
        }
        quoteTokens: {
          name: 'quoteTokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'QuoteToken'; ofType: null }
              }
            }
          }
        }
        token: {
          name: 'token'
          type: { kind: 'OBJECT'; name: 'Token'; ofType: null }
        }
        tokens: {
          name: 'tokens'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
              }
            }
          }
        }
        tune: {
          name: 'tune'
          type: { kind: 'OBJECT'; name: 'Tune'; ofType: null }
        }
        tunes: {
          name: 'tunes'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'Tune'; ofType: null }
              }
            }
          }
        }
        uniqueBonder: {
          name: 'uniqueBonder'
          type: { kind: 'OBJECT'; name: 'UniqueBonder'; ofType: null }
        }
        uniqueBonderCount: {
          name: 'uniqueBonderCount'
          type: { kind: 'OBJECT'; name: 'UniqueBonderCount'; ofType: null }
        }
        uniqueBonderCounts: {
          name: 'uniqueBonderCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueBonderCount'
                  ofType: null
                }
              }
            }
          }
        }
        uniqueBonders: {
          name: 'uniqueBonders'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: { kind: 'OBJECT'; name: 'UniqueBonder'; ofType: null }
              }
            }
          }
        }
        uniqueTokenBonder: {
          name: 'uniqueTokenBonder'
          type: { kind: 'OBJECT'; name: 'UniqueTokenBonder'; ofType: null }
        }
        uniqueTokenBonderCount: {
          name: 'uniqueTokenBonderCount'
          type: { kind: 'OBJECT'; name: 'UniqueTokenBonderCount'; ofType: null }
        }
        uniqueTokenBonderCounts: {
          name: 'uniqueTokenBonderCounts'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueTokenBonderCount'
                  ofType: null
                }
              }
            }
          }
        }
        uniqueTokenBonders: {
          name: 'uniqueTokenBonders'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: {
              kind: 'LIST'
              name: never
              ofType: {
                kind: 'NON_NULL'
                name: never
                ofType: {
                  kind: 'OBJECT'
                  name: 'UniqueTokenBonder'
                  ofType: null
                }
              }
            }
          }
        }
      }
    }
    Timestamp: unknown
    Token: {
      kind: 'OBJECT'
      name: 'Token'
      fields: {
        address: {
          name: 'address'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        balancerWeightedPool: {
          name: 'balancerWeightedPool'
          type: { kind: 'OBJECT'; name: 'BalancerWeightedPool'; ofType: null }
        }
        chainId: {
          name: 'chainId'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        decimals: {
          name: 'decimals'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        lpPair: {
          name: 'lpPair'
          type: { kind: 'OBJECT'; name: 'Pair'; ofType: null }
        }
        markets: {
          name: 'markets'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'Market'; ofType: null }
            }
          }
        }
        name: {
          name: 'name'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        network: {
          name: 'network'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        payoutTokenTbvs: {
          name: 'payoutTokenTbvs'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'OBJECT'; name: 'PayoutTokenTbv'; ofType: null }
            }
          }
        }
        purchaseCount: {
          name: 'purchaseCount'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        symbol: {
          name: 'symbol'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        totalPayoutAmount: {
          name: 'totalPayoutAmount'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          }
        }
        typeName: {
          name: 'typeName'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        uniqueBonders: {
          name: 'uniqueBonders'
          type: { kind: 'OBJECT'; name: 'UniqueTokenBonderCount'; ofType: null }
        }
        usedAsPayout: {
          name: 'usedAsPayout'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
        usedAsQuote: {
          name: 'usedAsQuote'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          }
        }
      }
    }
    Token_filter: {
      kind: 'INPUT_OBJECT'
      name: 'Token_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_in'
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
          name: 'network_not_in'
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
          name: 'network_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'network_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'chainId_in'
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
          name: 'chainId_not_in'
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
          name: 'address'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_in'
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
          name: 'address_not_in'
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
          name: 'address_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'address_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'decimals_in'
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
          name: 'decimals_not_in'
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
          name: 'symbol'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_in'
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
          name: 'symbol_not_in'
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
          name: 'symbol_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'symbol_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_in'
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
          name: 'name_not_in'
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
          name: 'name_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'name_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_in'
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
          name: 'typeName_not_in'
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
          name: 'typeName_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'typeName_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_in'
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
          name: 'lpPair_not_in'
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
          name: 'lpPair_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'lpPair_'
          type: { kind: 'INPUT_OBJECT'; name: 'Pair_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_in'
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
          name: 'balancerWeightedPool_not_in'
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
          name: 'balancerWeightedPool_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'balancerWeightedPool_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'BalancerWeightedPool_filter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'usedAsPayout'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'usedAsPayout_not'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'usedAsPayout_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'usedAsPayout_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'usedAsQuote'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'usedAsQuote_not'
          type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
          defaultValue: null
        },
        {
          name: 'usedAsQuote_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'usedAsQuote_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_not'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_gt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_lt'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_gte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_lte'
          type: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'totalPayoutAmount_not_in'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'NON_NULL'
              name: never
              ofType: { kind: 'SCALAR'; name: 'BigDecimal'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'purchaseCount'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'purchaseCount_in'
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
          name: 'purchaseCount_not_in'
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
          name: 'payoutTokenTbvs_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'PayoutTokenTbv_filter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'uniqueBonders_'
          type: {
            kind: 'INPUT_OBJECT'
            name: 'UniqueTokenBonderCount_filter'
            ofType: null
          }
          defaultValue: null
        },
        {
          name: 'markets_'
          type: { kind: 'INPUT_OBJECT'; name: 'Market_filter'; ofType: null }
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
            ofType: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          }
          defaultValue: null
        },
      ]
    }
    Token_orderBy: {
      name: 'Token_orderBy'
      enumValues:
        | 'id'
        | 'network'
        | 'chainId'
        | 'address'
        | 'decimals'
        | 'symbol'
        | 'name'
        | 'typeName'
        | 'lpPair'
        | 'lpPair__id'
        | 'balancerWeightedPool'
        | 'balancerWeightedPool__id'
        | 'balancerWeightedPool__vaultAddress'
        | 'balancerWeightedPool__poolId'
        | 'usedAsPayout'
        | 'usedAsQuote'
        | 'totalPayoutAmount'
        | 'purchaseCount'
        | 'payoutTokenTbvs'
        | 'uniqueBonders'
        | 'uniqueBonders__id'
        | 'uniqueBonders__count'
        | 'markets'
    }
    Tune: {
      kind: 'OBJECT'
      name: 'Tune'
      fields: {
        deltaTime: {
          name: 'deltaTime'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        market: {
          name: 'market'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Market'; ofType: null }
          }
        }
        newControlVariable: {
          name: 'newControlVariable'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        oldControlVariable: {
          name: 'oldControlVariable'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        timestamp: {
          name: 'timestamp'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
      }
    }
    Tune_filter: {
      kind: 'INPUT_OBJECT'
      name: 'Tune_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_in'
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
          name: 'market_not_in'
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
          name: 'market_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'market_'
          type: { kind: 'INPUT_OBJECT'; name: 'Market_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'oldControlVariable_in'
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
          name: 'oldControlVariable_not_in'
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
          name: 'newControlVariable'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'newControlVariable_in'
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
          name: 'newControlVariable_not_in'
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
          name: 'deltaTime'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'deltaTime_in'
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
          name: 'deltaTime_not_in'
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
            ofType: { kind: 'INPUT_OBJECT'; name: 'Tune_filter'; ofType: null }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: { kind: 'INPUT_OBJECT'; name: 'Tune_filter'; ofType: null }
          }
          defaultValue: null
        },
      ]
    }
    Tune_orderBy: {
      name: 'Tune_orderBy'
      enumValues:
        | 'id'
        | 'market'
        | 'market__id'
        | 'market__name'
        | 'market__type'
        | 'market__network'
        | 'market__chainId'
        | 'market__auctioneer'
        | 'market__teller'
        | 'market__marketId'
        | 'market__owner'
        | 'market__vesting'
        | 'market__start'
        | 'market__conclusion'
        | 'market__vestingType'
        | 'market__isInstantSwap'
        | 'market__hasClosed'
        | 'market__totalBondedAmount'
        | 'market__totalPayoutAmount'
        | 'market__creationBlockTimestamp'
        | 'market__callbackAddress'
        | 'market__capacity'
        | 'market__capacityInQuote'
        | 'market__minPrice'
        | 'market__price'
        | 'market__scale'
        | 'market__averageBondPrice'
        | 'market__bondsIssued'
        | 'oldControlVariable'
        | 'newControlVariable'
        | 'deltaTime'
        | 'timestamp'
    }
    UniqueBonder: {
      kind: 'OBJECT'
      name: 'UniqueBonder'
      fields: {
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    UniqueBonderCount: {
      kind: 'OBJECT'
      name: 'UniqueBonderCount'
      fields: {
        count: {
          name: 'count'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    UniqueBonderCount_filter: {
      kind: 'INPUT_OBJECT'
      name: 'UniqueBonderCount_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_in'
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
          name: 'count_not_in'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueBonderCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueBonderCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    UniqueBonderCount_orderBy: {
      name: 'UniqueBonderCount_orderBy'
      enumValues: 'id' | 'count'
    }
    UniqueBonder_filter: {
      kind: 'INPUT_OBJECT'
      name: 'UniqueBonder_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueBonder_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueBonder_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    UniqueBonder_orderBy: { name: 'UniqueBonder_orderBy'; enumValues: 'id' }
    UniqueTokenBonder: {
      kind: 'OBJECT'
      name: 'UniqueTokenBonder'
      fields: {
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
      }
    }
    UniqueTokenBonderCount: {
      kind: 'OBJECT'
      name: 'UniqueTokenBonderCount'
      fields: {
        count: {
          name: 'count'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          }
        }
        id: {
          name: 'id'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
          }
        }
        token: {
          name: 'token'
          type: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'OBJECT'; name: 'Token'; ofType: null }
          }
        }
      }
    }
    UniqueTokenBonderCount_filter: {
      kind: 'INPUT_OBJECT'
      name: 'UniqueTokenBonderCount_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_in'
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
          name: 'token_not_in'
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
          name: 'token_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_not_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'token_'
          type: { kind: 'INPUT_OBJECT'; name: 'Token_filter'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_not'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lt'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_gte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_lte'
          type: { kind: 'SCALAR'; name: 'BigInt'; ofType: null }
          defaultValue: null
        },
        {
          name: 'count_in'
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
          name: 'count_not_in'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueTokenBonderCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueTokenBonderCount_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    UniqueTokenBonderCount_orderBy: {
      name: 'UniqueTokenBonderCount_orderBy'
      enumValues:
        | 'id'
        | 'token'
        | 'token__id'
        | 'token__network'
        | 'token__chainId'
        | 'token__address'
        | 'token__decimals'
        | 'token__symbol'
        | 'token__name'
        | 'token__typeName'
        | 'token__usedAsPayout'
        | 'token__usedAsQuote'
        | 'token__totalPayoutAmount'
        | 'token__purchaseCount'
        | 'count'
    }
    UniqueTokenBonder_filter: {
      kind: 'INPUT_OBJECT'
      name: 'UniqueTokenBonder_filter'
      isOneOf: false
      inputFields: [
        {
          name: 'id'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lt'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_gte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_lte'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
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
              ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
            }
          }
          defaultValue: null
        },
        {
          name: 'id_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_contains_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_starts_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_ends_with_nocase'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with'
          type: { kind: 'SCALAR'; name: 'String'; ofType: null }
          defaultValue: null
        },
        {
          name: 'id_not_ends_with_nocase'
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
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueTokenBonder_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
        {
          name: 'or'
          type: {
            kind: 'LIST'
            name: never
            ofType: {
              kind: 'INPUT_OBJECT'
              name: 'UniqueTokenBonder_filter'
              ofType: null
            }
          }
          defaultValue: null
        },
      ]
    }
    UniqueTokenBonder_orderBy: {
      name: 'UniqueTokenBonder_orderBy'
      enumValues: 'id'
    }
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
