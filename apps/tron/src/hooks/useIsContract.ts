import { isContract } from "src/utils/helpers";
import { useTronWeb } from "./useTronWeb";
import { useQuery } from "@tanstack/react-query";

export const useIsContract = ({ address }: { address: string | null | undefined }) => {
	const { tronWeb } = useTronWeb();

	return useQuery({
		queryKey: ["useIsContract", { address }],
		queryFn: async () => {
			if (!address) return false;
			return await isContract(tronWeb, address);
		},
		enabled: !!address && !!tronWeb,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
};
