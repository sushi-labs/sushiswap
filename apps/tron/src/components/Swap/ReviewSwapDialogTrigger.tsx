import { Button, Checkbox, DialogTrigger } from "@sushiswap/ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { useSwapDispatch, useSwapState } from "src/app/swap/swap-provider";
import { ROUTER_CONTRACT } from "src/constants/contracts";
import { useAllowance } from "src/hooks/useAllowance";
import { useTokenBalance } from "src/hooks/useTokenBalance";
import { formatUnitsForInput } from "src/utils/formatters";
import { ApproveToken } from "../Shared/ApproveToken";
import { useReserves } from "src/hooks/useReserves";
import { usePriceImpact } from "src/hooks/usePriceImpact";
import { warningSeverity } from "src/utils/warning-severity";
import { useRoutes } from "src/hooks/useRoutes";
import { getIfWrapOrUnwrap } from "src/utils/helpers";

export const ReviewSwapDialogTrigger = () => {
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const { token0, token1, amountIn, amountOut, isTxnPending } = useSwapState();
	const { setPriceImpactPercentage, setRoute } = useSwapDispatch();
	const { address } = useWallet();
	const { data: allowanceAmount, refetch } = useAllowance({
		tokenAddress: token0?.address as string,
		ownerAddress: address as string,
		spenderAddress: ROUTER_CONTRACT,
	});
	const { data: tokenBalance, isLoading } = useTokenBalance({
		accountAddress: address,
		tokenAddress: token0.address,
	});
	const { data: routeData, isLoading: isLoadingRoutes } = useRoutes({ token0, token1 });
	//these reserves are always going to be defined if a pair exists
	const { data: reserves, isLoading: isReservesLoading } = useReserves({
		pairAddress: routeData?.pairs?.[0],
		token0,
		token1,
	});
	//these reserves are for is the swap needs an intermediate pair
	const { data: reserves1, isLoading: isReserves1Loading } = useReserves({
		pairAddress: routeData?.pairs?.[1],
		token0,
		token1,
	});

	//this number is always going to be defined if the reserves exists
	const { data: priceImpactPercentage } = usePriceImpact({
		amount: amountIn,
		token: token0,
		reserves,
	});

	//this number is for the price impact of the second pair in a hop is needed
	const { data: priceImpactPercentage1 } = usePriceImpact({
		amount: amountOut,
		token: token1,
		reserves: reserves1,
	});

	const priceImpactTotal = (priceImpactPercentage ?? 0) + (priceImpactPercentage1 ?? 0);

	useEffect(() => {
		if (isLoadingRoutes) {
			setRoute([]);
		}
		if (routeData && routeData.route.length > 0 && !isLoadingRoutes) {
			setRoute(routeData.route);
		}
	}, [routeData, isLoadingRoutes]);

	const swapType = useMemo(() => {
		return getIfWrapOrUnwrap(token0, token1);
	}, [token0, token1]);

	useEffect(() => {
		setPriceImpactPercentage(priceImpactTotal ?? 0);
	}, [priceImpactTotal]);

	const refreshAllowance = async () => {
		await refetch();
	};

	const hasInsufficientBalance = useMemo(() => {
		if (isLoading) return true;
		return Number(formatUnitsForInput(tokenBalance ?? "0", token0.decimals)) < Number(amountIn);
	}, [tokenBalance, token0, amountIn, isLoading]);

	const noRoutes = swapType === "swap" && !isLoadingRoutes && routeData && routeData.route?.length === 0;

	const allowanceFormatted = formatUnitsForInput(allowanceAmount ?? "0", token0?.decimals);

	const insufficientLiquidity = priceImpactTotal && priceImpactTotal >= 100;

	const buttonText = useMemo(() => {
		if (isTxnPending) {
			return "Swapping";
		}
		if (!amountIn || amountIn === "0") {
			return "Enter Amount";
		}
		if (hasInsufficientBalance) {
			return "Insufficient Balance";
		}
		if (swapType === "unwrap") {
			return "Unwrap";
		}
		if (swapType === "wrap") {
			return "Wrap";
		}
		if (noRoutes) {
			return "No Routes Found";
		}
		if (insufficientLiquidity) {
			return "Insufficient Liquidity";
		}
		if (allowanceAmount && Number(amountIn) > Number(allowanceFormatted) && swapType === "swap") {
			return "Approve";
		}
		return "Review Swap";
	}, [
		amountIn,
		allowanceAmount,
		hasInsufficientBalance,
		noRoutes,
		allowanceFormatted,
		swapType,
		insufficientLiquidity,
		isTxnPending,
	]);

	const userConfirmationNeeded = useMemo(() => {
		if (
			warningSeverity(priceImpactPercentage ?? 0) > 3 &&
			(buttonText === "Review Swap" || buttonText === "Approve")
		) {
			return true;
		}
		return false;
	}, [priceImpactPercentage, buttonText]);

	return (
		<>
			{buttonText === "Approve" ? (
				<ApproveToken
					tokenToApprove={token0}
					amount={amountIn}
					spenderAddress={ROUTER_CONTRACT}
					onSuccess={refreshAllowance}
				/>
			) : (
				<DialogTrigger
					disabled={
						insufficientLiquidity ||
						(userConfirmationNeeded && !isChecked) ||
						!amountIn ||
						hasInsufficientBalance ||
						noRoutes
					}
					asChild>
					<Button size="lg">{buttonText}</Button>
				</DialogTrigger>
			)}
			{userConfirmationNeeded && !isChecked ? (
				<div
					onClick={() => setIsChecked(!isChecked)}
					className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20 dark:bg-red/40 cursor-pointer">
					<Checkbox color="red" id="expert-checkbox" checked={isChecked} />
					<label htmlFor="expert-checkbox" className="ml-2 font-medium text-red-600 dark:text-red-300">
						Price impact is too high. You will lose a big portion of your funds in this trade. Please tick the
						box if you would like to continue.
					</label>
				</div>
			) : null}
		</>
	);
};
