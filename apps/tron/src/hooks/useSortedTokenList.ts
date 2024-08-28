import { useDebounce } from "@sushiswap/hooks";
import { useQuery } from "@tanstack/react-query";
import { IToken } from "src/types/token-type";
import { filterTokens, getSortedTokensByQuery, tokenComparator } from "src/utils/token-search-helpers";

type TokenListParams = {
	query: string;
	tokenMap: Record<string, IToken> | undefined;
	customTokenMap: Record<string, IToken> | undefined;
};

export const useSortedTokenList = ({ query, tokenMap, customTokenMap }: TokenListParams) => {
	const debouncedQuery = useDebounce(query, 250);
	return useQuery({
		queryKey: ["sortedTokenList", { debouncedQuery, tokenMap, customTokenMap }],
		queryFn: async () => {
			const tokenMapValues = tokenMap ? Object.values(tokenMap) : [];
			const customTokenMapValues = customTokenMap ? Object.values(customTokenMap) : [];
			const filteredTokens: IToken[] = filterTokens(tokenMapValues, debouncedQuery);
			const filteredCustomTokens: IToken[] = filterTokens(customTokenMapValues, debouncedQuery);
			// const sortedTokens
			const sortedTokens: IToken[] = [...filteredTokens, ...filteredCustomTokens].sort(tokenComparator());
			const filteredSortedTokens = getSortedTokensByQuery(sortedTokens, debouncedQuery);
			return filteredSortedTokens;
		},
		keepPreviousData: false,
	});
};
