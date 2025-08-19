import { useEffect, useRef, useState } from "react";
import { TrendingItemMobile } from "src/ui/explore/trending/trending-item";
import { ChainKey, EvmChainId } from "sushi/chain";
import {
	type SushiSwapV2ChainId,
	type SushiSwapV3ChainId,
	isSushiSwapV2ChainId,
	isSushiSwapV3ChainId,
} from "sushi/config";
import { PLACEHOLDER_POOLS_DATA } from "../../explore/trending/trending";

export const Trending = () => {
	const overflowRef = useRef<HTMLDivElement>(null);
	const { hasOverflow } = useOverflow(overflowRef);

	return (
		<div className="px-4 py-3 border-b border-accent flex gap-4 items-center relative">
			<p className="font-medium text-sm">Trending:</p>
			<div ref={overflowRef} className="flex overflow-x-auto gap-2 snap-x hide-scrollbar pr-4">
				{PLACEHOLDER_POOLS_DATA.map((pool, idx) => {
					const fallbackChain = EvmChainId.ETHEREUM;

					const href =
						pool.version === "v3"
							? isSushiSwapV3ChainId(pool.chainId as SushiSwapV3ChainId)
								? `/${ChainKey[pool.chainId]}/pool/v3/${pool.address}`
								: `/${ChainKey[fallbackChain]}/pool/v3/${pool.address}`
							: isSushiSwapV2ChainId(pool.chainId as SushiSwapV2ChainId)
							? `/${ChainKey[pool.chainId]}/pool/v2/${pool.address}`
							: `/${ChainKey[fallbackChain]}/pool/v2/${pool.address}`;

					return (
						<TrendingItemMobile
							key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
							pool={pool}
							position={idx + 1}
							href={href}
						/>
					);
				})}
			</div>
			{hasOverflow ? (
				<div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-900" />
			) : null}
		</div>
	);
};

const useOverflow = (ref: React.RefObject<HTMLDivElement | null>) => {
	const [hasOverflow, setHasOverflow] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (element) {
			setHasOverflow(element.scrollWidth > element.clientWidth);
		}

		const handleResize = () => {
			if (element) {
				setHasOverflow(element.scrollWidth > element.clientWidth);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [ref]);

	return { hasOverflow };
};
