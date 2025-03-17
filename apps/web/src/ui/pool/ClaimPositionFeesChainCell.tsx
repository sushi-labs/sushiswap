import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { EvmChain } from 'sushi/chain'
import type { SushiSwapV3ChainId } from 'sushi/config'

export const ClaimPositionFeesChainCell: FC<
  Row<{
    chainId: SushiSwapV3ChainId
    positions: ConcentratedLiquidityPositionWithV3Pool[]
  }>
> = ({ original }) => {
  return (
    <div className="flex gap-2 items-center w-full">
      <NetworkIcon chainId={original.chainId} width={18} height={18} />
      <span className="font-medium text-sm whitespace-nowrap">
        {EvmChain.from(original.chainId)?.name}
      </span>
    </div>
  )
}
