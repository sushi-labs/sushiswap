import { formatPercent } from "sushi/format";
import { useDayVolumeUSD } from "~tron/_common/lib/hooks/useOneDayApr";
import { usePoolOwnership } from "~tron/_common/lib/hooks/usePoolOwnership";
import { FEE_PERCENTAGE } from "~tron/_common/constants/fee-percentage";
import { useLPUsdValue } from "~tron/_common/lib/hooks/useLPUsdValue";
import { IPositionRowData } from "./PositionsTable";
import { useMemo } from "react";
import { SkeletonText } from "@sushiswap/ui";

export const PositionAprCell = ({ data }: { data: IPositionRowData }) => {
	const { pairAddress, token0, token1, reserve0, reserve1 } = data;
	const { data: ownership, isLoading: isLoadingOwnership } = usePoolOwnership({ pairAddress });
	const ownedLp = Number(ownership?.ownership) ?? 0;
	const ownedLpTokens = Number(ownership?.ownedSupply) ?? 0;
	const { data: dayVolumeUSD, isLoading: isLoadingDVol } = useDayVolumeUSD({ pairAddress });
	const { data: totalLPUsdValue, isLoading: isLoadingLPV } = useLPUsdValue({
		token0,
		token1,
		reserve0,
		reserve1,
	});

	const apr = useMemo(() => {
		const totalDailyFees = Number(FEE_PERCENTAGE) * Number(dayVolumeUSD ?? 0);
		const annualizedFees = totalDailyFees * 365;
		const userAnnualEarnings = annualizedFees * ownedLp;
		const userLiquidityValue = ownedLpTokens * (totalLPUsdValue ?? 0);
		const _apr = userAnnualEarnings / userLiquidityValue;
		return Number.isNaN(_apr) ? 0 : _apr;
	}, [dayVolumeUSD, totalLPUsdValue, ownedLp, ownedLpTokens]);

	if (isLoadingLPV || isLoadingDVol || isLoadingOwnership) {
		return <SkeletonText fontSize="lg" />;
	}

	return (
		<div className="flex items-center gap-1">
			<div className="flex flex-col gap-0.5">
				<span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
					{formatPercent(apr)}
				</span>
			</div>
		</div>
	);
};
