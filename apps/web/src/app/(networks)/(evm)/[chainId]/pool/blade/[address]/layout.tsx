import { getV2Pool } from "@sushiswap/graph-client/data-api";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import type { EvmChainId } from "sushi";
import { isBladeChainId } from "sushi/config";
import { isAddress } from "viem";

// export async function generateMetadata(props: {
//   params: Promise<{ chainId: string; address: string }>
// }): Promise<Metadata> {
//   console.log('generateMetadata')
//   const params = await props.params
//   const { chainId: _chainId, address } = params
//   const chainId = +_chainId as EvmChainId

//   if (
//     !isBladeChainId(chainId) ||
//     !isAddress(address, { strict: false })
//   ) {
//     return {}
//   }

//   const pool = await unstable_cache(
//     async () => getV2Pool({ chainId, address }, { retries: 3 }),
//     ['v2', 'pool', `${chainId}:${address}`],
//     {
//       revalidate: 60 * 15,
//     },
//   )()

//   if (!pool) {
//     return {}
//   }

//   return {
//     title: `BUY & SELL ${pool.token0.symbol}/${pool.token1.symbol}`,
//   }
// }

export default async function Layout(props: {
	children: React.ReactNode;
	params: Promise<{ chainId: string; address: string }>;
}) {
	const params = await props.params;

	const { children } = props;

	const { chainId: _chainId, address } = params;
	const chainId = +_chainId as EvmChainId;

	if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
		return notFound();
	}

	// const pool = await unstable_cache(
	//   async () => getV2Pool({ chainId, address }, { retries: 3 }),
	//   ['v2', 'pool', `${chainId}:${address}`],
	//   {
	//     revalidate: 60 * 15,
	//   },
	// )()

	// // Rockstar C&D
	// if (!pool || pool.id === '42161:0x0a4f9962e24893a4a7567e52c1ce37d5482365de') {
	//   return notFound()
	// }

	return <>{children}</>;
}
