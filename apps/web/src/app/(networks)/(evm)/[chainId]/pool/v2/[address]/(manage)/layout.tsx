import { Container, LinkExternal, Message } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'
import { getEvmChainById, isEvmAddress, isSushiSwapV2ChainId } from 'sushi/evm'
import { PoolHeader } from '~evm/[chainId]/pool/_ui/pool-header'
import { getCachedV2Pool } from '../_lib/get-cached-v2-pool'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV2ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await getCachedV2Pool({ chainId, address }))!

  const headersList = await headers()
  const referer = headersList.get('referer')
  return (
    <>
      <Container maxWidth="7xl" className="pt-6 px-4">
        <PoolHeader
          backUrl={referer?.includes('/pool') ? referer?.toString() : undefined}
          address={pool.address}
          pool={pool}
          apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
        />
      </Container>
      <section className="flex flex-col flex-1">
        <Container maxWidth="7xl" className="px-4 py-10">
          {children}
          <Message size="sm" variant="info" className="mt-6">
            <h1 className="py-1 text-lg text-primary">
              Not seeing your position?
            </h1>
            We&apos;re beginning to phase out the staking contracts used for V2
            pools to make way for new and improved technology. If you have any
            staked positions and wish to unstake and claim your rewards, please
            visit{' '}
            <LinkExternal href="https://deprecated.sushi.com/farms">
              <span className="text-muted-foreground">
                https://deprecated.sushi.com/farms
              </span>
            </LinkExternal>
          </Message>
        </Container>
      </section>
    </>
  )
}
