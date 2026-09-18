'use client'

import {
  ArrowPathIcon,
  FireIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Button, SkeletonBox } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { zeroAddress } from 'viem'
import { useReadContracts } from 'wagmi'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount, shortenAddress } from '../../../_lib/format'
import { useFeeDistribution } from '../../../_lib/use-fee-distribution'
import type { LaunchpadTokenFor } from '../../../_providers/provider-types'
import {
  HOLDER_REWARDS_ABI,
  type SushiV2FeeDestination,
  getSushiV2FeeRoutes,
} from '../../../_providers/sushi-v2/contract'
import { useSushiV2LaunchInfo } from '../../../_providers/sushi-v2/use-launch-info'
import { TokenAvatar } from '../../../_ui/_common/token-avatar'

const DESTINATIONS = {
  FEE_RECEIVER: { label: 'Fee Recipient', icon: UserCircleIcon },
  BURN: { label: 'Burned', icon: FireIcon },
  BUYBACK: { label: 'Buyback & burn', icon: ArrowPathIcon },
  HOLDERS: { label: 'Holder rewards', icon: UsersIcon },
} as const

export function DistributeFeesCard({
  token,
}: {
  token: LaunchpadTokenFor<'SUSHI_V1' | 'SUSHI_V2'>
}): React.ReactElement {
  const { chainId, address } = token
  const queryClient = useQueryClient()
  const isV2 = token.__typename === 'SushiV2LaunchpadToken'
  const launchInfo = useSushiV2LaunchInfo({
    chainId,
    address,
    factoryAddress: token.factoryAddress,
    enabled: isV2,
  })
  const distribution = useFeeDistribution({ chainId, address, token })
  const feeMode = isV2 ? launchInfo.data?.feeDisposition : 'DIRECT_PAYOUT'
  const feeReceiver = isV2 ? launchInfo.data?.feeReceiver : token.creator
  const distributor = launchInfo.data?.rewardDistributor
  const rate = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        chainId,
        address: distributor,
        abi: HOLDER_REWARDS_ABI,
        functionName: 'rewardRateScaled',
      },
      {
        chainId,
        address: distributor,
        abi: HOLDER_REWARDS_ABI,
        functionName: 'PRECISION',
      },
    ],
    query: {
      enabled:
        feeMode === 'DISTRIBUTE_TO_HOLDERS' &&
        Boolean(distributor && distributor !== zeroAddress),
      staleTime: 0,
      refetchInterval: ms('15s'),
    },
  })
  const breakdown = distribution.preview?.breakdown
  const routes = feeMode ? getSushiV2FeeRoutes(feeMode) : undefined
  const quote = token.pool.quoteToken
  const hasFees = distribution.preview
    ? distribution.preview.quoteCollected > 0n ||
      distribution.preview.tokenCollected > 0n
    : false
  const isPreviewError =
    distribution.isPreviewError || (isV2 && launchInfo.isError)

  async function refresh(): Promise<void> {
    await Promise.all([
      distribution.refetch(),
      ...(isV2 ? [launchInfo.refetch()] : []),
      ...(feeMode === 'DISTRIBUTE_TO_HOLDERS' ? [rate.refetch()] : []),
    ])
  }

  async function distribute(): Promise<void> {
    if (isV2)
      void queryClient.invalidateQueries({ queryKey: launchInfo.queryKey })
    if (feeMode === 'DISTRIBUTE_TO_HOLDERS')
      void queryClient.invalidateQueries({ queryKey: rate.queryKey })
    if (await distribution.distributeFees()) {
      if (isV2) void launchInfo.refetch()
      if (feeMode === 'DISTRIBUTE_TO_HOLDERS') void rate.refetch()
    }
  }

  return (
    <PerpsCard className="p-4" fullWidth>
      <h2 className="font-semibold text-perps-muted">Distribute fees</h2>
      {feeMode === 'DISTRIBUTE_TO_HOLDERS' ? (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-perps-muted-50">
          <span className="shrink-0">Current distribution:</span>{' '}
          <span className="flex min-w-0 items-center justify-end gap-1.5 text-right font-medium text-perps-muted">
            <span className="min-w-0 break-words">
              {rate.isError
                ? 'Rate unavailable'
                : rate.data
                  ? `${formatRawAmount((rate.data[0] * 86_400n) / rate.data[1], quote.decimals, 6)} ${quote.symbol} / day`
                  : 'Loading rate…'}
            </span>
          </span>
        </div>
      ) : null}
      {isPreviewError ? (
        <div
          className="mt-3 flex items-center justify-between gap-2 text-xs text-perps-muted-50"
          role="alert"
        >
          Fee preview unavailable
          <Button
            variant="perps-secondary"
            size="xs"
            onClick={() => void refresh()}
          >
            Retry
          </Button>
        </div>
      ) : !breakdown || !routes ? (
        <div className="mt-4 space-y-3" role="status" aria-label="Loading fees">
          <SkeletonBox className="h-10 w-full rounded-lg" />
          <SkeletonBox className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        <div className="mt-3 divide-y divide-white/[0.06]">
          {[
            {
              currency: token,
              destinations: routes.launchToken,
              amount:
                breakdown.launchTokenToReceiver +
                breakdown.launchTokenFeesBurned,
            },
            {
              currency: quote,
              destinations: routes.quote,
              amount: breakdown.quoteToReceiver + breakdown.quoteUsedForBuyback,
            },
          ].map(({ currency, destinations, amount }) =>
            destinations
              .filter(
                (
                  destination,
                ): destination is Exclude<SushiV2FeeDestination, 'SUSHI'> =>
                  destination !== 'SUSHI',
              )
              .map((destination) => {
                const { label, icon: Icon } = DESTINATIONS[destination]
                return (
                  <div
                    key={`${currency.address}:${destination}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div
                      className="flex min-w-0 items-center gap-2 text-perps-muted-50"
                      title={
                        destination === 'FEE_RECEIVER' ? feeReceiver : undefined
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{label}</span>
                    </div>
                    <div className="min-w-0 text-right text-perps-muted">
                      <div className="flex items-center justify-end gap-1.5 font-medium">
                        <TokenAvatar
                          token={{ ...currency, chainId }}
                          size="xs"
                        />
                        <span className="min-w-0 break-words">
                          {formatRawAmount(amount, currency.decimals, 6)}{' '}
                          {currency.symbol}
                        </span>
                      </div>
                      {destination === 'BUYBACK' ? (
                        <div className="mt-0.5 text-xs text-perps-muted-50">
                          ≈{' '}
                          {formatRawAmount(
                            breakdown.launchTokenBoughtAndBurned,
                            token.decimals,
                            6,
                          )}{' '}
                          {token.symbol} burned
                        </div>
                      ) : null}
                      {destination === 'FEE_RECEIVER' && feeReceiver ? (
                        <div className="mt-0.5 text-xs text-perps-muted-50">
                          {shortenAddress(feeReceiver, 4)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              }),
          )}
        </div>
      )}

      {distribution.error ? (
        <p role="alert" className="mt-3 break-words text-xs text-red">
          {distribution.error}
        </p>
      ) : null}
      <div className="mt-4">
        <Checker.Connect
          namespace="evm"
          fullWidth
          size="sm"
          variant="perps-default"
        >
          <Checker.Network
            chainId={chainId}
            fullWidth
            size="sm"
            variant="perps-default"
            hideChainName
          >
            <Button
              fullWidth
              size="sm"
              variant="perps-default"
              disabled={
                distribution.isDistributing ||
                distribution.distributed ||
                !hasFees ||
                !routes ||
                isPreviewError
              }
              onClick={() => void distribute()}
            >
              {distribution.isDistributing
                ? 'Distributing…'
                : distribution.distributed
                  ? 'Fees distributed'
                  : 'Distribute fees'}
            </Button>
          </Checker.Network>
        </Checker.Connect>
      </div>
    </PerpsCard>
  )
}
