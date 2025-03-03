"use client";

import {
	Button,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@sushiswap/ui";
import { ShuffleIcon } from "@sushiswap/ui/icons/ShuffleIcon";
import Link from "next/link";
import { type FC, useMemo } from "react";
import { isTwapSupportedChainId, isXSwapSupportedChainId } from "src/config";
import { ChainKey, type EvmChainId } from "sushi/chain";
import { useChainId } from "wagmi";
import { PathnameButton } from "../pathname-button";

export type SwapMode = "swap" | "limit" | "dca" | "crossChain";

export type SwapModeUrls = {
	[key in SwapMode]?: string;
};

interface SwapModeButtonsProps {
	mode?: SwapMode;
	onModeChange?: (mode: SwapMode) => void;
	urls?: SwapModeUrls;
}

const ButtonWrapper = ({
	children,
	targetMode,
	urls,
	mode,
	onModeChange,
}: { children: React.ReactNode; targetMode: SwapMode } & Pick<
	SwapModeButtonsProps,
	"urls" | "mode" | "onModeChange"
>) => {
	if (!urls) {
		return (
			<Button
				onClick={() => onModeChange?.(targetMode)}
				size="sm"
				variant={mode === targetMode ? "secondary" : "ghost"}
			>
				{children}
			</Button>
		);
	}

	const href = urls[targetMode];
	if (!href) return null;

	return (
		<Link href={href}>
			<PathnameButton pathname={href} size="sm">
				{children}
			</PathnameButton>
		</Link>
	);
};

export function getDefaultSwapPageUrls(chainId: EvmChainId): SwapModeUrls {
	const isTwapSupported = isTwapSupportedChainId(chainId);
	const isXSwapSupported = isXSwapSupportedChainId(chainId);

	return {
		swap: `/${ChainKey[chainId]}/swap`,
		limit: `/${isTwapSupported ? ChainKey[chainId] : "ethereum"}/limit`,
		dca: `/${isTwapSupported ? ChainKey[chainId] : "ethereum"}/dca`,
		crossChain: `/${
			isXSwapSupported ? ChainKey[chainId] : "ethereum"
		}/cross-chain-swap`,
	};
}

export const SwapModeButtons: FC<SwapModeButtonsProps> = ({
	mode,
	onModeChange,
	urls,
}) => {
	return (
		<div className="flex gap-2 flex-wrap">
			<ButtonWrapper
				targetMode="swap"
				urls={urls}
				mode={mode}
				onModeChange={onModeChange}
			>
				Swap
			</ButtonWrapper>
			<ButtonWrapper
				targetMode="limit"
				urls={urls}
				mode={mode}
				onModeChange={onModeChange}
			>
				Limit
			</ButtonWrapper>
			<ButtonWrapper
				targetMode="dca"
				urls={urls}
				mode={mode}
				onModeChange={onModeChange}
			>
				DCA
			</ButtonWrapper>
			<HoverCard>
				<ButtonWrapper
					targetMode="crossChain"
					urls={urls}
					mode={mode}
					onModeChange={onModeChange}
				>
					<HoverCardTrigger asChild>
						<span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
							<ShuffleIcon width={20} height={20} className="text-blue" />
							Cross-Chain
						</span>
					</HoverCardTrigger>
				</ButtonWrapper>
				<HoverCardContent className="!p-0 max-w-[320px]">
					<CardHeader>
						<CardTitle>Cross-Chain Swap</CardTitle>
						<CardDescription>
							Swap tokens natively across 15 chains including Ethereum,
							Arbitrum, Optimism, Polygon, Base and more!
						</CardDescription>
					</CardHeader>
					<CardContent>
						<a
							target="_blank"
							className="text-sm text-blue hover:underline"
							href="https://www.sushi.com/blog/sushixswap-v2"
							rel="noreferrer"
						>
							Learn more.
						</a>
					</CardContent>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
};

export const DefaultSwapModeUrlButtons = () => {
	const chainId = useChainId();
	const urls = useMemo(() => getDefaultSwapPageUrls(chainId), [chainId]);

	return <SwapModeButtons urls={urls} />;
};
