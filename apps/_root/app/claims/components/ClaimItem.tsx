'use client'

import { classNames, Currency, NetworkIcon } from '@sushiswap/ui'
import React, { FC, useMemo } from 'react'
import { RP2MerkleTreeClaimSchema } from '@sushiswap/wagmi/future/hooks/exploits/constants'
import { z } from 'zod'
import {
  useRP2ExploitClaim,
  useRP2ExploitIsClaimed,
  useTokenAllowance,
  useTokenRevokeApproval,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Amount } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { Button } from '@sushiswap/ui/future/components/button'
import { RP2ClaimChainId } from '@sushiswap/wagmi/future/hooks/exploits/types'
import { CheckIcon } from '@heroicons/react-v1/solid'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { Address } from 'wagmi'
import { routeProcessor2Address } from '@sushiswap/route-processor/exports/exports'
import { ZERO } from '@sushiswap/math'
import { Badge } from '@sushiswap/ui/future/components/Badge'

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
    spender: routeProcessor2Address[chainId],
  })

  const { write: revoke, isPending: isRevokePending } = useTokenRevokeApproval({
    account,
    token,
    spender: routeProcessor2Address[chainId],
  })

  const amount = useMemo(
    () => (token ? Amount.fromRawAmount(token, BigNumber.from(claim.amount).toString()) : undefined),
    [claim.amount, token]
  )

  const isLoading = isAllowanceLoading || checkIsClaimedLoading || tokenLoading

  return (
    <div className={classNames('grid grid-cols-3 items-center', 'gap-2 py-3 px-4 h-[52px]')}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-600 dark:text-white">
          {isLoading ? (
            <div className="flex gap-3 items-center">
              <Skeleton.Circle radius={24} />
              <Skeleton.Text fontSize="text-sm" className="max-w-[100px]" />
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
            <Skeleton.Text className="max-w-[75px]" align="right" />
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
        <Skeleton.Text className="max-w-[100px]" align="right" />
      ) : (
        <div className="flex justify-end">
          {!isClaimed ? (
            <Checker.Connect size="xs">
              <Checker.Network size="xs" chainId={chainId}>
                {allowance.greaterThan(ZERO) ? (
                  <Button
                    size="xs"
                    color="blue"
                    loading={isRevokePending}
                    disabled={isRevokePending}
                    onClick={() => revoke?.()}
                  >
                    Revoke Approval
                  </Button>
                ) : (
                  <Button
                    onClick={() => write?.()}
                    size="xs"
                    disabled={isClaimPending}
                    loading={isClaimPending}
                    variant="filled"
                    color="blue"
                  >
                    <div className="flex gap-1 items-center">Claim</div>
                  </Button>
                )}
              </Checker.Network>
            </Checker.Connect>
          ) : (
            <Button size="xs" variant="outlined" color="green" className="pointer-events-none">
              <div className="flex gap-1 items-center">
                <CheckIcon strokeWidth={2} width={16} height={16} className="text-green" />
                Claimed
              </div>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
