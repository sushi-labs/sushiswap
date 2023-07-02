import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { Token } from '@sushiswap/currency'

export const incentiveRewardToToken = (chainId: ChainId, incentive: Pool['incentives'][0]): Token => {
  return new Token({
    chainId,
    address: incentive.rewardToken.address,
    symbol: incentive.rewardToken.symbol,
    decimals: incentive.rewardToken.decimals,
  })
}
