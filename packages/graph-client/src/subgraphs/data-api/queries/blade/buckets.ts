import type { VariablesOf } from "gql.tada";

import { type RequestOptions, request } from "src/lib/request.js";
import type { EvmChainId } from "sushi";
import { isBladeChainId } from "sushi/config";
// import { SUSHI_DATA_API_HOST } from "sushi/config/subgraph";
import { graphql } from "../../graphql.js";

export const BladePoolBucketsQuery = graphql(
	`
		query BladePoolBuckets($address: Bytes!, $chainId: BladeChainId!) {
			bladePoolBuckets(address: $address, chainId: $chainId) {
				dayBuckets {
					date
					feesUSD
					id
					liquidityUSD
					txCount
					volumeUSD
				}
				hourBuckets {
					date
					feesUSD
					id
					liquidityUSD
					txCount
					volumeUSD
				}
			}
		}
	`
);

export type GetBladePoolBuckets = VariablesOf<typeof BladePoolBucketsQuery>;

export async function getBladePoolBuckets(variables: GetBladePoolBuckets, options?: RequestOptions) {
	// const url = `${SUSHI_DATA_API_HOST}/graphql`;
	const url = `https://data-api-staging.data-gcp.sushi.com/graphql`;
	const chainId = Number(variables.chainId) as EvmChainId;

	if (!isBladeChainId(chainId)) {
		throw new Error("Invalid chainId");
	}
	try {
		const result = await request({ url, document: BladePoolBucketsQuery, variables }, options);
		if (result.bladePoolBuckets) {
			return {
				//@ts-expect-error - bladePoolBuckets is not defined in the schema b/c it is not yet merged
				hourBuckets: result.bladePoolBuckets?.hourBuckets?.filter((b) => b !== null),
				//@ts-expect-error - bladePoolBuckets is not defined in the schema b/c it is not yet merged
				dayBuckets: result.bladePoolBuckets?.dayBuckets?.filter((b) => b !== null),
			};
		}
		throw new Error("Invalid response");
	} catch {
		return {
			hourBuckets: [],
			dayBuckets: [],
		};
	}
}

// export type BladePoolBuckets = Awaited<ReturnType<typeof getBladePoolBuckets>>;

//manual typing for now until the schema is merged
export type BladePoolBuckets = {
	hourBuckets: {
		date: number;
		feesUSD: number;
		id: string;
		liquidityUSD: number;
		txCount: number;
		volumeUSD: number;
	}[];
	dayBuckets: {
		date: number;
		feesUSD: number;
		id: string;
		liquidityUSD: number;
		txCount: number;
		volumeUSD: number;
	}[];
};
