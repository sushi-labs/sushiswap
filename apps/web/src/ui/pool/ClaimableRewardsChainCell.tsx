import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { EvmChain } from 'sushi/chain'

export const ClaimableRewardsChainCell: FC<Row<ClaimableRewards>> = ({
  original,
}) => {
  return (
    <div className="flex gap-2 items-center w-full">
      <NetworkIcon chainId={original.chainId} width={18} height={18} />
      <span className="font-medium text-sm whitespace-nowrap">
        {EvmChain.from(original.chainId)?.name}
      </span>
    </div>
  )
}
