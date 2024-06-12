import { SUSHISWAP_SUBGRAPH_URL, SUSHISWAP_V3_SUBGRAPH_URL, TRIDENT_SUBGRAPH_URL, isSushiSwapChain, isSushiSwapV3Chain, isTridentChain, } from '@sushiswap/graph-config';
import { chainName, chainShortName } from 'sushi/chain';
import { getBuiltGraphSDK, } from '../../.graphclient/index.js';
import { isPromiseFulfilled } from 'sushi/validate';
const transformV3DayToSnapshot = (days, chainId) => days.map((day) => ({
    chainId: chainId,
    id: day.id,
    date: day.date,
    volumeNative: day.volumeETH,
    volumeUSD: day.volumeUSD,
    untrackedVolumeUSD: day.volumeUSDUntracked,
    liquidityNative: 0,
    liquidityUSD: day.tvlUSD,
    feesNative: 0,
    feesUSD: day.feesUSD,
    transactionCount: day.txCount,
    factory: null,
}));
export const factoryDaySnapshotsByChainIds = async (root, args, context, info) => {
    const fetchTridentSnapshots = async (chainId) => {
        const snapshots = await context.Trident.Query.factoryDaySnapshots({
            root,
            args,
            context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                url: TRIDENT_SUBGRAPH_URL[chainId],
            },
            info,
        });
        return (snapshots?.map((snapshot) => ({
            ...snapshot,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
        })) || []);
    };
    const fetchSushiSwapV2Snapshots = async (chainId) => {
        const snapshots = await context.SushiSwap.Query.factoryDaySnapshots({
            root,
            args,
            context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                url: SUSHISWAP_SUBGRAPH_URL[chainId],
            },
            info,
        });
        return (snapshots?.map((snapshot) => ({
            ...snapshot,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
        })) || []);
    };
    const fetchSushiSwapV3Snapshots = async (chainId) => {
        const sdk = getBuiltGraphSDK({
            url: SUSHISWAP_V3_SUBGRAPH_URL[chainId]
        });
        const { uniswapDayDatas } = await sdk.SushiSwapV3DayDatas({
            first: args.first,
            skip: args.skip,
            orderBy: args.orderBy === 'liquidityUSD' ? 'tvlUSD' : 'date',
            orderDirection: args.orderDirection,
        });
        return transformV3DayToSnapshot(uniswapDayDatas, chainId);
    };
    const queries = args.chainIds.flatMap((chainId) => {
        const queries = [];
        if (isTridentChain(chainId)) {
            queries.push(fetchTridentSnapshots(chainId));
        }
        if (isSushiSwapChain(chainId)) {
            queries.push(fetchSushiSwapV2Snapshots(chainId));
        }
        if (isSushiSwapV3Chain(chainId)) {
            queries.push(fetchSushiSwapV3Snapshots(chainId));
        }
        return queries;
    });
    return Promise.allSettled(queries).then((snapshots) => snapshots
        .filter(isPromiseFulfilled)
        .map((snapshot) => snapshot.value)
        .flat());
};
//# sourceMappingURL=factoryDaySnapshotsByChainIds.js.map