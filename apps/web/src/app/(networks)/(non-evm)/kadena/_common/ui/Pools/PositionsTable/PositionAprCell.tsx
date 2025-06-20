import { formatPercent } from "sushi/format";
import type { WalletPosition } from "~kadena/_common/types/get-positions";

export const PositionAprCell = ({ data }: { data: WalletPosition }) => {
	return (
		<div className="flex items-center gap-1">
			<div className="flex flex-col gap-0.5">
				<span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
					{formatPercent(Number(data?.apr24h ?? 0) / 100)}
				</span>
			</div>
		</div>
	);
};
