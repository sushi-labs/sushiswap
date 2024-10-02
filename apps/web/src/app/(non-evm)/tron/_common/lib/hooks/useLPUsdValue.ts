import { useQuery } from "@tanstack/react-query";
import { IToken } from "~tron/_common/types/token-type";
import { useStablePrice } from "~tron/_common/lib/hooks/useStablePrice";

export const useLPUsdValue = ({
	token0,
	token1,
	reserve0,
	reserve1,
}: {
	token0: IToken;
	token1: IToken;
	reserve0: string;
	reserve1: string;
}) => {
	const { data: token0Price } = useStablePrice({ token: token0 });
	const { data: token1Price } = useStablePrice({ token: token1 });
	return useQuery({
		queryKey: ["useLPUsdValue", token0, token1, reserve0, reserve1, token0Price, token1Price],
		queryFn: async () => {
			const reserve0Usd = (Number(token0Price) ?? 0) * (Number(reserve0) / 10 ** token0?.decimals);
			const reserve1Usd = (Number(token1Price) ?? 0) * (Number(reserve1) / 10 ** token1?.decimals);
			const totalUSD = reserve0Usd + reserve1Usd;
			return totalUSD ?? 0;
		},
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		enabled: !!token0 && !!token1 && !!reserve0 && !!reserve1,
	});
};
