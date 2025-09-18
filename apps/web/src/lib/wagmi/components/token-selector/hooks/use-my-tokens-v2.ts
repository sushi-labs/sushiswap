import {
	type TokenListBalanceV2,
	type TokenListV2ChainId,
	getTokenListBalancesV2,
	isTokenListV2ChainId,
} from "@sushiswap/graph-client/data-api";
import { useCustomTokens } from "@sushiswap/hooks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { NativeAddress } from "src/lib/constants";
import { Amount } from "sushi";
import { type EvmChainId, type EvmCurrency, EvmNative, EvmToken } from "sushi/evm";
import type { Address } from "viem";

interface UseMyTokensV2 {
	chainIds: TokenListV2ChainId[] | undefined;
	account?: Address;
	includeNative?: boolean;
}

export function useMyTokensV2({ chainIds, account, includeNative }: UseMyTokensV2) {
	const { data } = useCustomTokens();

	const customTokens = useMemo(() => {
		if (!chainIds) return [];
		return Object.values(data)
			.filter((token) => isTokenListV2ChainId(token.chainId) && chainIds.includes(token.chainId))
			.map((token) => ({
				address: token.address,
				chainId: token.chainId as TokenListV2ChainId,
			}));
	}, [chainIds, data]);

	const query = useQuery({
		queryKey: ["data-api-token-list-balances-v2", { chainIds, customTokens, includeNative, account }],
		queryFn: async () => {
			if (!account) throw new Error("Account is required");
			if (!chainIds) throw new Error("ChainIds are required");

			if (process.env.NEXT_PUBLIC_APP_ENV === "test") {
				const _chainId = +process.env.NEXT_PUBLIC_CHAIN_ID! as EvmChainId;
				const _native = EvmNative.fromChainId(_chainId);
				return [
					{
						bridgeInfo: null,
						symbol: _native.symbol,
						priceUSD: 0,
						priceChange1d: 0,
						name: _native.name,
						decimals: _native.decimals,
						chainId: _chainId,
						balanceUSD: 0,
						balance: new Amount(_native, "10000000000000000000000").amount,
						approved: true,
						address: NativeAddress,
						id: _native.id,
					},
				];
			}

			const data = await getTokenListBalancesV2({
				chainIds,
				account,
				customTokens,
				includeNative,
			});
			const tokens = data?.map((token) => {
				if (token.chainId === 137 && token.address === "0x0000000000000000000000000000000000001010") {
					return {
						...token,
						address: NativeAddress,
					};
				}

				return token;
			});
			return tokens;
		},
		enabled: Boolean(account && chainIds),
	});

	return useMemo(() => {
		let tokens: EvmCurrency[] | undefined = [];
		let balanceMap: Map<string, Amount<EvmCurrency>> | undefined = undefined;
		let priceMap: Map<string, number> | undefined = undefined;
		let bridgeInfoMap: Map<string, TokenListBalanceV2["bridgeInfo"] | null> | undefined = undefined;

		if (query.data) {
			tokens = [];
			balanceMap = new Map();
			priceMap = new Map();
			bridgeInfoMap = new Map();

			query.data.forEach((token) => {
				let _token: EvmCurrency;
				// token.

				if (token.address === NativeAddress) {
					_token = EvmNative.fromChainId(token.chainId as EvmChainId);
				} else {
					_token = new EvmToken({
						chainId: token.chainId as EvmChainId,
						address: token.address,
						decimals: token.decimals,
						symbol: token.symbol,
						name: token.name,
						metadata: {
							approved: token.approved,
						},
					});
				}

				tokens!.push(_token);
				balanceMap!.set(_token.id, new Amount(_token, token.balance));
				priceMap!.set(_token.id, token.priceUSD);
				bridgeInfoMap!.set(_token.id, token?.bridgeInfo ?? null);
			});
		}

		return {
			...query,
			data: {
				tokens,
				balanceMap,
				priceMap,
				bridgeInfoMap,
			},
		};
	}, [query]);
}
