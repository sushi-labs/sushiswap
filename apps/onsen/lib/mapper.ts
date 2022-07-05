import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Pair as PairDTO, Token as TokenDTO } from '@sushiswap/graph-client'

import { TokenType } from './enums'
import { Incentive } from './Incentive'

export function toToken(token: TokenDTO, chainId: ChainId): Token {
  return new Token({
    chainId,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}

export function updateIncentivePricing(
  incentive: Incentive,
  prices: { [key: string]: number },
  legacyPairs: Record<string, PairDTO> | undefined
): void {
  console.debug('incentive id:', incentive.id, '\nrewards remaining:', incentive.rewardsRemaining.toExact())
  const price = prices[incentive.rewardToken.address.toLowerCase()]
  if (price) {
    incentive.rewardUsd = price
  }
  if (incentive.tokenType === TokenType.LEGACY) {
    const pair = legacyPairs ? legacyPairs[incentive.liquidityStaked.currency.address.toLocaleLowerCase()] : undefined
    // TODO: change number to JSBI
    if (pair?.reserveUSD && pair?.totalSupply) {
      incentive.tvl = (Number(incentive.liquidityStaked.toExact()) / Number(pair.totalSupply)) * Number(pair.reserveUSD)
    }
  } else if (incentive.tokenType === TokenType.TOKEN) {
    const price = prices[incentive.liquidityStaked.currency.address.toLowerCase()]
    incentive.tvl = Number(price) * Number(incentive.liquidityStaked.toExact())
  }
}
