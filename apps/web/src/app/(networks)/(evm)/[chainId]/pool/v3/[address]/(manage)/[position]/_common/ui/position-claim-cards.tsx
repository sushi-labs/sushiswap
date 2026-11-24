'use client'

import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardItem,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SkeletonText,
} from '@sushiswap/ui'
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
} from 'react'
import { useClaimableRewards } from 'src/lib/hooks/react-query/rewards/use-claimable-rewards'
import { useAmountUsd } from 'src/lib/hooks/use-amount-usd'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-position-owner'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { Amount, formatUSD } from 'sushi'
import {
  type EvmCurrency,
  type MerklChainId,
  type SushiSwapV3ChainId,
  getEvmChainById,
} from 'sushi/evm'
import { ClaimRewardsButton } from '~evm/_common/ui/claim-rewards/claim-rewards-button'
import { ConcentratedLiquidityCollectWidget } from './concentrated-liquidity-collect-widget'

interface PositionClaimCardProps {
  kind: 'Fees' | 'Rewards'
  totalUsd: number | undefined
  isLoading: boolean
  description: string
  children(close: () => void): ReactNode
}

function PositionClaimCard({
  kind,
  totalUsd,
  isLoading,
  description,
  children,
}: PositionClaimCardProps): ReactElement {
  const [open, setOpen] = useState(false)
  const action = `Claim ${kind}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex min-w-0 flex-col gap-4 p-5">
        <div
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
          aria-busy={isLoading}
        >
          <h3 className="text-sm text-muted-foreground">Unclaimed {kind}</h3>
          {isLoading ? (
            <SkeletonText className="w-24" fontSize="2xl" />
          ) : (
            <span className="text-2xl font-medium tabular-nums text-primary">
              {totalUsd === undefined ? '—' : formatUSD(totalUsd)}
            </span>
          )}
        </div>
        <DialogTrigger asChild>
          <Button fullWidth>{action}</Button>
        </DialogTrigger>
      </Card>
      <DialogContent className="max-h-[85dvh] overflow-y-auto !p-0">
        <DialogHeader className="px-6 pt-6 pr-14">
          <DialogTitle>{action}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children(() => setOpen(false))}
      </DialogContent>
    </Dialog>
  )
}

function useFeeUsd(amount: Amount<EvmCurrency> | undefined) {
  const isZero = amount?.amount === 0n
  const { data, isLoading } = useAmountUsd({ amount, enabled: !isZero })
  return { value: isZero ? 0 : data, isLoading }
}

type PositionFeesCardProps = Omit<
  ComponentProps<typeof ConcentratedLiquidityCollectWidget>,
  'amounts' | 'fiatValuesAmounts'
>

export function PositionFeesCard({
  onFeesClaimed,
  ...widgetProps
}: PositionFeesCardProps): ReactElement {
  const { positionDetails, token0, token1, isLoading } = widgetProps
  const fees = positionDetails?.fees
  const amounts = useMemo(() => {
    if (!token0 || !token1 || fees?.[0] === undefined || fees[1] === undefined)
      return [undefined, undefined]
    return [new Amount(token0, fees[0]), new Amount(token1, fees[1])]
  }, [token0, token1, fees])
  const first = useFeeUsd(amounts[0])
  const second = useFeeUsd(amounts[1])

  return (
    <PositionClaimCard
      kind="Fees"
      totalUsd={
        first.value !== undefined && second.value !== undefined
          ? first.value + second.value
          : undefined
      }
      isLoading={isLoading || first.isLoading || second.isLoading}
      description="Collect the trading fees earned by this position."
    >
      {(close) => (
        <ConcentratedLiquidityCollectWidget
          {...widgetProps}
          amounts={amounts}
          fiatValuesAmounts={[first.value, second.value]}
          onFeesClaimed={() => {
            close()
            onFeesClaimed?.()
          }}
        />
      )}
    </PositionClaimCard>
  )
}

export function PositionRewardsCard({
  chainId,
  tokenId,
}: {
  chainId: MerklChainId & SushiSwapV3ChainId
  tokenId: string
}): ReactElement {
  const { data: owner, isLoading: isOwnerLoading } =
    useConcentratedPositionOwner({ chainId, tokenId })
  const { data, isLoading: isRewardsLoading } = useClaimableRewards({
    chainIds: [chainId],
    account: owner,
  })
  const rewards = data?.[chainId]
  const isLoading = isOwnerLoading || isRewardsLoading

  return (
    <PositionClaimCard
      kind="Rewards"
      totalUsd={data ? (rewards?.totalRewardsUSD ?? 0) : undefined}
      isLoading={isLoading}
      description={`Claim the position owner's rewards across all positions on ${getEvmChainById(chainId).name}.`}
    >
      {(close) => (
        <>
          <CardContent>
            <CardGroup>
              {isLoading ? (
                <CardItem skeleton />
              ) : rewards ? (
                Object.values(rewards.rewardAmounts).map((amount) => (
                  <CardCurrencyAmountItem
                    key={amount.currency.id}
                    amount={amount}
                  />
                ))
              ) : (
                <CardItem
                  title={data ? 'No rewards found' : 'Rewards unavailable'}
                />
              )}
            </CardGroup>
          </CardContent>
          <CardFooter>
            {rewards ? (
              <Checker.Connect fullWidth namespace="evm">
                <Checker.Network fullWidth chainId={chainId}>
                  <ClaimRewardsButton
                    rewards={rewards}
                    onRewardsClaimed={close}
                  />
                </Checker.Network>
              </Checker.Connect>
            ) : (
              <Button fullWidth disabled loading={isLoading}>
                Claim
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </PositionClaimCard>
  )
}
