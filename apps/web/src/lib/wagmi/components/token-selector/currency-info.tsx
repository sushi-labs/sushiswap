import {
	ArrowLeftIcon,
	ChartBarSquareIcon,
	DocumentDuplicateIcon,
	ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
	Button,
	ClipboardController,
	Collapsible,
	DialogHeader,
	DialogPrimitive,
	DialogTitle,
	IconButton,
	LinkExternal,
	Separator,
	SkeletonText,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@sushiswap/ui";
import { type FC, useCallback, useState } from "react";
import { TriangleIcon } from "src/app/(cms)/components/icons";
import { useCoinGeckoTokenInfo, useTokenSecurity } from "src/lib/hooks/react-query";
import { EvmChain } from "sushi/chain";
import type { Type } from "sushi/currency";
import { formatNumber, formatUSD, shortenAddress } from "sushi/format";
import { TokenSecurityView } from "../token-security-view";

interface CurrencyInfoProps {
	currency: Type;
	onBack: () => void;
}

export const CurrencyInfo: FC<CurrencyInfoProps> = ({ currency, onBack }) => {
	const [showMore, setShowMore] = useState(true);
	const { data: tokenSecurity, isLoading: isTokenSecurityLoading } = useTokenSecurity({
		currency: currency.wrapped,
	});

	const { data: coinGeckoInfo, isLoading: isCoinGeckoInfoLoading } = useCoinGeckoTokenInfo({
		token: currency.wrapped,
	});

	const toggleShowMore = useCallback(() => {
		setShowMore((prev) => !prev);
	}, []);

	return (
		<div className="absolute inset-0 z-20 py-6 bg-gray-100 dark:bg-slate-800 rounded-2xl">
			<DialogPrimitive.Close asChild className="absolute top-6 right-6">
				<IconButton icon={XMarkIcon} name="Close" />
			</DialogPrimitive.Close>
			<div className="flex flex-col h-full gap-4">
				<DialogHeader className="px-6">
					<DialogTitle className="flex items-center gap-2">
						<IconButton size="sm" onClick={onBack} icon={ArrowLeftIcon} name="Back" variant="ghost" />
						<div className="flex items-center gap-1">
							<span className="text-xl font-medium">{currency.symbol}</span>
							<span className="text-base font-normal text-muted-foreground">
								{EvmChain.from(currency.chainId)?.name}
							</span>
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className="px-6 overflow-y-auto hide-scrollbar">
					<div className="flex gap-1 items-center py-2">
						<ChartBarSquareIcon className="h-4 w-4" />
						<span className="font-medium">Market Info</span>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Price</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">{coinGeckoInfo?.price ? formatUSD(coinGeckoInfo.price) : "-"}</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Market Cap Rank</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">{coinGeckoInfo?.rank ? `#${coinGeckoInfo.rank}` : "-"}</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Trading Volume (24H)</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">
									{coinGeckoInfo?.volume24h ? formatUSD(coinGeckoInfo.volume24h) : "-"}
								</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Market Cap</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">
									{coinGeckoInfo?.marketCap ? formatUSD(coinGeckoInfo.marketCap) : "-"}
								</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">All-Time High</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">{coinGeckoInfo?.ath ? formatUSD(coinGeckoInfo.ath) : "-"}</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">All-Time Low</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">{coinGeckoInfo?.atl ? formatUSD(coinGeckoInfo.atl) : "-"}</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Circulating Supply</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">
									{coinGeckoInfo?.circulatingSupply ? formatNumber(coinGeckoInfo.circulatingSupply) : "-"}
								</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Total Supply</span>
							{isCoinGeckoInfoLoading ? (
								<span className="w-12">
									<SkeletonText fontSize="sm" />
								</span>
							) : (
								<span className="text-sm">
									{coinGeckoInfo?.totalSupply ? formatNumber(coinGeckoInfo.totalSupply) : "-"}
								</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Contract Address</span>
							<span className="flex items-center gap-1">
								<LinkExternal
									className="font-medium underline"
									href={EvmChain.from(currency.chainId)?.getTokenUrl(currency.wrapped.address)}>
									{shortenAddress(currency.wrapped.address)}
								</LinkExternal>
								<ClipboardController hideTooltip>
									{({ setCopied }) => (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<DocumentDuplicateIcon
														className="w-4 h-4 cursor-pointer"
														onClick={() => setCopied(currency.wrapped.address)}
													/>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													<p>Lorem ipsum dolor sit amet</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</ClipboardController>
							</span>
						</div>
					</div>
					<Button
						size="sm"
						variant="ghost"
						className="mt-4 w-full text-muted-foreground font-medium text-xs"
						onClick={toggleShowMore}>
						{showMore ? "View Less" : "View More"}
						<TriangleIcon
							className={`h-3 w-3 transition-transform ${showMore ? "-rotate-90" : "rotate-90"}`}
						/>
					</Button>
					<Collapsible open={showMore}>
						<Separator className="my-6" />
						<div className="flex flex-col ">
							<div className="flex gap-1 items-center py-2">
								<ShieldCheckIcon className="h-4 w-4" />
								<span className="font-medium">Security Info</span>
							</div>
							<TokenSecurityView
								token={currency.wrapped}
								isTokenSecurityLoading={isTokenSecurityLoading}
								tokenSecurity={tokenSecurity}
							/>
						</div>
					</Collapsible>
				</div>
			</div>
		</div>
	);
};
