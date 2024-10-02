import { useDebounce } from "@sushiswap/hooks";
import { useQuery } from "@tanstack/react-query";
import {
	filterTokens,
	getSortedTokensByQuery,
	tokenComparator,
} from "~tron/_common/lib/utils/token-search-helpers";
import { IToken } from "~tron/_common/types/token-type";

export type TokenWithBalance = IToken & { balance: string };

type TokenListParams = {
	query: string;
	tokenMap: Record<string, IToken> | undefined;
	customTokenMap: Record<string, IToken> | undefined;
	balanceMap?: Record<string, string>;
};

export const useSortedTokenList = ({ query, tokenMap, customTokenMap, balanceMap }: TokenListParams) => {
	const debouncedQuery = useDebounce(query, 250);
	return useQuery({
		queryKey: ["sortedTokenList", { debouncedQuery, tokenMap, customTokenMap, balanceMap }],
		queryFn: async () => {
			const tokenMapValues = tokenMap ? Object.values(tokenMap) : [];
			const customTokenMapValues = customTokenMap ? Object.values(customTokenMap) : [];
			const filteredTokens: IToken[] = filterTokens(tokenMapValues, debouncedQuery);
			const filteredCustomTokens: IToken[] = filterTokens(customTokenMapValues, debouncedQuery);
			// const sortedTokens
			const sortedTokens: IToken[] = [...filteredTokens, ...filteredCustomTokens].sort(tokenComparator());
			const filteredSortedTokens = getSortedTokensByQuery(sortedTokens, debouncedQuery);
			//add balance to token
			if (balanceMap) {
				filteredSortedTokens.forEach((token) => {
					(token as TokenWithBalance).balance = balanceMap[token.address] ?? "0";
				});
			}
			return filteredSortedTokens as TokenWithBalance[] | IToken[];
		},
	});
};
