import { TokenListV2ChainIds } from "@sushiswap/graph-client/data-api";
import { useMemo } from "react";
import { useRecentSwaps } from "src/lib/hooks/react-query/recent-swaps/useRecentsSwaps";
import { type EvmCurrency, EvmToken } from "sushi/evm";
import type { Address } from "viem";

const allowedSymbols = ["USDC", "USDT", "DAI"];

const validChainIds = [...TokenListV2ChainIds];

export const useQuickSelectTokens = ({
	account,
	optionCount = 3,
}: {
	account: Address | undefined;
	optionCount?: 1 | 2 | 3;
}) => {
	const { data: recentSwaps, isLoading: isRecentSwapsLoading } = useRecentSwaps({
		walletAddress: account,
		chainIds: validChainIds,
	});

	const mostSwappedStableTokens = useMemo(() => {
		if (!recentSwaps || recentSwaps.length === 0) return [];
		//filter out default tokens from recent swaps so no duplicates of default tokens
		const filteredSwaps = recentSwaps.filter((swap) => {
			const tokenOut = swap.tokenOut;
			return allowedSymbols.includes(tokenOut.symbol);
		});
		if (filteredSwaps.length === 0) return [];
		const groupedTokens = new Map<string, EvmCurrency[]>();
		filteredSwaps.forEach((swap) => {
			const token = swap.tokenOut;
			if (!groupedTokens.has(token?.symbol)) {
				groupedTokens.set(token.symbol, []);
			}
			if (validChainIds.includes(token.chainId)) {
				groupedTokens.get(token.symbol)?.push(
					new EvmToken({
						chainId: token.chainId,
						address: token.address,
						decimals: token.decimals,
						symbol: token.symbol,
						name: token.name,
					})
				);
			}
		});

		const orderedTokensBySymbolPriority = allowedSymbols
			.map(
				(symbol, idx) => groupedTokens.get(symbol) ?? groupedTokens.values().find((_, index) => idx === index)
			)
			.filter((tokens): tokens is EvmCurrency[] => !!tokens);

		return orderedTokensBySymbolPriority;
	}, [recentSwaps]);

	const quickSelectTokens = useMemo(() => {
		if (!mostSwappedStableTokens || mostSwappedStableTokens.length === 0) {
			return [];
		}

		if (mostSwappedStableTokens.length > optionCount) {
			return mostSwappedStableTokens.slice(0, optionCount);
		}

		return mostSwappedStableTokens;
	}, [mostSwappedStableTokens, optionCount]);

	const isLoading = isRecentSwapsLoading;

	return {
		quickSelectTokens,
		isLoading,
	};
};
