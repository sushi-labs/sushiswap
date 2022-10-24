import { Token } from '@sushiswap/currency'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { TokenAsObject, WithStorageState } from '../types'

type UseCustomTokensReturn = [
  Record<string, Token>,
  {
    addCustomToken(payload: TokenAsObject): void
    addCustomTokens(payload: TokenAsObject[]): void
    removeCustomToken(payload: Pick<TokenAsObject, 'address' | 'chainId'>): void
  }
]

type UseCustomTokens = (context: StorageContext, chainId?: number) => UseCustomTokensReturn

export const useCustomTokens: UseCustomTokens = (context, chainId?: number) => {
  const { reducerPath, actions } = context
  const { customTokens } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const addCustomToken = useCallback(
    ({ symbol, address, chainId, name, decimals }: TokenAsObject) => {
      dispatch(actions.addCustomToken({ symbol, address, chainId, name, decimals }))
    },
    [actions, dispatch]
  )

  const addCustomTokens = useCallback(
    (tokens: TokenAsObject[]) => {
      dispatch(actions.addCustomTokens(tokens))
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
    if (!chainId || !customTokens[chainId]) return {}
    return Object.entries(customTokens[chainId]).reduce<Record<string, Token>>(
      (acc, [k, { chainId, decimals, name, symbol, address }]) => {
        acc[k] = new Token({ chainId, decimals, name, symbol, address })
        return acc
      },
      {}
    )
  }, [chainId, customTokens])

  return [tokens, { addCustomToken, removeCustomToken, addCustomTokens }]
}
