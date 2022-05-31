import { getAddress } from '@ethersproject/address'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useAllTokens } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useRef, useState } from 'react'

import LPToken from './LPToken'

export interface LPTokensState {
  updateLPTokens: () => Promise<void>
  lpTokens: LPToken[]
  selectedLPToken?: LPToken
  setSelectedLPToken: (token?: LPToken) => void
  selectedLPTokenAllowed: boolean
  setSelectedLPTokenAllowed: (allowed: boolean) => void
  loading: boolean
  updatingLPTokens: boolean
}

const useLPTokensState = () => {
  const { account, chainId } = useActiveWeb3React()
  const [lpTokens, setLPTokens] = useState<LPToken[]>([])
  const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
  const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const tokens = useAllTokens()
  const updatingLPTokens = useRef(false)
  const updateLPTokens = useCallback(async () => {
    try {
      updatingLPTokens.current = true
      if (
        chainId &&
        [ChainId.ETHEREUM, ChainId.BSC, ChainId.MATIC, ChainId.FANTOM, ChainId.AVALANCHE, ChainId.MOONBEAM].includes(
          chainId
        )
      ) {
        const requests: any = {
          [ChainId.ETHEREUM]: {
            uniswap_v2: `https://api.covalenthq.com/v1/${ChainId.ETHEREUM}/xy=k/uniswap_v2/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },

          // https://api.covalenthq.com/v1/1/xy=k/uniswap_v2/address/0x8f54C8c2df62c94772ac14CcFc85603742976312/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f

          [ChainId.BSC]: {
            // `https://api.covalenthq.com/v1/${ChainId.BSC}/xy=k/pancakeswap/address/${String(
            //   account
            // ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
            pancakeswap_v2: `https://api.covalenthq.com/v1/${ChainId.BSC}/xy=k/pancakeswap_v2/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },

          [ChainId.MATIC]: {
            quickswap: `https://api.covalenthq.com/v1/${ChainId.MATIC}/xy=k/quickswap/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },
          [ChainId.FANTOM]: {
            spiritswap: `https://api.covalenthq.com/v1/${ChainId.FANTOM}/xy=k/spiritswap/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
            spookyswap: `https://api.covalenthq.com/v1/${ChainId.FANTOM}/xy=k/spookyswap/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },
          [ChainId.AVALANCHE]: {
            traderjoe: `https://api.covalenthq.com/v1/${ChainId.AVALANCHE}/xy=k/traderjoe/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
            pangolin: `https://api.covalenthq.com/v1/${ChainId.AVALANCHE}/xy=k/pangolin/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },
          [ChainId.MOONBEAM]: {
            stellaswap: `https://api.covalenthq.com/v1/${ChainId.MOONBEAM}/xy=k/stellaswap/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
            beamswap: `https://api.covalenthq.com/v1/${ChainId.MOONBEAM}/xy=k/beamswap/address/${String(
              account
            ).toLowerCase()}/balances/?quote-currency=USD&format=JSON&key=ckey_07aac227aaed444687021bf548f`,
          },
        }

        const responses = await Promise.all(
          Object.values<string>(requests[chainId]).map((url) => fetch(url).then((response) => response.json()))
        )

        // const responses = await Promise.all(
        //   Object.entries<string>(requests[chainId]).map(([key, url]) => fetch(url).then((response) => response.json()))
        // )

        const keys = Object.keys(requests[chainId])

        const data = responses.map((response, i) => [
          keys[i],
          response?.data?.items?.filter((pool_token: any) => pool_token.balance !== '0'),
        ])

        console.log({ data })

        const lpTokens = data?.reduce((previousValue, [dex, items]) => {
          return [
            ...previousValue,
            ...items.map((pair: any) => {
              console.log(pair)
              const liquidityToken = new Token(
                chainId as ChainId,
                getAddress(pair.pool_token.contract_address),
                pair.pool_token.contract_decimals,
                pair.pool_token.contract_ticker_symbol
              )

              const token0Address = getAddress(pair.token_0.contract_address)
              const token1Address = getAddress(pair.token_1.contract_address)

              const token0 =
                token0Address in tokens
                  ? tokens[token0Address]
                  : new Token(
                      chainId as ChainId,
                      token0Address,
                      pair.token_0.contract_decimals,
                      pair.token_0.contract_ticker_symbol
                    )

              const token1 =
                token1Address in tokens
                  ? tokens[token1Address]
                  : new Token(
                      chainId as ChainId,
                      token1Address,
                      pair.token_1.contract_decimals,
                      pair.token_1.contract_ticker_symbol
                    )

              return {
                dex,
                address: liquidityToken.address,
                decimals: liquidityToken.decimals,
                name: `${token0.symbol}-${token1.symbol} LP Token`,
                symbol: liquidityToken.symbol,
                balance: CurrencyAmount.fromRawAmount(liquidityToken, pair.pool_token.balance),
                totalSupply: pair.pool_token.total_supply,
                tokenA: token0,
                tokenB: token1,
                version: pair.version,
              } as LPToken
            }),
          ]
        }, [])

        if (lpTokens) {
          setLPTokens(lpTokens)
        }
      }
    } finally {
      setLoading(false)
      updatingLPTokens.current = false
    }
  }, [chainId, account, tokens])

  useEffect(() => {
    if (chainId && account && !updatingLPTokens.current) {
      updateLPTokens()
    }
  }, [account, chainId, updateLPTokens])

  return {
    updateLPTokens,
    lpTokens,
    selectedLPToken,
    setSelectedLPToken,
    selectedLPTokenAllowed,
    setSelectedLPTokenAllowed,
    loading,
    updatingLPTokens: updatingLPTokens.current,
  }
}

export default useLPTokensState
