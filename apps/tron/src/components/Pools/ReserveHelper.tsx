import { useEffect } from "react";
import { usePoolDispatch, usePoolState } from "src/app/pool/pool-provider";
import { useReserves } from "src/hooks/useReserves";
import { getValidTokenAddress } from "src/utils/helpers";

export const ReserveHelper = () => {
	const { token0, token1, pairAddress } = usePoolState();
	const { setReserve0, setReserve1 } = usePoolDispatch();

	const { data, isLoading } = useReserves({
		pairAddress: pairAddress,
		token0: token0,
		token1: token1,
	});

	useEffect(() => {
		if (!pairAddress) {
			setReserve0("");
			setReserve1("");
		}
		if (!isLoading && data && data?.length > 0 && pairAddress && token0 && token1) {
			const reserve0 = data.find(
				(d) => getValidTokenAddress(d.address!) === getValidTokenAddress(token0?.address)
			);
			const reserve1 = data.find(
				(d) => getValidTokenAddress(d.address!) === getValidTokenAddress(token1?.address)
			);
			setReserve0(reserve0?.reserve ?? "");
			setReserve1(reserve1?.reserve ?? "");
		}
	}, [data, isLoading, pairAddress, token0, token1]);

	return null;
};
