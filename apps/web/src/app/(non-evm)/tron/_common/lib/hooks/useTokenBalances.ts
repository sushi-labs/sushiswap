import { useQuery } from "@tanstack/react-query";
import { useTronWeb } from "./useTronWeb";
import { IToken } from "../../types/token-type";
import { useNativeBalance } from "./useNativeBalance";
import { MULTICALL_CONTRACT } from "~tron/_common/constants/contracts";
import { TRON_MULTICALL_ABI } from "~tron/_common/constants/abis/tron-multicall";
import { decodeAbiParameters } from "viem";

const abi = {
	outputs: [{ type: "uint256" }],
	constant: true,
	inputs: [{ type: "address" }],
	name: "balanceOf",
	stateMutability: "View",
	type: "Function",
};

const functionSignature = "balanceOf(address)";

const getBalances = async (tronWeb: any, address: string, currencies: IToken[], nativeBalance: string) => {
	const tokenAddresses = currencies.map((currency) => currency.address);
	const functionSelector = tronWeb.sha3(functionSignature).slice(0, 10); // first 4 bytes
	const calls = tokenAddresses.map((tokenAddress) => {
		const parameters = tronWeb.utils.abi.encodeParamsV2ByABI(abi, [address]);
		const callData = functionSelector + parameters.replace(/^0x/, "");

		return [tokenAddress, callData];
	});

	tronWeb.setAddress(MULTICALL_CONTRACT);
	const multicallInstance = await tronWeb.contract(TRON_MULTICALL_ABI, MULTICALL_CONTRACT);

	const _multicallReturn = await multicallInstance.aggregate(calls).call();
	const { returnData } = _multicallReturn;

	const _balances = (returnData as string[])?.reduce<Record<string, string>>((acc, _cur, i) => {
		const amount = decodeAbiParameters(
			[
				{
					type: "uint256",
				},
			],
			returnData[i]
		);

		acc[tokenAddresses[i]] = amount?.toString() ?? "0";

		return acc;
	}, {});

	_balances["TRON"] = nativeBalance ?? "0";

	return _balances;
};

export const useTokenBalances = ({
	currencies,
	address,
	enabled,
}: {
	currencies: IToken[];
	address: string | null;
	enabled?: boolean;
}) => {
	const { tronWeb } = useTronWeb();
	const { data: _nativeBalance } = useNativeBalance();
	const nativeBalance = _nativeBalance?.balance as string;

	return useQuery({
		queryKey: ["useTokenBalances", currencies, nativeBalance, address],
		queryFn: async () => {
			if (!tronWeb || !address || !enabled) return {};
			const currenciesWithoutNative = currencies.filter((currency) => currency.address !== "TRON");
			const balances = await getBalances(tronWeb, address, currenciesWithoutNative, nativeBalance);
			// <tokenAddress, amountInWei>
			return balances;
		},
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		enabled: !!address && !!tronWeb && !!enabled,
	});
};
