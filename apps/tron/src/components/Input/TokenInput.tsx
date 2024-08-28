import { Button, TextField } from "@sushiswap/ui";
import { TokenListSelect } from "../General/TokenListSelect";
import { DollarAmountDisplay } from "../Shared/DollarAmountDisplay";
import { TokenBalanceDisplay } from "../Shared/TokenBalanceDisplay";
import { IToken } from "src/types/token-type";
import { useTokenBalance } from "src/hooks/useTokenBalance";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { formatUnitsForInput } from "src/utils/formatters";
import { useStablePrice } from "src/hooks/useStablePrice";
import { Icon } from "../General/Icon";

type TokenInputProps = {
	type: "input" | "output";
	token: IToken | undefined;
	setToken: (token: IToken) => void;
	amount: string;
	setAmount: (amount: string) => void;
	hasTokenListSelect?: boolean;
};

export const TokenInput = ({
	type,
	token,
	setToken,
	amount,
	setAmount,
	hasTokenListSelect = true,
}: TokenInputProps) => {
	const { address } = useWallet();
	const { data: tokenBalance, isInitialLoading: isInitialLoadingTokenBalance } = useTokenBalance({
		accountAddress: address,
		tokenAddress: token?.address,
	});
	const { data: usdValue, isLoading: isUSDValueLoading } = useStablePrice({ token: token });

	const usdAmount = amount ? (Number(amount) * (usdValue ? Number(usdValue) : 0)).toString(10) : "0.00";

	return (
		<div className="flex flex-col gap-2 bg-white px-3 py-4 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
			<div className="flex items-center gap-2">
				<TextField
					className="text-3xl bg-transparent !px-0 hover:!bg-transparent"
					disabled={type === "output"}
					id={`swap-${type}`}
					placeholder="0.0"
					type="number"
					value={amount}
					readOnly={type === "output"}
					onChange={(e) => {
						if (type === "output") return;
						const value = e.target.value;

						setAmount(value);
					}}
					// isError={true}
				/>
				{hasTokenListSelect ? (
					<TokenListSelect setToken={setToken} token={token} />
				) : (
					<Button
						icon={() => (token ? <Icon currency={token} width={26} height={26} /> : <></>)}
						size="sm"
						variant="ghost"
						className={`!rounded-full flex items-center !p-5 !text-xl focus:bg-transparent hover:bg-transparent !cursor-default`}>
						<span>{token?.symbol ?? "Select Token"}</span>
					</Button>
				)}
			</div>
			<div className="flex justify-between gap-2 items-center">
				<DollarAmountDisplay
					isLoading={amount !== "" && isUSDValueLoading}
					error={undefined}
					value={usdAmount}
				/>
				<TokenBalanceDisplay
					amount={Number(tokenBalance ?? 0)}
					isLoading={isInitialLoadingTokenBalance}
					type={type}
					decimals={token?.decimals ?? 0}
					maxAmount={() => {
						if (type === "output") return;
						if (tokenBalance === "0") {
							setAmount("");
							return;
						}
						setAmount(formatUnitsForInput(tokenBalance ?? "0", token?.decimals ?? 0));
					}}
				/>
			</div>
		</div>
	);
};
