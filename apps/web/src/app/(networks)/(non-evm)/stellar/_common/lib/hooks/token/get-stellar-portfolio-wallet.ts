import { getChainById } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { formatUnits } from 'viem'
import { getTokenBalance } from '../../soroban'
import type { TokenWithBalance } from '../../types/token.type'
import { fetchCommonTokensQueryFn } from './use-common-tokens'

export const getStellarPortfolioWallet = async (address: `G${string}`) => {
  if (!address) return []
  const tokens = await fetchCommonTokensQueryFn()
  const tokensWithBalances: TokenWithBalance[] = []
  for (const token of Object.values(tokens)) {
    if (!token.contract) continue
    try {
      const balance = await getTokenBalance(address, token.contract)
      if (balance && balance > 0n) {
        tokensWithBalances.push({
          ...token,
          balance,
        })
      }
    } catch (error) {
      console.error(
        `Failed to get ${token.contract} token balance for ${address}`,
        error,
      )
    }
  }
  return transformToPortfolioWallet(tokensWithBalances)
}

const chain = getChainById(StellarChainId.STELLAR)
const transformToPortfolioWallet = (tokens: TokenWithBalance[]) => {
  return tokens.map((token) => ({
    token: token,
    id: token.contract,
    chain: chain.key,
    chainId: chain.chainId,
    name: token.code,
    symbol: token.name,
    decimals: token.decimals,
    logoUrl: token.icon ?? '',
    protocolId: 'stellar',
    price: 0,
    price24hChange: 0,
    isVerified: true,
    isCore: false,
    isWallet: false,
    timeAt: Date.now(),
    amount: Number.parseFloat(formatUnits(token.balance, token.decimals)),
    rawAmount: Number(token.balance),
    amountUSD: 0,
  }))
}
