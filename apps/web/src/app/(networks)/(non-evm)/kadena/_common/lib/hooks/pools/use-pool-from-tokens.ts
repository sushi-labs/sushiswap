import { useQuery } from "@tanstack/react-query";
import { kadenaClient } from "~kadena/_common/constants/client";
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID } from "~kadena/_common/constants/network";
import { buildGetPoolAddress, buildGetPoolExists } from "../../pact/pool";

type PoolAddressResponse = {
	exists: boolean;
	poolData?: {
		poolAddress: string;
		token0: string;
		token1: string;
		reserve0: number;
		reserve1: number;
		mutexLocked: boolean;
		rateOfToken0ToToken1: number;
		rateOfToken1ToToken0: number;
	};
};

export const usePoolFromTokens = ({ token0, token1 }: { token0?: string; token1?: string }) => {
	return useQuery({
		queryKey: ["kadena-pool-from-tokens", token0, token1],
		queryFn: async (): Promise<PoolAddressResponse> => {
			if (!token0 || !token1) {
				return {
					exists: false,
					poolData: undefined,
				};
			}

			const tx = buildGetPoolExists(token0, token1, KADENA_CHAIN_ID, KADENA_NETWORK_ID);

			const res = await kadenaClient.local(tx, {
				preflight: false,
				signatureVerification: false,
			});

			if (res.result.status !== "success") {
				throw new Error(res.result.error?.message || "Failed to fetch balances");
			}
			if (res.result.data === false) {
				return {
					exists: false,
					poolData: undefined,
				};
			}
			const tx1 = buildGetPoolAddress(token0, token1, KADENA_CHAIN_ID, KADENA_NETWORK_ID);
			const res1 = await kadenaClient.local(tx1, {
				preflight: false,
				signatureVerification: false,
			});
			if (res1.result.status !== "success") {
				throw new Error(res1.result.error?.message || "Failed to fetch pool address");
			}
			const poolData = res1?.result?.data as PoolDataRes;

			let reserve0 = 0;
			if (typeof poolData.leg0.reserve === "object" && "decimal" in poolData.leg0.reserve) {
				reserve0 = parseFloat(poolData.leg0.reserve.decimal);
			} else {
				reserve0 = poolData.leg0.reserve;
			}

			let reserve1 = 0;
			if (typeof poolData.leg1.reserve === "object" && "decimal" in poolData.leg1.reserve) {
				reserve1 = parseFloat(poolData.leg1.reserve.decimal);
			} else {
				reserve1 = poolData.leg1.reserve;
			}

			const rateOfToken0ToToken1 = reserve0 / reserve1;
			const rateOfToken1ToToken0 = reserve1 / reserve0;

			return {
				exists: true,
				poolData: {
					poolAddress: poolData.account,
					token0: `${poolData.leg0.token.refName.name}${
						poolData.leg0.token.refName.namespace ? `.${poolData.leg0.token.refName.namespace}` : ""
					}`,
					token1: `${poolData.leg1.token.refName.name}${
						poolData.leg1.token.refName.namespace ? `.${poolData.leg1.token.refName.namespace}` : ""
					}`,
					reserve0: reserve0,
					reserve1: reserve1,
					mutexLocked: poolData["mutex-locked"],
					rateOfToken0ToToken1,
					rateOfToken1ToToken0,
				},
			};
		},
		enabled: !!token0 && !!token1,
	});
};

type PoolDataRes = {
	leg1: {
		reserve: number | { decimal: string };
		token: {
			refSpec: {
				namespace: string | null;
				name: string;
			}[];

			refName: {
				namespace: string | null;
				name: string;
			};
		};
	};
	"mutex-locked": boolean;
	account: string;
	leg0: {
		reserve: number | { decimal: string };
		token: {
			refSpec: {
				namespace: string | null;
				name: string;
			}[];
			refName: {
				namespace: string | null;
				name: string;
			};
		};
	};
};
