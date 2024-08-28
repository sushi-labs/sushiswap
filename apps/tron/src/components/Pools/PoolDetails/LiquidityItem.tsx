import { CardItem } from "@sushiswap/ui";
import { Icon } from "src/components/General/Icon";
import { IToken } from "src/types/token-type";
import { formatUnits } from "src/utils/formatters";
import { formatNumber, formatUSD } from "sushi/format";

export const LiquidityItem = ({
	isLoading,
	token,
	amount,
	usdAmount,
}: {
	isLoading: boolean;
	token: IToken | undefined;
	amount: string;
	usdAmount: string;
}) => {
	if (isLoading || !token) {
		return <CardItem skeleton={true} />;
	}
	return (
		<CardItem
			title={
				<div className="font-medium flex items-center gap-2 text-muted-foreground">
					<Icon currency={token} width={18} height={18} />
					{token?.symbol}
				</div>
			}>
			<span className="flex gap-1 font-semibold">
				{formatNumber(formatUnits(amount ?? "", token?.decimals ?? 0, 4))}{" "}
				<span className="font-normal text-gray-400 dark:text-slate-600">{formatUSD(usdAmount)}</span>
			</span>
		</CardItem>
	);
};
