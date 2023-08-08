import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { IconButton, LinkInternal } from '@sushiswap/ui'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

import { ConcentratedLiquidityProvider } from '../../../../../ui/pool/ConcentratedLiquidityProvider'
import { NewPosition } from '../../../../../ui/pool/NewPosition'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <LinkInternal href={`/pool/${params.id}`} className="flex items-center gap-1">
          <IconButton variant="ghost" size="sm" name="go back" icon={ArrowLeftIcon} />
          <span className="text-sm font-medium">Go back to pool</span>
        </LinkInternal>
      </div>
      <ConcentratedLiquidityProvider>
        <NewPosition address={address} chainId={chainId} />
      </ConcentratedLiquidityProvider>
    </div>
  )
}
