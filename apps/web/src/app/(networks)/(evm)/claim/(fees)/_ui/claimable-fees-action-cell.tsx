import { Button, DialogTrigger } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { getEvmChainById } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { ConcentratedLiquidityCollectAllDialog } from '~evm/_ui/concentrated-liquidity-collect-all-dialog'
import type { ClaimableFees } from './claimable-fees-tab'

export const ClaimableFeesActionCell: FC<Row<ClaimableFees>> = ({
  original,
}) => {
  const { address } = useConnection()

  return (
    <div className="grid grid-cols-2 gap-3 w-[280px]">
      <ConcentratedLiquidityCollectAllDialog
        positions={original.positions}
        chainId={original.chainId}
        account={address}
      >
        <Connect size="default" fullWidth>
          <Network
            size="default"
            fullWidth
            chainId={original.chainId}
            hideChainName
          >
            <DialogTrigger asChild>
              <Button size="default" fullWidth>
                Claim Fees
              </Button>
            </DialogTrigger>
          </Network>
        </Connect>
      </ConcentratedLiquidityCollectAllDialog>
      <Button size="default" fullWidth variant="secondary" asChild>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/${getEvmChainById(original.chainId).key}/pool`}
        >
          View Positions
        </a>
      </Button>
    </div>
  )
}
