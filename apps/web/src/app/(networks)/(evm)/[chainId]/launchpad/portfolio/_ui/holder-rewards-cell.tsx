'use client'

import type { LaunchpadUserHoldingsType } from '@sushiswap/graph-client/data-api'
import { createToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/checker'
import type { EvmAddress, LaunchpadV2ChainId } from 'sushi/evm'
import { formatUnits, isAddressEqual, zeroAddress } from 'viem'
import { useConnection, usePublicClient, useWriteContract } from 'wagmi'
import { formatRawAmount } from '../../_lib/format'
import { HOLDER_REWARDS_ABI } from '../../_providers/sushi-v2/contract'
import { useSushiV2LaunchInfo } from '../../_providers/sushi-v2/use-launch-info'
import { useHolderRewards } from '../_lib/use-holder-rewards'

type HoldingToken = LaunchpadUserHoldingsType['edges'][number]['node']['token']

function formatRewardAmount(amount: bigint, decimals: number): string {
  const formatted = formatRawAmount(amount, decimals, 6)
  return amount > 0n && formatted === '0' ? '<0.000001' : formatted
}

export function HolderRewardsCell({
  chainId,
  token,
  holder,
}: {
  chainId: LaunchpadV2ChainId
  token: HoldingToken
  holder: EvmAddress
}) {
  const canDistribute =
    token.provider === 'SUSHI_V2' &&
    token.tokenVersion === 'V2_2' &&
    token.feeDisposition !== 'BUYBACK_AND_BURN'
  const {
    data: launchInfo,
    isError: isLaunchInfoError,
    refetch: refetchLaunchInfo,
  } = useSushiV2LaunchInfo({
    chainId,
    factoryAddress: token.factoryAddress,
    address: token.address,
    enabled: canDistribute,
  })
  const distributor =
    canDistribute &&
    launchInfo?.feeDisposition === 'DISTRIBUTE_TO_HOLDERS' &&
    launchInfo.rewardDistributor !== zeroAddress
      ? launchInfo.rewardDistributor
      : undefined
  const {
    data: rewards,
    isError: isRewardsError,
    refetch: refetchRewards,
  } = useHolderRewards({
    chainId,
    token: token.address,
    distributor,
    holder,
  })
  const { address: connectedAddress, chainId: connectedChainId } =
    useConnection()
  const client = usePublicClient({ chainId })
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)

  async function claim(): Promise<void> {
    setClaimError(null)
    setIsClaiming(true)
    try {
      if (
        !client ||
        !distributor ||
        !connectedAddress ||
        !isAddressEqual(connectedAddress, holder)
      ) {
        throw new Error('Connect the holder wallet to claim rewards')
      }
      if (connectedChainId !== chainId)
        throw new Error('Switch to the launch network to claim rewards')
      const parameters = {
        chainId,
        account: connectedAddress,
        address: distributor,
        abi: HOLDER_REWARDS_ABI,
        functionName: 'claim',
        args: [holder],
      } as const
      await client.simulateContract(parameters)
      const hash = await writeContractAsync(parameters)
      const receiptPromise = client.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()
      void createToast({
        account: holder,
        chainId,
        txHash: hash,
        type: 'claimRewards',
        promise: receiptPromise,
        summary: {
          pending: `Claiming ${token.symbol} holder rewards`,
          completed: `${token.symbol} holder rewards claimed`,
          failed: `Failed to claim ${token.symbol} holder rewards`,
        },
        timestamp,
        groupTimestamp: timestamp,
        variant: 'perps',
      })
      const receipt = await receiptPromise
      if (receipt.status !== 'success') throw new Error('Reward claim failed')
      await refetchRewards()
    } catch (error) {
      if (!isUserRejectedError(error)) {
        setClaimError(
          error instanceof Error ? error.message : 'Reward claim failed',
        )
      }
    } finally {
      setIsClaiming(false)
    }
  }

  const feeDisposition = launchInfo?.feeDisposition ?? token.feeDisposition
  if (!canDistribute || feeDisposition !== 'DISTRIBUTE_TO_HOLDERS')
    return <span className="text-perps-muted-50">—</span>
  if (isLaunchInfoError || (distributor && isRewardsError)) {
    return (
      <div className="flex items-center justify-end gap-2 text-xs text-perps-muted-50">
        Rewards unavailable
        <Button
          size="xs"
          variant="perps-secondary"
          onClick={() =>
            void (isLaunchInfoError ? refetchLaunchInfo() : refetchRewards())
          }
        >
          Retry
        </Button>
      </div>
    )
  }
  if (!launchInfo || (distributor && !rewards)) {
    return (
      <span className="text-xs text-perps-muted-50" role="status">
        Loading rewards…
      </span>
    )
  }
  if (!distributor || !rewards)
    return <span className="text-perps-muted-50">—</span>

  const quote = token.quoteToken
  return (
    <div className="flex items-center justify-end gap-3">
      <div className="min-w-0 text-right">
        <div
          className="truncate font-semibold text-perps-muted"
          title={`${formatUnits(rewards.earned, quote.decimals)} ${quote.symbol} pending`}
        >
          {formatRewardAmount(rewards.earned, quote.decimals)} {quote.symbol}
        </div>
        <div
          className="mt-1 truncate text-xs text-perps-muted-50"
          title="Your estimated daily rewards at the current distribution rate. This rate can change."
        >
          ≈ {formatRewardAmount(rewards.ratePerDay, quote.decimals)}{' '}
          {quote.symbol}/day
        </div>
        {claimError ? (
          <div
            role="alert"
            className="truncate text-xs text-red"
            title={claimError}
          >
            Claim failed. Try again.
          </div>
        ) : null}
      </div>
      <div className="shrink-0">
        <Checker.Network
          chainId={chainId}
          size="xs"
          variant="perps-secondary"
          hideChainName
        >
          <Button
            size="xs"
            variant="perps-secondary"
            disabled={isClaiming || rewards.earned === 0n}
            onClick={() => void claim()}
          >
            {isClaiming ? 'Claiming…' : 'Claim'}
          </Button>
        </Checker.Network>
      </div>
    </div>
  )
}
