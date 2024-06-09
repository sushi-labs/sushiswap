import { readContracts } from '@wagmi/core'
import { Chain, ChainId } from 'sushi/chain'

import { getSushiV2Tokens } from '@sushiswap/graph-client-new/sushi-v2'
import { SushiSwapV2ChainId } from 'sushi/config'
import { Address, erc20Abi } from 'viem'
import { getTokenPrices } from '../price.js'
import { config } from '../wagmi.js'
import { divBigIntToNumber } from './utils.js'

interface Token {
  id: string
  symbol: string
  name: string
  decimals: number
  liquidity: number
  derivedUSD: number
}

const getExchangeTokens = async (
  ids: string[],
  chainId: SushiSwapV2ChainId,
): Promise<Token[]> => {
  const [tokens, tokenPrices] = await Promise.all([
    getSushiV2Tokens(
      {
        chainId,
        where: { id_in: ids.map((id) => id.toLowerCase() as Address) },
      },
      { retries: 3 },
    ),
    getTokenPrices({ chainId }),
  ])

  return tokens.map((token) => ({
    id: token.address.toLowerCase(),
    symbol: token.symbol,
    name: token.name,
    decimals: Number(token.decimals),
    liquidity: Number(token.totalLiquidity),
    derivedUSD: tokenPrices[token.id.toLowerCase()] || 0,
  }))
}

export const getTokens = async (ids: string[], chainId: SushiSwapV2ChainId) => {
  return await getExchangeTokens(ids, chainId)
}

export async function getTokenBalancesOf(
  _tokens: string[],
  address: string,
  chainId: ChainId,
) {
  // not fully erc20, farm not active
  const tokens = _tokens.filter(
    (token) => token !== '0x0c810E08fF76E2D0beB51B10b4614b8f2b4438F9',
  )

  const balanceOfCalls = tokens.map(
    (token) =>
      ({
        address: token as Address,
        args: [address as Address],
        chainId: chainId,
        abi: erc20Abi,
        functionName: 'balanceOf',
      }) as const,
  )

  const decimalCalls = tokens.map(
    (token) =>
      ({
        address: token as Address,
        chainId: chainId,
        abi: erc20Abi,
        functionName: 'decimals',
      }) as const,
  )

  const [balancesOf, decimals] = await Promise.all([
    readContracts(config, {
      allowFailure: true,
      contracts: balanceOfCalls,
    }),
    readContracts(config, {
      allowFailure: true,
      contracts: decimalCalls,
    }),
  ])

  return tokens
    .map((token, i) => {
      const balance = balancesOf[i].result
      const decimal = decimals[i].result

      if (
        balance === null ||
        balance === undefined ||
        decimal === null ||
        decimal === undefined
      ) {
        console.log(
          `Balance / decimal fetch failed for ${token} on ${
            Chain.from(chainId)?.shortName
          }`,
        )
        return null
      }

      return {
        token,
        // so that we don't need to seed new pairs
        balance: balance === 0n ? 1 : divBigIntToNumber(balance, decimal),
      }
    })
    .filter((token): token is NonNullable<typeof token> => Boolean(token))
}
