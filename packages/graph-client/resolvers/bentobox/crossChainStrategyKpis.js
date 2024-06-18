import { BENTOBOX_SUBGRAPH_URL } from '@sushiswap/graph-config';
export const crossChainStrategyKpis = async (root, args, context, info) => {
    const supportedChainIds = args.chainIds.filter((chainId) => chainId in BENTOBOX_SUBGRAPH_URL);
    const kpis = await Promise.all(supportedChainIds.map((chainId) => context.BentoBox.Query.strategyKpis({
        root,
        args,
        context: {
            ...context,
            chainId,
            url: BENTOBOX_SUBGRAPH_URL[chainId],
        },
        info,
    }).then((kpis) => 
    // We send chainId here so we can take it in the resolver above
    kpis.map((kpi) => ({
        ...kpi,
        chainId,
    })))));
    return kpis.flat();
};
//# sourceMappingURL=crossChainStrategyKpis.js.map