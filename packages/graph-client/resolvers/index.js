import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as bentobox } from './bentobox/index.js';
import { resolvers as blocks } from './blocks/index.js';
import { resolvers as bundles } from './bundles/index.js';
import { resolvers as concentrated } from './concentrated/index.js';
import { resolvers as deprecated } from './depreciated/index.js';
import { resolvers as factories } from './factories/index.js';
import { resolvers as furo } from './furo/index.js';
import { resolvers as graphnode } from './graphnode/index.js';
import { resolvers as liquidityPositions } from './liquidity-positions/index.js';
import { resolvers as masterchef } from './masterchef/index.js';
import { resolvers as pairs } from './pairs/index.js';
import { resolvers as tokens } from './tokens/index.js';
import { resolvers as user } from './user/index.js';
// export const resolvers: Resolvers = mergeResolvers<MeshResolvedSource, MeshContext>([
export const resolvers = mergeResolvers([
    bentobox,
    blocks,
    bundles,
    concentrated,
    deprecated,
    factories,
    liquidityPositions,
    masterchef,
    pairs,
    tokens,
    user,
    furo,
    graphnode,
]);
//# sourceMappingURL=index.js.map