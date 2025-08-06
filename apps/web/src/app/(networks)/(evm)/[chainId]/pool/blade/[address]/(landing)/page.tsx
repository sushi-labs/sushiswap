import { type V2Pool, getV2Pool } from "@sushiswap/graph-client/data-api";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PoolChartBlade } from "src/ui/pool/pool-chart-blade";
import { PoolPageBlade } from "src/ui/pool/PoolPageBlade";

import { PoolPageV2 } from "src/ui/pool/PoolPageV2";
import type { EvmChainId } from "sushi";
import { isBladeChainId } from "sushi/config";
import { isAddress } from "viem";

export default async function PoolPage(props: { params: Promise<{ chainId: string; address: string }> }) {
	const params = await props.params;
	const { chainId: _chainId, address } = params;

	const chainId = +_chainId as EvmChainId;

	if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
		return notFound();
	}

	// const pool = (await unstable_cache(
	//   async () => await getV2Pool({ chainId, address }, { retries: 3 }),
	//   ['blade', 'pool', `${chainId}:${address}`],
	//   {
	//     revalidate: 60 * 15,
	//   },
	// )()) as V2Pool

	// return <PoolPageBlade pool={pool} />
	return <PoolChartBlade pool={undefined} />;
}
