import { Amount, getChainById } from 'sushi'
import {
  type StellarAccountAddress,
  StellarChainId,
  type StellarToken,
} from 'sushi/stellar'
import { getTokenBalance } from '../../soroban'
import { fetchCommonTokensQueryFn } from './use-common-tokens'

type PortfolioEntry = {
  token: StellarToken<{ icon?: string }>
  balance: Amount<StellarToken<{ icon?: string }>>
}

export const getStellarPortfolioWallet = async (
  address: StellarAccountAddress,
) => {
  const tokens = await fetchCommonTokensQueryFn()
  const tokensWithBalances: PortfolioEntry[] = []
  for (const token of Object.values(tokens)) {
    if (!token.address) continue
    try {
      const balance = await getTokenBalance(address, token.address)
      if (balance && balance > 0n) {
        tokensWithBalances.push({ token, balance: new Amount(token, balance) })
      }
    } catch (error) {
      console.error(
        `Failed to get ${token.address} token balance for ${address}`,
        error,
      )
    }
  }
  return transformToPortfolioWallet(tokensWithBalances)
}

const chain = getChainById(StellarChainId.STELLAR)
const transformToPortfolioWallet = (entries: PortfolioEntry[]) => {
  return entries.map(({ token, balance }) => {
    return {
      token,
      id: token.address,
      chain: chain.key,
      chainId: chain.chainId,
      name: token.symbol,
      symbol: token.name,
      decimals: token.decimals,
      logoUrl: token.metadata?.icon ?? '',
      protocolId: 'stellar',
      price: 0,
      price24hChange: 0,
      isVerified: true,
      isCore: false,
      isWallet: false,
      timeAt: Date.now(),
      balance,
      amountUSD: 0,
    }
  })
}
