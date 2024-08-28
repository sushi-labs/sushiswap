import { useTronWeb } from "./useTronWeb";
import { useQuery } from "@tanstack/react-query";
import { MAX_UINT256 } from "src/constants/max-uint256";
import { isAddress } from "src/utils/helpers";

const abi = [
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
			{
				name: "_spender",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

export const useAllowance = ({
	tokenAddress,
	ownerAddress,
	spenderAddress,
}: {
	tokenAddress: string;
	ownerAddress: string;
	spenderAddress: string;
}) => {
	const { tronWeb } = useTronWeb();

	return useQuery({
		queryKey: ["useAllowance", { tokenAddress, ownerAddress, spenderAddress }],
		queryFn: async () => {
			if (tokenAddress === "TRON") {
				return MAX_UINT256;
			}
			tronWeb.setAddress(tokenAddress);
			const tokenContract = await tronWeb.contract(abi, tokenAddress);
			const allowance = await tokenContract.allowance(ownerAddress, spenderAddress).call();

			return allowance?.toString() as string;
		},
		enabled:
			(isAddress(tokenAddress) || tokenAddress === "TRON") &&
			isAddress(ownerAddress) &&
			isAddress(spenderAddress) &&
			!!tronWeb,
	});
};
