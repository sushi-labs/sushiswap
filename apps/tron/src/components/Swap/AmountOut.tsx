import { useSwapDispatch, useSwapState } from "src/app/swap/swap-provider";
import { TokenInput } from "../Input/TokenInput";

export const AmountOut = () => {
	const { token1, amountOut } = useSwapState();
	const { setToken1, setAmountOut } = useSwapDispatch();

	return (
		<TokenInput
			amount={amountOut}
			setAmount={setAmountOut}
			type="output"
			token={token1}
			setToken={setToken1}
		/>
	);
};
