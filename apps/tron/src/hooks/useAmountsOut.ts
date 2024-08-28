import { useTronWeb } from "./useTronWeb";
import { useQuery } from "@tanstack/react-query";
import TronWeb from "tronweb";
import { ROUTER_CONTRACT } from "src/constants/contracts";
import { getIfWrapOrUnwrap, getValidTokenAddress } from "src/utils/helpers";
import { ROUTER_ABI } from "src/constants/abis/router-abi";
import { useSwapState } from "src/app/swap/swap-provider";

export const useAmountsOut = ({ amountIn }: { amountIn: string }) => {
	const { tronWeb } = useTronWeb();
	const { route, token0, token1 } = useSwapState();

	return useQuery({
		queryKey: ["useAmountsOut", { route, amountIn }],
		queryFn: async () => {
			const swapType = getIfWrapOrUnwrap(token0, token1);
			if (swapType === "wrap" || swapType === "unwrap") {
				return [amountIn, amountIn];
			}
			if (!route) return [];

			const cleanedAddressRoute = route?.map((i) => getValidTokenAddress(i));
			if (!amountIn || isNaN(Number(amountIn))) return [];
			try {
				tronWeb.setAddress(ROUTER_CONTRACT);
				const routerContract = await tronWeb.contract(ROUTER_ABI, ROUTER_CONTRACT);
				const amountsOuts = await routerContract.getAmountsOut(amountIn, cleanedAddressRoute).call();

				return amountsOuts?.amounts?.map((i: typeof TronWeb.BigNumber) => i.toString()) as string[];
			} catch (error) {
				console.log("useAmountsOut error", error);
				return [amountIn, ""];
			}
		},
		enabled: !!amountIn && !!tronWeb,
	});
};
