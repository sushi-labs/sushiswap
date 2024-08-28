import { formatUSD } from "sushi/format";
import { IRowData } from "./PoolsTable";
import { useStablePrice } from "src/hooks/useStablePrice";
import { getBase58Address } from "src/utils/helpers";
import { useTokenInfo } from "src/hooks/useTokenInfo";
import { SkeletonText } from "@sushiswap/ui";

export const PoolTvlCell = ({ data }: { data: IRowData }) => {
	const { token0Address, token1Address, reserve0, reserve1 } = data;
	const { data: token0Data, isLoading: isLoadingToken0 } = useTokenInfo({
		tokenAddress: getBase58Address(token0Address),
	});

	const { data: token1Data, isLoading: isLoadingToken1 } = useTokenInfo({
		tokenAddress: getBase58Address(token1Address),
	});

	const { data: token0Price, isLoading: isLoadingToken0Price } = useStablePrice({ token: token0Data });
	const { data: token1Price, isLoading: isLoadingToken1Price } = useStablePrice({ token: token1Data });

	if (isLoadingToken0 || isLoadingToken1 || isLoadingToken0Price || isLoadingToken1Price) {
		return <SkeletonText fontSize="lg" />;
	}

	const reserve0Usd = (Number(token0Price) ?? 0) * (Number(reserve0) / 10 ** (token0Data?.decimals ?? 18));
	const reserve1Usd = (Number(token1Price) ?? 0) * (Number(reserve1) / 10 ** (token1Data?.decimals ?? 18));

	const poolTvl = reserve0Usd + reserve1Usd;

	return (
		<div className="flex items-center gap-1">
			<div className="flex flex-col gap-0.5">
				<span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
					{formatUSD(poolTvl)}
				</span>
			</div>
		</div>
	);
};
