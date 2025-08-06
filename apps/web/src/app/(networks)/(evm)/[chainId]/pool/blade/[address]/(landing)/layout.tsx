import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { ChainKey, type EvmChainId, SushiSwapProtocol } from 'sushi'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  // const params = await props.params

  const { children } = props

  // const { chainId: _chainId, address } = params
  // const chainId = +_chainId as EvmChainId

  // if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
  // 	return notFound();
  // }

  // const pool = (await unstable_cache(
  //   async () => getV2Pool({ chainId, address }, { retries: 3 }),
  //   ['blade', 'pool', `${chainId}:${address}`],
  //   {
  //     revalidate: 60 * 15,
  //   },
  // )()) as V2Pool

  // const headersList = await headers();
  // const referer = headersList.get("referer");
  return (
    <>
      {/* <Container maxWidth="screen-3xl" className="px-4 pt-10">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${ChainKey[chainId]}/explore/pools`
          }
          address={pool.address}
          pool={{
            ...pool,
            // @ts-expect-errorun
            // okay until we have a blade pool type
            protocol: 'BLADE',
          }}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
          showAddLiquidityButton={true}
        />
      </Container> */}
      <section className="flex flex-col flex-1 mt-4">
        <div className="h-full md:py-7">{children}</div>
      </section>
    </>
  )
}
