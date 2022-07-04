import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Reward as RewardDTO, StakePosition as StakePositionDTO } from '@sushiswap/graph-client'

import { toToken } from './mapper'

export class Reward {
  public readonly claimedAmount: Amount<Token>
  public readonly claimableAmount: Amount<Token>

  public constructor({
    chainId,
    reward,
    stakePosition,
  }: {
    chainId: ChainId
    reward: RewardDTO
    stakePosition: StakePositionDTO
  }) {
    const rewardToken = toToken(reward.token, chainId)
    this.claimedAmount = Amount.fromRawAmount(rewardToken, reward.claimedAmount)
    this.claimableAmount = Amount.fromRawAmount(
      rewardToken,
      parseUnits(reward.claimableAmount, reward.token.decimals).toString()
    ).add(this.calculateClaimableRewards(rewardToken, reward, stakePosition))
  }

  private calculateClaimableRewards(rewardToken: Token, reward: RewardDTO, stakePosition: StakePositionDTO) {
    const now = Date.now() / 1000
    const isActive = now < reward.incentive.endTime
    const current = isActive ? now : reward.incentive.endTime
    const totalTime = reward.incentive.endTime - reward.modifiedAtTimestamp
    const passedTime = current - reward.modifiedAtTimestamp
    const rewardsAccrued = (reward.incentive.rewardsRemaining * passedTime) / totalTime // TODO: wrap with BigNumber
    if (!stakePosition.liquidity || !reward.incentive.liquidityStaked) {
      return Amount.fromRawAmount(rewardToken, '0')
    }
    const share = Number(stakePosition.liquidity) / reward.incentive.liquidityStaked
    const claimableRewards = Number(share * rewardsAccrued).toFixed()
    return Amount.fromRawAmount(rewardToken, claimableRewards.toString())
  }
}
