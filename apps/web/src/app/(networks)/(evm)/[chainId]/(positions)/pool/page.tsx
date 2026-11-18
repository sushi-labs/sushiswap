import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { isSushiSwapChainId } from 'sushi/evm'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'
import { HideClosedPositions } from './_ui/hide-closed-positions'
import { PositionTypeSelector } from './_ui/position-type-selector'
import { PositionsTab } from './_ui/positions-tab'

export default async function MyPositionsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

  if (!isSushiSwapChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div className="flex flex-col xs:flex-row gap-3 flex-wrap items-start xs:items-center">
            <TableFiltersSearchToken />
            <PositionTypeSelector />
            <TableFiltersNetwork
              network={chainId}
              // todo: remove Mantle from PoolChainIds
              supportedNetworks={POOL_SUPPORTED_NETWORKS}
              unsupportedNetworkHref="/ethereum/pool"
            />
            <span className="block md:hidden">
              <HideClosedPositions />
            </span>
            <TableFiltersResetButton />
          </div>
          <span className="hidden md:block">
            <HideClosedPositions />
          </span>
        </div>
        <PositionsTab chainId={chainId} />
      </Container>
    </>
  )
}
