import { initGraphQLTada } from 'gql.tada'
import type { Scalars } from 'src/scalars.js'
import type { introspection } from './sushi-v2-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: Scalars
}>()
