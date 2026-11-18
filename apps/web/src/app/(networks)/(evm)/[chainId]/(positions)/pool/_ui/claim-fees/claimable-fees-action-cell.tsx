import {
  Button,
  DialogClose,
  LinkInternal,
  buttonVariants,
} from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { getEvmChainById } from 'sushi/evm'
import type { ClaimableFees } from './claimable-fees-dialog'

export function ClaimableFeesActionCell({
  original,
  onClaim,
}: Row<ClaimableFees> & {
  onClaim: (claim: ClaimableFees) => void
}): ReactNode {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-[280px]">
      <Connect size="sm" fullWidth>
        <Network size="sm" fullWidth chainId={original.chainId} hideChainName>
          <Button size="sm" fullWidth onClick={() => onClaim(original)}>
            Claim Fees
          </Button>
        </Network>
      </Connect>
      <DialogClose asChild>
        <LinkInternal
          href={`/${getEvmChainById(original.chainId).key}/pool?tab=v3`}
          className={buttonVariants({
            size: 'sm',
            variant: 'secondary',
            className: 'w-full',
          })}
        >
          View Positions
        </LinkInternal>
      </DialogClose>
    </div>
  )
}
