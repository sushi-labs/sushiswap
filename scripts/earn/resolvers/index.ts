import { mergeResolvers } from '@graphql-tools/merge'

import { Resolvers } from '../.graphclient/index.js'
import { resolvers as blocks } from './blocks/index.js'

// export const resolvers: Resolvers = mergeResolvers<MeshResolvedSource, MeshContext>([
export const resolvers: Resolvers = mergeResolvers([blocks])
