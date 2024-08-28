import { useMemo } from "react";
import { useTronWeb } from "./useTronWeb";
import { sortTokenAddresses } from "src/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { FACTORY_CONTRACT } from "src/constants/contracts";
import { getBase58Address, getValidTokenAddress } from "src/utils/helpers";
import { FACTORY_ABI } from "src/constants/abis/factory-abi";

export const usePairContract = ({
	token0Address,
	token1Address,
}: {
	token0Address: string | undefined;
	token1Address: string | undefined;
}) => {
	const { tronWeb } = useTronWeb();
	const [token0, token1] = useMemo(() => {
		if (!token0Address || !token1Address) return [undefined, undefined];
		return sortTokenAddresses(getValidTokenAddress(token0Address), getValidTokenAddress(token1Address));
	}, [token0Address, token1Address]);
	return useQuery({
		queryKey: ["usePairContract", { token0Address, token1Address }],
		queryFn: async () => {
			if (!token0 || !token1 || !tronWeb) return null;
			if (token0 === token1) return null;
			tronWeb.setAddress(FACTORY_CONTRACT);
			const factoryContract = await tronWeb.contract(FACTORY_ABI, FACTORY_CONTRACT);
			const pairAddress: string | undefined = await factoryContract.getPair(token0, token1).call();
			if (!pairAddress) return null;
			return getBase58Address(pairAddress);
		},
		enabled: !!token0 && !!token1 && !!tronWeb,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
};
