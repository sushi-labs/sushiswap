'use client'

import { CheckIcon } from '@heroicons/react-v1/solid'
import { Amount } from '@sushiswap/currency'
import { ZERO } from 'sushi'
import { ROUTE_PROCESSOR_2_ADDRESS } from '@sushiswap/route-processor-sdk'
import { classNames } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Address } from '@sushiswap/wagmi'
import {
  useRP2ExploitClaim,
  useRP2ExploitIsClaimed,
  useTokenAllowance,
  useTokenRevokeApproval,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { RP2MerkleTreeClaimSchema } from '@sushiswap/wagmi/future/hooks/exploits/constants'
import { RP2ClaimChainId } from '@sushiswap/wagmi/future/hooks/exploits/types'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import React, { FC, useMemo } from 'react'
import { z } from 'zod'

interface ClaimItem {
  account: Address
  chainId: RP2ClaimChainId
  claim: z.TypeOf<typeof RP2MerkleTreeClaimSchema>
}

export const ClaimItem: FC<ClaimItem> = ({ chainId, account, claim }) => {
  const { data: token, isLoading: tokenLoading } = useTokenWithCache({ chainId, address: claim.token })
  const { data: isClaimed, isLoading: checkIsClaimedLoading } = useRP2ExploitIsClaimed({ index: claim.index, chainId })
  const { write, isPending: isClaimPending } = useRP2ExploitClaim({ claim, chainId, account, token })
  const { data: allowance, isLoading: isAllowanceLoading } = useTokenAllowance({
    token,
    chainId,
    owner: account,
    spender: ROUTE_PROCESSOR_2_ADDRESS[chainId],
  })

  const { write: revoke, isPending: isRevokePending } = useTokenRevokeApproval({
    account,
    token,
    spender: ROUTE_PROCESSOR_2_ADDRESS[chainId],
  })

  const amount = useMemo(
    () => (token ? Amount.fromRawAmount(token, claim.amount.toString()) : undefined),
    [claim.amount, token]
  )

  const isLoading = isAllowanceLoading || checkIsClaimedLoading || tokenLoading

  return (
    <div className={classNames('grid grid-cols-3 items-center', 'gap-2 py-3 px-4 h-[52px]')}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-600 dark:text-white">
          {isLoading ? (
            <div className="flex gap-3 items-center">
              <SkeletonCircle radius={24} />
              <SkeletonText fontSize="sm" className="max-w-[100px]" />
            </div>
          ) : token ? (
            <div className="flex gap-3 items-center">
              <Badge
                position="bottom-right"
                badgeContent={<NetworkIcon chainId={token.chainId} width={16} height={16} />}
              >
                <Currency.Icon currency={token} width={24} height={24} />
              </Badge>
              {token.name} ({token.symbol})
            </div>
          ) : (
            <></>
          )}
        </span>
      </div>
      <div className="flex justify-end">
        <span className="w-full text-right flex justify-end text-sm font-semibold text-gray-900 dark:text-white">
          {isLoading ? (
            <SkeletonText className="max-w-[75px]" align="right" />
          ) : token ? (
            <>
              {amount?.toSignificant(6)} {token.symbol}
            </>
          ) : (
            <></>
          )}
        </span>
      </div>
      {!allowance || isLoading ? (
        <SkeletonText className="max-w-[100px]" align="right" />
      ) : (
        <div className="flex justify-end">
          {!isClaimed ? (
            <Checker.Connect size="sm">
              <Checker.Network size="sm" chainId={chainId}>
                {allowance.greaterThan(ZERO) ? (
                  <Button size="sm" loading={isRevokePending} disabled={isRevokePending} onClick={() => revoke?.()}>
                    Revoke Approval
                  </Button>
                ) : (
                  <Button onClick={() => write?.()} size="sm" disabled={isClaimPending} loading={isClaimPending}>
                    <div className="flex gap-1 items-center">Claim</div>
                  </Button>
                )}
              </Checker.Network>
            </Checker.Connect>
          ) : (
            <Button icon={CheckIcon} size="sm" variant="secondary" className="pointer-events-none">
              Claimed
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
