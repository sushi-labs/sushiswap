import { Token } from '@sushiswap/currency'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { TokenAsObject, WithStorageState } from '../types'

type UseCustomTokensReturn = [
  Record<string, Record<string, Token>>,
  {
    addCustomToken(payload: TokenAsObject): void
    removeCustomToken(payload: Pick<TokenAsObject, 'address' | 'chainId'>): void
  }
]

type UseAllCustomTokens = (context: StorageContext) => UseCustomTokensReturn

export const useAllCustomTokens: UseAllCustomTokens = (context) => {
  const { reducerPath, actions } = context
  const { customTokens } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const addCustomToken = useCallback(
    ({ symbol, address, chainId, name, decimals }: TokenAsObject) => {
      dispatch(actions.addCustomToken({ symbol, address, chainId, name, decimals }))
    },
    [actions, dispatch]
  )

  const removeCustomToken = useCallback(
    ({ address, chainId }: Pick<TokenAsObject, 'address' | 'chainId'>) => {
      dispatch(actions.removeCustomToken({ address, chainId }))
    },
    [actions, dispatch]
  )

  const tokens = useMemo(() => {
    const chainIds = Object.keys(customTokens)
    return chainIds.reduce<Record<string, Record<string, Token>>>((acc, chainId) => {
      acc[chainId] = Object.entries(customTokens[+chainId]).reduce<Record<string, Token>>(
        (acc, [k, { chainId, decimals, name, symbol, address }]) => {
          acc[k] = new Token({ chainId, decimals, name, symbol, address })
          return acc
        },
        {}
      )
      return acc
    }, {})
  }, [customTokens])

  return [tokens, { addCustomToken, removeCustomToken }]
}
