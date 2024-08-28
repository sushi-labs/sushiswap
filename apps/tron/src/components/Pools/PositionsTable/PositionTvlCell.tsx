import { formatUSD } from "sushi/format";
import { useStablePrice } from "src/hooks/useStablePrice";
import { SkeletonText } from "@sushiswap/ui";
import { IPositionRowData } from "./PositionsTable";
import { usePoolOwnership } from "src/hooks/usePoolOwnership";

export const PositionTvlCell = ({ data }: { data: IPositionRowData }) => {
	const { token0, token1, reserve0, reserve1, pairAddress } = data;
	const { data: ownership } = usePoolOwnership({ pairAddress });

	const { data: token0Price, isLoading: isLoadingToken0Price } = useStablePrice({ token: token0 });
	const { data: token1Price, isLoading: isLoadingToken1Price } = useStablePrice({ token: token1 });

	if (isLoadingToken0Price || isLoadingToken1Price) {
		return <SkeletonText fontSize="lg" />;
	}

	const reserve0Usd = (Number(token0Price) ?? 0) * (Number(reserve0) / 10 ** token0?.decimals);
	const reserve1Usd = (Number(token1Price) ?? 0) * (Number(reserve1) / 10 ** token1?.decimals);

	const poolTvl = (reserve0Usd + reserve1Usd) * (Number(ownership?.ownership) ?? 0);

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
