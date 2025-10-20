import type { PortfolioV2PositionV3PoolType } from '@sushiswap/graph-client/data-api-portfolio'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionOwner'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { formatUSD } from 'sushi'
import {
  type MerklChainId,
  type SushiSwapV3ChainId,
  isMerklChainId,
} from 'sushi/evm'
import { ClaimRewardsButton } from '~evm/claim/rewards/_common/ui/claim-rewards-button'

export const Rewards = ({
  position,
}: { position: PortfolioV2PositionV3PoolType }) => {
  const chainId = position.pool.chainId as SushiSwapV3ChainId
  const { data: owner } = useConcentratedPositionOwner({
    chainId: chainId,
    tokenId: position.position.tokenId,
  })
  const { data: rewardsData, isLoading: isRewardsLoading } =
    useClaimableRewards({
      chainIds: [chainId as MerklChainId],
      account: owner,
      enabled: isMerklChainId(chainId),
    })

  const rewardsForChain = rewardsData?.[chainId as MerklChainId]
  const rewardAmounts = Object.entries(rewardsForChain?.rewardAmounts ?? {})

  const fiatValuesAmounts = useTokenAmountDollarValues({
    chainId: chainId,
    amounts: rewardAmounts.map(([_, amount]) => amount),
  })

  return (
    <Card className="!bg-slate-50 dark:!bg-slate-800">
      <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
        <div>
          <CardTitle className="mb-1">Rewards</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD(rewardsForChain?.totalRewardsUSD ?? 0)}
          </CardDescription>
        </div>
        <Checker.Network size="default" fullWidth={false} chainId={chainId}>
          <ClaimRewardsButton
            className="w-[128px]"
            fullWidth={false}
            rewards={rewardsForChain}
            disabled={!rewardsForChain}
          />
        </Checker.Network>
      </CardHeader>

      <CardContent
        className={classNames(rewardAmounts.length > 0 ? '!p-3' : '!p-0')}
      >
        <CardGroup>
          {rewardAmounts.map(([tokenAddress, amount], idx) => (
            <CardCurrencyAmountItem
              key={tokenAddress}
              isLoading={isRewardsLoading}
              amount={amount}
              fiatValue={formatUSD(fiatValuesAmounts[idx])}
              amountClassName="!font-medium"
            />
          ))}
        </CardGroup>
      </CardContent>
    </Card>
  )
}
