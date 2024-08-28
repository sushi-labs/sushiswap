import { PlusIcon } from "@heroicons/react/24/outline";
import { useSlippageTolerance } from "@sushiswap/hooks";
import { Badge } from "@sushiswap/ui";
import { List } from "@sushiswap/ui";
import { SkeletonCircle } from "@sushiswap/ui";
import { Icon } from "../General/Icon";
import { Dialog, DialogClose, DialogContent, classNames } from "@sushiswap/ui";
import { useSwapState } from "src/app/swap/swap-provider";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { warningSeverity, warningSeverityClassName } from "src/utils/warning-severity";
import Link from "next/link";
import { truncateText } from "src/utils/formatters";
import { getTronscanAddressLink } from "src/utils/tronscan-helpers";
import { useMemo, useRef } from "react";
import { WalletConnector } from "../WalletConnector/WalletConnector";
import { ReviewSwapDialogTrigger } from "./ReviewSwapDialogTrigger";
import { formatPercent } from "sushi/format";
import { SwapButton } from "./SwapButton";

export const ReviewSwapDialog = () => {
	const { token0, token1, amountIn, amountOut, priceImpactPercentage } = useSwapState();
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const { address, connected } = useWallet();
	const isConnected = address && connected;
	const [slippageTolerance] = useSlippageTolerance("sushi-tron-slippage");
	const slippage = slippageTolerance === "AUTO" ? 0.005 : Number(slippageTolerance) / 100;

	const closeModal = () => {
		closeBtnRef?.current?.click();
	};

	const minOutput = useMemo(() => {
		if (!amountOut) return "";
		if (
			(token0?.symbol === "WTRX" && token1?.address === "TRON") ||
			(token0?.address === "TRON" && token1?.symbol === "WTRX")
		) {
			return amountIn;
		}

		const output = Number(amountOut) * (1 - slippage);
		return String(output);
	}, [amountOut, slippage, token0, token1, amountIn]);

	const severityClass = useMemo(() => {
		return warningSeverityClassName(warningSeverity(priceImpactPercentage));
	}, [priceImpactPercentage]);

	return (
		<Dialog>
			{isConnected ? (
				<ReviewSwapDialogTrigger />
			) : (
				<WalletConnector variant="default" hideChevron={true} fullWidth={true} size="lg" />
			)}
			<DialogContent>
				<DialogClose ref={closeBtnRef} />
				<div className="max-w-[504px] mx-auto mt-6">
					<div className="flex items-start justify-between gap-4 py-2">
						<div className="flex flex-col flex-grow gap-1">
							<h1 className="text-3xl font-semibold dark:text-slate-50">
								Buy {amountOut} {token1?.symbol}
							</h1>
							<h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">
								Sell {amountIn} {token0?.symbol}
							</h1>
						</div>
						<div className="min-w-[56px] min-h-[56px]">
							<div className="pr-1">
								<Badge
									position="bottom-right"
									badgeContent={
										<div className="bg-gray-100 border-2 border-gray-100 rounded-full">
											<PlusIcon
												strokeWidth={2}
												width={24}
												height={24}
												className="bg-blue text-white rounded-full p-0.5"
											/>
										</div>
									}>
									{token1 ? (
										<Icon currency={token1} width={56} height={56} />
									) : (
										<SkeletonCircle radius={56} className="bg-gray-100 dark:bg-slate-800" />
									)}
								</Badge>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<List>
							<List.Control>
								<List.KeyValue title="Network">TRON</List.KeyValue>
								<List.KeyValue
									title="Price Impact"
									subtitle="The impact your trade has on the market price of this pool.">
									<span
										style={{ color: severityClass }}
										className={classNames("text-gray-700 text-right dark:text-slate-400")}>
										-{formatPercent(priceImpactPercentage / 100)}
									</span>
								</List.KeyValue>
								<List.KeyValue
									title={`Min. received after slippage (${
										slippageTolerance === "AUTO" ? "0.5" : slippageTolerance
									}%)`}
									subtitle="The minimum amount you are guaranteed to receive.">
									{minOutput} {token1?.symbol}
								</List.KeyValue>

								<List.KeyValue title="Network fee">~$0.00</List.KeyValue>
							</List.Control>

							{address && (
								<List className="!pt-2">
									<List.Control>
										<List.KeyValue title="Recipient">
											<Link
												target="_blank"
												href={getTronscanAddressLink(address)}
												className={classNames("flex items-center gap-2 cursor-pointer text-blue")}
												rel="noreferrer">
												{truncateText(address)}
											</Link>
										</List.KeyValue>
									</List.Control>
								</List>
							)}
						</List>
					</div>
					<div className="pt-4">
						<div className="space-y-4">
							<SwapButton closeModal={closeModal} minOutput={minOutput} />
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
