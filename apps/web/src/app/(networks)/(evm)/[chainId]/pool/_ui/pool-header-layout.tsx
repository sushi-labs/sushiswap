import { Container } from '@sushiswap/ui'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { PoolHeader } from './pool-header'

type PoolHeaderLayoutProps = Pick<
  ComponentProps<typeof PoolHeader>,
  'address' | 'showAddLiquidityButton'
> & {
  backUrl?: string
  pool: ComponentProps<typeof PoolHeader>['pool'] & {
    incentiveApr: number
    feeApr1d: number
  }
  children: ReactNode
}

/** A pool page's header above its content, for V3 and V4 pools. */
export async function PoolHeaderLayout({
  address,
  pool,
  backUrl = `/${getEvmChainById(pool.chainId).key}/explore/pools`,
  showAddLiquidityButton = false,
  children,
}: PoolHeaderLayoutProps): Promise<ReactElement> {
  return (
    <>
      <Container maxWidth="5xl" className="pt-10 px-4">
        <PoolHeader
          backUrl={backUrl}
          address={address}
          pool={pool}
          apy={{ rewards: pool.incentiveApr, fees: pool.feeApr1d }}
          showAddLiquidityButton={showAddLiquidityButton}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 flex-1">
          {children}
        </div>
      </section>
    </>
  )
}
