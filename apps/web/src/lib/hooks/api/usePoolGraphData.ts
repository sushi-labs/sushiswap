"use client";

import {
	getV2PoolBuckets,
	getV3PoolBuckets,
	getBladePoolBuckets,
	BladePoolBuckets,
} from "@sushiswap/graph-client/data-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type Address, SushiSwapProtocol } from "sushi";
import {
	type SushiSwapV2ChainId,
	type SushiSwapV3ChainId,
	isSushiSwapV2ChainId,
	isSushiSwapV3ChainId,
	BladeChainId,
	isBladeChainId,
} from "sushi/config";

interface UsePoolGraphDataParams {
	poolAddress: Address;
	chainId: SushiSwapV2ChainId | SushiSwapV3ChainId | BladeChainId;
	protocol: SushiSwapProtocol | "BLADE";
	enabled?: boolean;
}

export const usePoolGraphData = ({
	poolAddress,
	chainId,
	protocol,
	enabled = true,
}: UsePoolGraphDataParams) => {
	return useQuery({
		queryKey: ["usePoolGraphData", { poolAddress, chainId }],
		queryFn: async () => {
			const buckets =
				protocol === SushiSwapProtocol.SUSHISWAP_V2 && isSushiSwapV2ChainId(chainId)
					? await getV2PoolBuckets({
							chainId,
							address: poolAddress,
					  })
					: protocol === SushiSwapProtocol.SUSHISWAP_V3 && isSushiSwapV3ChainId(chainId)
					? await getV3PoolBuckets({
							chainId,
							address: poolAddress,
					  })
					: protocol === "BLADE" && isBladeChainId(chainId)
					? ((await getBladePoolBuckets({
							chainId,
							address: poolAddress,
					  })) as BladePoolBuckets)
					: {
							dayBuckets: [],
							hourBuckets: [],
					  };
			return buckets;
		},
		placeholderData: keepPreviousData,
		staleTime: 0,
		gcTime: 3600, // 1hr
		enabled: Boolean(poolAddress && chainId && enabled),
	});
};
