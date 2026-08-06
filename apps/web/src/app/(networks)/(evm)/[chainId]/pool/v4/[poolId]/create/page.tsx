import { Container } from '@sushiswap/ui'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { V4NewPosition } from './v4-new-position'

export default async function Page(props: {
  params: Promise<{ chainId: string; poolId: `0x${string}` }>
}) {
  const { chainId, poolId } = await props.params

  return (
    <section className="flex flex-col flex-1 mt-4">
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
        <Container maxWidth="5xl" className="px-4">
          <ConcentratedLiquidityProvider>
            <V4NewPosition chainId={+chainId} poolId={poolId} />
          </ConcentratedLiquidityProvider>
        </Container>
      </div>
    </section>
  )
}
