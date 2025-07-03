import { useQuery } from "@tanstack/react-query";
import { kadenaClient } from "~kadena/_common/constants/client";
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID } from "~kadena/_common/constants/network";
import { buildGetPoolAddress, buildGetPoolExists, buildGetTotalLpSupply } from "../../pact/pool";

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
		totalSupplyLp: number;
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

			const tx2 = buildGetTotalLpSupply(token0, token1, KADENA_CHAIN_ID, KADENA_NETWORK_ID);
			const res2 = await kadenaClient.local(tx2, {
				preflight: false,
				signatureVerification: false,
			});
			if (res2.result.status !== "success") {
				throw new Error(res2.result.error?.message || "Failed to fetch total lp balance");
			}

			let totalSupplyLp = 0;
			if (typeof res2.result.data === "object" && "decimal" in res2.result.data) {
				totalSupplyLp = Number.parseFloat(res2.result.data.decimal);
			} else {
				totalSupplyLp = res2.result.data;
			}

			let reserve0 = 0;
			if (typeof poolData.leg0.reserve === "object" && "decimal" in poolData.leg0.reserve) {
				reserve0 = Number.parseFloat(poolData.leg0.reserve.decimal);
			} else {
				reserve0 = poolData.leg0.reserve;
			}

			let reserve1 = 0;
			if (typeof poolData.leg1.reserve === "object" && "decimal" in poolData.leg1.reserve) {
				reserve1 = Number.parseFloat(poolData.leg1.reserve.decimal);
			} else {
				reserve1 = poolData.leg1.reserve;
			}

			const namespace0 = poolData.leg0.token.refName.namespace || "";
			const name0 = poolData.leg0.token.refName.name;

			const namespace1 = poolData.leg1.token.refName.namespace || "";
			const name1 = poolData.leg1.token.refName.name;

			const _token0 = `${namespace0 ? `${namespace0}.` : ""}${name0}`;
			const _token1 = `${namespace1 ? `${namespace1}.` : ""}${name1}`;

			const rate0to1 = reserve0 / reserve1;
			const rate1to0 = reserve1 / reserve0;

			let finalToken0 = _token0;
			let finalToken1 = _token1;
			let finalReserve0 = reserve0;
			let finalReserve1 = reserve1;
			let finalRate0to1 = rate0to1;
			let finalRate1to0 = rate1to0;

			if (token0 !== _token0 || token1 !== _token1) {
				if (token0 === _token1 && token1 === _token0) {
					finalToken0 = _token1;
					finalToken1 = _token0;
					finalReserve0 = reserve1;
					finalReserve1 = reserve0;
					finalRate0to1 = rate1to0;
					finalRate1to0 = rate0to1;
				} else {
					console.warn("UI token order does not match contract token order and no inverse match found.");
				}
			}

			return {
				exists: true,
				poolData: {
					poolAddress: poolData.account,
					token0: finalToken0,
					token1: finalToken1,
					reserve0: finalReserve0,
					reserve1: finalReserve1,
					mutexLocked: poolData["mutex-locked"],
					rateOfToken0ToToken1: finalRate0to1,
					rateOfToken1ToToken0: finalRate1to0,
					totalSupplyLp,
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
