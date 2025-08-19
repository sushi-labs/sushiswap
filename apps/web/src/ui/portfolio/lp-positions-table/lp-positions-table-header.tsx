import { LPPositionsTableFilters } from "./lp-positions-table-filter";
import { TotalClaimableRewards } from "./total-claimable-rewards";
import { TotalLPPositions } from "./total-lp-positions";

export const LPPositionsTableHeader = () => {
	return (
		<div className="px-4 py-6 border-b border-accent gap-4 flex flex-wrap flex-col md:flex-row md:items-center justify-between">
			<div className="flex items-center gap-2">
				<TotalLPPositions />
				<TotalClaimableRewards />
			</div>
			<LPPositionsTableFilters />
		</div>
	);
};
