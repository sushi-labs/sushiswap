import { Button, DialogTrigger } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { ChainKey } from 'sushi/chain'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { useAccount } from 'wagmi'
import type { ClaimableFees } from './ClaimableFeesTab'
import { ConcentratedLiquidityCollectAllDialog } from './ConcentratedLiquidityCollectAllDialog'

export const ClaimableFeesActionCell: FC<Row<ClaimableFees>> = ({
  original,
}) => {
  const { address } = useAccount()

  return (
    <div className="grid grid-cols-2 gap-3 w-[280px]">
      <ConcentratedLiquidityCollectAllDialog
        positions={original.positions}
        chainId={original.chainId}
        account={address}
      >
        <Checker.Connect size="default" fullWidth>
          <Checker.Network
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
          </Checker.Network>
        </Checker.Connect>
      </ConcentratedLiquidityCollectAllDialog>
      <Button size="default" fullWidth variant="secondary" asChild>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/${ChainKey[original.chainId]}/pool`}
        >
          View Positions
        </a>
      </Button>
    </div>
  )
}
