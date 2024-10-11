import { useQuery } from "@tanstack/react-query";
import { AptosAccount, Provider } from "aptos";
import { networkNameToNetwork } from "~aptos/(common)/config/chains";
import { getSwapPayload } from "./get-swap-payload";
import { useNetwork } from "~aptos/(common)/lib/common/use-network";
import { useSimpleSwapState } from "../ui/simple/simple-swap-provider/simple-swap-provider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Ed25519PublicKey, AccountAddress, Account } from "@aptos-labs/ts-sdk";

export const useSwapNetworkFee = () => {
	const {
		network,
		contracts: { swap: swapContract },
	} = useNetwork();
	const { bestRoutes, token0, slippageAmount, amount } = useSimpleSwapState();
	const { account } = useWallet();

	return useQuery({
		queryKey: ["useSwapNetworkFee", bestRoutes, token0, account, slippageAmount, amount],
		queryFn: async () => {
			if (!account || !amount || bestRoutes.length === 0 || !slippageAmount) return "0";

			const config = new AptosConfig({ network: networkNameToNetwork(network) });
			const aptos = new Aptos(config);
			const { gas_estimate } = await aptos.getGasPriceEstimation();

			const _account = new Ed25519PublicKey(account.address);

			const payload = getSwapPayload(
				swapContract,
				parseInt((parseFloat(String(amount)) * 10 ** token0.decimals) as unknown as string),
				bestRoutes,
				parseInt(String(slippageAmount))
			);

			const transaction = await aptos.transaction.build.simple({
				sender: account.address,
				data: {
					//@ts-expect-error
					function: payload?.data?.function,
					functionArguments: payload?.data?.functionArguments,
					typeArguments: payload?.data?.typeArguments,
				},
			});

			const [userTransactionResponse] = await aptos.transaction.simulate.simple({
				signerPublicKey: _account,
				transaction,
			});

			const gasUsed = Number(userTransactionResponse?.gas_used) || 14;

			const networkFee = gasUsed * gas_estimate;

			return networkFee / 10 ** 8;
		},
		enabled: !!account,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
};
