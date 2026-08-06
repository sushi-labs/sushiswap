import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { parsePositionTokenId } from 'src/lib/wagmi/hooks/positions/position-token-id'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { V4PositionView } from './v4-position-view'

export default async function Page(props: {
  params: Promise<{
    chainId: string
    poolId: `0x${string}`
    position: string
  }>
}) {
  const { chainId, poolId, position } = await props.params
  const tokenId = parsePositionTokenId(position)

  if (!tokenId) {
    return notFound()
  }

  return (
    <section className="flex flex-col flex-1 mt-4">
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
        <Container maxWidth="5xl" className="px-4">
          <ConcentratedLiquidityProvider>
            <V4PositionView
              chainId={+chainId}
              poolId={poolId}
              tokenId={tokenId}
            />
          </ConcentratedLiquidityProvider>
        </Container>
      </div>
    </section>
  )
}
