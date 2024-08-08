import { initGraphQLTada } from 'gql.tada'
import type { Scalars } from 'src/lib/types/scalars.js'
import type { introspection } from './sushi-v3-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: Scalars
}>()
