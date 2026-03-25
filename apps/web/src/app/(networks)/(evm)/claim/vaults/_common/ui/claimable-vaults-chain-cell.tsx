import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ChainVaultData } from 'src/lib/steer/hooks/use-claimable-vaults'
import { getEvmChainById } from 'sushi/evm'

export const ClaimableVaultsChainCell: FC<Row<ChainVaultData>> = ({
  original,
}) => {
  const chain = getEvmChainById(original.chainId)

  return (
    <div className="flex items-center gap-3">
      <NetworkIcon chainId={original.chainId} width={18} height={18} />
      <span className="font-medium">{chain.name}</span>
    </div>
  )
}
