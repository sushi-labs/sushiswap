import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './kadena-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    Decimal: number
    Int: number
    String: string
    DateTime: string
  }
}>()
