import { mergeResolvers } from '@graphql-tools/merge'

import { Resolvers } from '../.graphclient'
import { resolvers as blocks } from './blocks'

// export const resolvers: Resolvers = mergeResolvers<MeshResolvedSource, MeshContext>([
export const resolvers: Resolvers = mergeResolvers([blocks])
