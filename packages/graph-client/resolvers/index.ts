import { mergeResolvers } from '@graphql-tools/merge'

import { Resolvers } from '../.graphclient'
import { resolvers as bentobox } from './bentobox'
import { resolvers as blocks } from './blocks'
import { resolvers as bundles } from './bundles'
import { resolvers as deprecated } from './depreciated'
import { resolvers as factories } from './factories'
import { resolvers as liquidityPositions } from './liquidity-positions'
import { resolvers as masterchef } from './masterchef'
import { resolvers as pairs } from './pairs'
import { resolvers as tokens } from './tokens'
import { resolvers as user } from './user'

// export const resolvers: Resolvers = mergeResolvers<MeshResolvedSource, MeshContext>([
export const resolvers: Resolvers = mergeResolvers([
  bentobox,
  blocks,
  bundles,
  deprecated,
  factories,
  liquidityPositions,
  masterchef,
  pairs,
  tokens,
  user,
])
