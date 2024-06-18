import { BENTOBOX_SUBGRAPH_URL } from '@sushiswap/graph-config';
import { ChainId } from 'sushi/chain';
export const crossChainBentoBoxKpis = async (root, args, context, info) => {
    const supportedChainIds = args.chainIds
        .filter((chainId) => chainId in BENTOBOX_SUBGRAPH_URL)
        // Kava subgraph doesn't have the bentoBoxKpis query
        .filter((chainId) => chainId !== ChainId.KAVA);
    const kpis = await Promise.all(supportedChainIds.map((chainId) => context.BentoBox.Query.bentoBoxKpis({
        root,
        args,
        context: {
            ...context,
            chainId,
            url: BENTOBOX_SUBGRAPH_URL[chainId],
        },
        info,
    }).then((kpis) => {
        // We send chainId here so we can take it in the resolver above
        console.log(kpis, chainId);
        return kpis.map((kpi) => ({
            ...kpi,
            chainId,
        }));
    })));
    return kpis.flat();
};
//# sourceMappingURL=crossChainBentoBoxKpis.js.map