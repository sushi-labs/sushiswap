import { ConnectButton } from "src/lib/wagmi/components/connect-button";
import { formatUSD } from "sushi";
import { useAccount } from "wagmi";
import { classNames, Currency } from "@sushiswap/ui";
import { Token } from "sushi/currency";
import { useState } from "react";
import { Button } from "@sushiswap/ui";
import { NetworkIcon } from "../../../../../../../packages/ui/src/icons/NetworkIcon";
import { ArrowRightIcon } from "@heroicons/react-v1/solid";

export const Recent = () => {
	const { address } = useAccount();

	if (!address) {
		return <ConnectButton className="w-full" variant="secondary" />;
	}

	// if(recents.length === 0) {
	// return (

	// 		<p className="italic text-sm text-muted-foreground mt-8 dark:text-pink-200">
	// 			You haven&apos;t traded any tokens so far.
	// 		</p>
	// );
	// }

	return (
		<table className="w-full">
			<thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800">
				<tr className="text-xs text-slate-700 dark:text-pink-100">
					<th className="pl-2 text-left font-medium">Token Pair</th>
					<th className="text-left whitespace-nowrap font-medium">Amount Traded</th>
					<th className="pr-2 text-right font-medium">PnL</th>
				</tr>
			</thead>
			<tbody className="px-4">
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
				<RecentItem />
			</tbody>
		</table>
	);
};

const RecentItem = () => {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<tr
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={classNames("text-xs px-2 transition-colors", isHovered ? "bg-blue-500/10" : "")}>
			<td className="py-2 pl-2 w-1/2 rounded-l-md">
				<div className="flex items-center gap-2">
					<Currency.IconList iconWidth={32} iconHeight={32}>
						<Currency.Icon
							disableLink
							currency={
								new Token({
									address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
									name: "Wrapped Ethereum",
									symbol: "ETH",
									chainId: 1,
									decimals: 18,
								})
							}
							width={32}
							height={32}
						/>
						<Currency.Icon
							disableLink
							currency={
								new Token({
									address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
									name: "USD Coin",
									symbol: "USDC",
									chainId: 1,
									decimals: 6,
								})
							}
							width={32}
							height={32}
						/>
					</Currency.IconList>

					<span className="text-slate-900 text-sm font-medium dark:text-pink-100">ETH/USDC</span>

					{isHovered ? (
						<div className="flex items-center">
							<span>(</span>
							<NetworkIcon chainId={1} width={16} height={16} />
							<ArrowRightIcon className="w-3 h-3 mx-1 text-slate-500" />
							<NetworkIcon chainId={56} width={16} height={16} />
							<span>)</span>
						</div>
					) : null}
				</div>
			</td>
			{isHovered ? (
				<>
					<td className="w-full">
						<div className="flex items-center justify-end">
							<Button
								size="xs"
								className="text-slate-50 w-full md:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500">
								BUY ETH
							</Button>
						</div>
					</td>
					<td className="rounded-r-md">
						<div className="px-2">
							<Button
								size="xs"
								className="text-slate-50 w-full md:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500">
								SELL ETH
							</Button>
						</div>
					</td>
				</>
			) : (
				<>
					<td className="text-left">
						<span className="text-slate-900 font-medium dark:text-pink-100">{formatUSD(0.87)}</span>
					</td>
					<td className="text-right pr-2 rounded-r-md">
						<span className="font-medium text-green">+5.5%</span>
					</td>
				</>
			)}
		</tr>
	);
};
