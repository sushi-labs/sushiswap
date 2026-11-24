import {
  Button,
  DialogClose,
  LinkInternal,
  buttonVariants,
} from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { getEvmChainById } from 'sushi/evm'
import { ClaimRewardsButton } from './claim-rewards-button'

export function ClaimableRewardsActionCell({
  original,
  onClaim,
}: Row<ClaimableRewards> & {
  onClaim?: (rewards: ClaimableRewards) => void
}): ReactNode {
  const size = onClaim ? 'sm' : 'default'
  const href = `/${getEvmChainById(original.chainId).key}/pool`

  return (
    <div
      className={
        onClaim
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-[280px]'
          : 'grid grid-cols-2 gap-3 w-[280px]'
      }
    >
      <Connect size={size} fullWidth>
        <Network size={size} fullWidth chainId={original.chainId} hideChainName>
          {onClaim ? (
            <Button size={size} fullWidth onClick={() => onClaim(original)}>
              Claim Rewards
            </Button>
          ) : (
            <ClaimRewardsButton rewards={original} />
          )}
        </Network>
      </Connect>

      {onClaim ? (
        <DialogClose asChild>
          <LinkInternal
            href={href}
            className={buttonVariants({
              size,
              variant: 'secondary',
              className: 'w-full',
            })}
          >
            View Positions
          </LinkInternal>
        </DialogClose>
      ) : (
        <Button size={size} fullWidth variant="secondary" asChild>
          <a target="_blank" rel="noopener noreferrer" href={href}>
            View Positions
          </a>
        </Button>
      )}
    </div>
  )
}
