import { getTronscanTxnLink } from "src/utils/tronscan-helpers";
import {
	Button,
	Command,
	CommandGroup,
	CommandItem,
	Dots,
	Popover,
	PopoverContent,
	PopoverTrigger,
	createFailedToast,
	createInfoToast,
	createSuccessToast,
} from "@sushiswap/ui";
import { useState } from "react";
import { IToken } from "src/types/token-type";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useTronWeb } from "src/hooks/useTronWeb";
import { parseUnits, toBigNumber } from "src/utils/formatters";
import { getTransactionInfo, parseTxnError } from "src/utils/helpers";
import { MAX_UINT256 } from "src/constants/max-uint256";

export const ApproveToken = ({
	tokenToApprove,
	amount,
	spenderAddress,
	onSuccess,
}: {
	tokenToApprove: IToken;
	amount: string;
	spenderAddress: string;
	onSuccess: () => Promise<void>;
}) => {
	const [isApproving, setIsApproving] = useState<boolean>(false);
	const { address, signTransaction } = useWallet();
	const { tronWeb } = useTronWeb();

	const approveToken = async (type: "one-time" | "unlimited") => {
		try {
			setIsApproving(true);
			const parsedAmount = parseUnits(amount, tokenToApprove.decimals);
			const approvalAmount = type === "one-time" ? parsedAmount : MAX_UINT256;
			const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
				tokenToApprove.address, //contract address
				"approve(address,uint256)", //function name
				{}, // options
				[
					{ type: "address", value: spenderAddress },
					{ type: "uint256", value: approvalAmount },
				], //parameters
				address //issuerAddress
			);
			const signedTransation = await signTransaction(transaction);
			const _result = await tronWeb.trx.sendRawTransaction(signedTransation);
			if (!_result.result && "code" in _result) {
				throw new Error(parseTxnError(_result.code));
			}
			const txId = _result?.txid;
			createInfoToast({
				summary: type === "one-time" ? "Approving One Time..." : "Approval Unlimited Amount...",
				type: "approval",
				account: address as string,
				chainId: 1,
				groupTimestamp: Date.now(),
				timestamp: Date.now(),
				txHash: txId,
				href: getTronscanTxnLink(txId),
			});
			const transactionInfo = await getTransactionInfo(tronWeb, txId);
			if (transactionInfo?.receipt?.result !== "SUCCESS") {
				throw new Error("Approval failed");
			}
			//create success toast
			createSuccessToast({
				summary: "Approval successful",
				txHash: txId,
				type: "swap",
				account: address as string,
				chainId: 1,
				groupTimestamp: Date.now(),
				timestamp: Date.now(),
				href: getTronscanTxnLink(txId),
			});
			await onSuccess();
			setIsApproving(false);
		} catch (error) {
			const errorMessage =
				typeof error === "string"
					? error
					: (error as Error)?.message ?? "An error occurred while setting approval";
			//create error toast
			createFailedToast({
				summary: errorMessage,
				type: "swap",
				account: address as string,
				chainId: 1,
				groupTimestamp: Date.now(),
				timestamp: Date.now(),
			});
			console.log(error);
			setIsApproving(false);
		}
	};

	return (
		<Popover>
			<PopoverTrigger disabled={isApproving}>
				<Button
					asChild
					disabled={isApproving}
					loading={isApproving}
					role="combobox"
					size="lg"
					className="w-full">
					{isApproving ? "Approving" : "Approve"}
				</Button>
				<PopoverContent className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
					<Command>
						<CommandGroup>
							<CommandItem className="cursor-pointer">
								<div
									onClick={async () => {
										await approveToken("one-time");
									}}
									className="flex flex-col">
									<p className="font-bold">Approve one-time only</p>
									<p>
										You&apos;ll give your approval to spend {toBigNumber(amount).toString(10)}{" "}
										{tokenToApprove.symbol} on your behalf
									</p>
								</div>
							</CommandItem>
							<CommandItem className="cursor-pointer">
								<div
									onClick={async () => {
										await approveToken("unlimited");
									}}
									className="flex flex-col">
									<p className="font-bold">Approve unlimited amount</p>
									<p>
										You won&apos;t need to approve again next time you want to spend {tokenToApprove.symbol}.
									</p>
								</div>
							</CommandItem>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</PopoverTrigger>
		</Popover>
	);
};
