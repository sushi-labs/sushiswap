import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Reward as RewardDTO } from '@sushiswap/graph-client'

import { toToken } from './mapper'

export class Reward {
  public readonly claimedAmount: Amount<Token>
  public readonly claimableAmount: Amount<Token>

  public constructor({ chainId, reward }: { chainId: ChainId; reward: RewardDTO }) {
    // const now = Date.now() / 1000
    // const passedTime = now - reward.modifiedAtTimestamp
    // TODO: calculate passed time since update, calculate shares and amount to add to claimedAmount
    this.claimedAmount = Amount.fromRawAmount(toToken(reward.token, chainId), reward.claimedAmount)
    this.claimableAmount = Amount.fromRawAmount(
      toToken(reward.token, chainId),
      parseUnits(reward.claimableAmount, reward.token.decimals).toString()
    )
  }
}
