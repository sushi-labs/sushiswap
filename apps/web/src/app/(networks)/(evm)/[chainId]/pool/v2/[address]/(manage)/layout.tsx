import { V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { Container, LinkExternal, Message } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { ChainKey, EvmChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV2ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => getV2Pool({ chainId, address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V2Pool

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/${ChainKey[chainId]}/explore/pools`
          }
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
          <Container maxWidth="5xl" className="px-4">
            <Message size="sm" variant="info" className="mb-6">
              <h1 className="py-1 text-lg text-slate-200">
                Not seeing your position?
              </h1>
              We’re beginning to phase out the staking contracts used for V2
              pools to make way for new and improved technology. If you have any
              staked positions and wish to unstake and claim your rewards,
              please visit{' '}
              <LinkExternal href="https://deprecated.sushi.com/farms">
                <span className="text-slate-300">
                  https://deprecated.sushi.com/farms
                </span>
              </LinkExternal>
            </Message>
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}
