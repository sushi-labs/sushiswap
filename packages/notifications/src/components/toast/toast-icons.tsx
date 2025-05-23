import { ReactNode } from "react";
import { BaseNotification } from "../../types";
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CoinIcon } from "@sushiswap/ui/icons/CoinIcon";
import { StarIcon } from "@sushiswap/ui/icons/StarIcon";

type IconNotificationType = Extract<
	BaseNotification["type"],
	| "addLiquidity"
	| "removeLiquidity"
	| "swap"
	| "xswap"
	| "market"
	| "dca"
	| "limit"
	| "claimRewards"
	| "product"
>;

export const ICONS: Record<IconNotificationType, ReactNode> = {
	addLiquidity: <ArrowDownTrayIcon width={14} height={14} strokeWidth={2} />,
	removeLiquidity: <ArrowUpTrayIcon width={14} height={14} strokeWidth={2} />,
	swap: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
	xswap: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
	market: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
	dca: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
	limit: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
	claimRewards: <CoinIcon width={14} height={14} strokeWidth={2} />,
	product: <StarIcon width={14} height={14} strokeWidth={2} />,
};
