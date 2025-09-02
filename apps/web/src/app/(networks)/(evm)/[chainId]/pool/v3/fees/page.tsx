import { getV3BasePools } from '@sushiswap/graph-client/data-api'
import { Card, Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/TableFiltersNetwork'
import { SushiSwapV3ChainIds, isSushiSwapV3ChainId } from 'sushi/evm'
import { V3FeesTable } from './_ui/V3FeesTable'

export default async function Page(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

  if (!isSushiSwapV3ChainId(chainId)) {
    return notFound()
  }

  const pools = await unstable_cache(
    async () => getV3BasePools({ chainId }),
    ['operational-v3-pools', params.chainId],
    {
      revalidate: 60 * 15,
    },
  )()

  return (
    <Container maxWidth="7xl" className="px-4 flex flex-col gap-4">
      <div className="text-right">
        <TableFiltersNetwork
          network={chainId}
          supportedNetworks={SushiSwapV3ChainIds}
          unsupportedNetworkHref={'/ethereum/pool/v3/fees'}
          className="lg:hidden block"
        />
      </div>
      <Card>
        <V3FeesTable chainId={chainId} pools={pools} />
      </Card>
    </Container>
  )
}
