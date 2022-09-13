import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Incentive } from '@sushiswap/graph-client/.graphclient'

export const incentiveRewardToToken = (chainId: ChainId, incentive: Incentive): Token => {
  return new Token({
    chainId,
    address: incentive.rewardToken.address,
    symbol: incentive.rewardToken.symbol,
    decimals: incentive.rewardToken.decimals,
  })
}
