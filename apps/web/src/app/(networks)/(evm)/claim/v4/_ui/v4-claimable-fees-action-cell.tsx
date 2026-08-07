import { Button, DialogTrigger, LinkInternal } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { getEvmChainById } from 'sushi/evm'
import { useConnection } from 'wagmi'
import type { ClaimableV4Fees } from './v4-claimable-fees-tab'
import { V4CollectAllFeesDialog } from './v4-collect-all-fees-dialog'

export const V4ClaimableFeesActionCell: FC<Row<ClaimableV4Fees>> = ({
  original,
}) => {
  const { address } = useConnection()

  return (
    <div className="grid grid-cols-2 gap-3 w-[280px]">
      <V4CollectAllFeesDialog claimableFees={original} account={address}>
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
      </V4CollectAllFeesDialog>
      <Button size="default" fullWidth variant="secondary" asChild>
        <LinkInternal
          href={`/${getEvmChainById(original.chainId).key}/pool?tab=v4`}
        >
          View Positions
        </LinkInternal>
      </Button>
    </div>
  )
}
