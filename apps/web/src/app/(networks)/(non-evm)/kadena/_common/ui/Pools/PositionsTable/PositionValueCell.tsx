import { formatUSD } from "sushi/format";
import { WalletPosition } from "~kadena/_common/types/get-positions";

export const PositionValueCell = ({ data }: { data: WalletPosition }) => {
	const tvl = data?.valueUsd ?? 0;

	return (
		<div className="flex items-center gap-1">
			<div className="flex flex-col gap-0.5">
				<span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
					{formatUSD(tvl)}
				</span>
			</div>
		</div>
	);
};
