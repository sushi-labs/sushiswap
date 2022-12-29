import { chainName, chainShortName } from "@sushiswap/chain";
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from "@sushiswap/graph-config";
import { GraphQLResolveInfo } from "graphql";

import {
  Query,
  QueryResolvers,
  QuerytokensByChainIdsArgs,
  Token,
} from "../../.graphclient";
import { SushiSwapTypes } from "../../.graphclient/sources/SushiSwap/types";
import { TridentTypes } from "../../.graphclient/sources/Trident/types";
import { page } from "../../lib/page";

export const _tokensByChainIds = async (
  root = {},
  args: QuerytokensByChainIdsArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
): Promise<Query["tokensByChainIds"]> => {
  // @ts-ignore
  return Promise.all<Query["tokensByChainIds"][]>([
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId: typeof TRIDENT_ENABLED_NETWORKS[number]) =>
        context.Trident.Query.tokens({
          root,
          // @ts-ignore
          args,
          context: {
            ...context,
            // @ts-ignore
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
          // @ts-ignore
        }).then((tokens: Token[]) => {
          if (!Array.isArray(tokens)) {
            console.error(`Trident tokens query failed on ${chainId}`, tokens);
            return [];
          }
          return tokens.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: "TRIDENT",
              }))
            : [];
        })
      ),
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId: typeof SUSHISWAP_ENABLED_NETWORKS[number]) =>
        context.SushiSwap.Query.tokens({
          root,
          // @ts-ignore
          args,
          context: {
            ...context,
            // @ts-ignore
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
          // @ts-ignore
        }).then((tokens: Token[]) => {
          if (!Array.isArray(tokens)) {
            console.error(
              `SushiSwap tokens query failed on ${chainId}`,
              tokens
            );
            return [];
          }

          return tokens.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: "LEGACY",
              }))
            : [];
        })
      ),
  ]).then((value) =>
    page(
      value.flat().sort((a, b) => {
        if (args.orderDirection === "asc") {
          return (
            a[args.orderBy || "liquidityUSD"] -
            b[args.orderBy || "liquidityUSD"]
          );
        } else if (args.orderDirection === "desc") {
          return (
            b[args.orderBy || "liquidityUSD"] -
            a[args.orderBy || "liquidityUSD"]
          );
        }
        return 0;
      }),
      args.pagination
    )
  );
};

export const tokensByChainIds: QueryResolvers["tokensByChainIds"] = async (
  root,
  args,
  context,
  info
) => {
  return _tokensByChainIds(root, args, context, info);
};
