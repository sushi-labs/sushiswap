import React, { useCallback } from 'react'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useRouter } from 'next/router'
import { defaultQuoteCurrency, Native, Token } from '@sushiswap/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Button } from '@sushiswap/ui/future/components/button'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useCustomTokens } from '@sushiswap/hooks'
import { queryParamsSchema } from '../lib/queryParamsSchema'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'

export const TokenNotFoundDialog = () => {
  const { query } = useRouter()
  const { fromChainId, fromCurrency, toChainId, toCurrency } = queryParamsSchema.parse(query)
  const { network0, network1 } = useSwapState()
  const { setToken0, setToken1, setTokens } = useSwapActions()
  const { mutate: customTokensMutate, hasToken } = useCustomTokens()
  const { data: tokenFrom, isInitialLoading: tokenFromLoading } = useTokenWithCache({
    chainId: fromChainId,
    address: fromCurrency,
    withStatus: true,
  })

  const { data: tokenTo, isInitialLoading: tokenToLoading } = useTokenWithCache({
    chainId: toChainId,
    address: toCurrency,
    withStatus: true,
  })

  const token0NotInList = Boolean(tokenFrom?.status !== 'APPROVED' && tokenFrom?.token && !hasToken(tokenFrom?.token))
  const token1NotInList = Boolean(tokenTo?.status !== 'APPROVED' && tokenTo?.token && !hasToken(tokenTo?.token))

  const onImport = useCallback(
    ([token0, token1]: (Token | undefined)[]) => {
      const _tokens = []
      if (tokenFrom?.status !== 'APPROVED' && token0) _tokens.push(token0)
      if (tokenTo?.status !== 'APPROVED' && token1) _tokens.push(token1)

      customTokensMutate('add', _tokens)

      if (token0) setToken0(token0)
      if (token1) setToken1(token1)
    },
    [customTokensMutate, setToken0, setToken1, tokenFrom?.status, tokenTo?.status]
  )

  const reset = useCallback(() => {
    // @ts-ignore
    setTokens(Native.onChain(network0), defaultQuoteCurrency[network1])
  }, [network0, network1, setTokens])

  return (
    <Dialog
      open={Boolean(!tokenFromLoading && !tokenToLoading && (token0NotInList || token1NotInList))}
      onClose={() => {}}
    >
      <Dialog.Content className="flex flex-col gap-4">
        <>
          <Dialog.Header title={`Unknown Token${tokenFrom?.token && tokenTo?.token ? 's' : ''}`} />
          <p className="text-gray-700 dark:text-slate-400">
            Anyone can create a token, including creating fake versions of existing tokens that claim to represent
            projects. If you purchase this token, you may not be able to sell it back.
          </p>
          {token0NotInList && !tokenTo?.token && (
            <List>
              <List.Label>Token {tokenFrom?.token && tokenTo?.token ? '1' : ''}</List.Label>
              <List.Control>
                <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                  Could not retrieve token info for{' '}
                  <a
                    target="_blank"
                    href={Chain.from(network0).getTokenUrl(fromCurrency)}
                    className="text-blue font-medium"
                    rel="noreferrer"
                  >
                    {shortenAddress(fromCurrency)}
                  </a>{' '}
                  are you sure this token is on {Chain.from(network0).name}?
                </p>
              </List.Control>
            </List>
          )}
          {token1NotInList && !tokenTo?.token && (
            <List>
              <List.Label>Token {tokenFrom?.token && tokenTo?.token ? '2' : ''}</List.Label>
              <List.Control>
                <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                  Could not retrieve token info for{' '}
                  <a
                    target="_blank"
                    href={Chain.from(network1).getTokenUrl(toCurrency)}
                    className="text-blue font-medium"
                    rel="noreferrer"
                  >
                    {shortenAddress(toCurrency)}
                  </a>{' '}
                  are you sure this token is on {Chain.from(network1).name}?
                </p>
              </List.Control>
            </List>
          )}
          {token0NotInList && tokenFrom && (
            <List>
              <List.Label>Token {tokenFrom.token && tokenTo?.token ? '1' : ''}</List.Label>
              <List.Control>
                <List.KeyValue title="Name">{tokenFrom.token.name}</List.KeyValue>
                <List.KeyValue title="Symbol">{tokenFrom.token.symbol}</List.KeyValue>
                <List.KeyValue title="Address">
                  <a
                    target="_blank"
                    href={Chain.from(network1).getTokenUrl(tokenFrom.token.address)}
                    className="text-blue"
                    rel="noreferrer"
                  >
                    {shortenAddress(tokenFrom.token.address)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
          {token1NotInList && tokenTo?.token && (
            <List>
              <List.Label>Token {tokenFrom?.token && tokenTo?.token ? '2' : ''}</List.Label>
              <List.Control>
                <List.KeyValue title="Name">{tokenTo.token.name}</List.KeyValue>
                <List.KeyValue title="Symbol">{tokenTo.token.symbol}</List.KeyValue>
                <List.KeyValue title="Address">
                  <a
                    target="_blank"
                    href={Chain.from(network1).getTokenUrl(tokenTo.token.address)}
                    className="text-blue"
                    rel="noreferrer"
                  >
                    {shortenAddress(tokenTo.token.address)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
          {(token0NotInList && tokenFrom?.token) || (token1NotInList && tokenTo?.token) ? (
            <Button size="xl" onClick={() => onImport([tokenFrom?.token, tokenTo?.token])}>
              I understand
            </Button>
          ) : (
            <Button size="xl" variant="outlined" onClick={reset}>
              Close
            </Button>
          )}
        </>
      </Dialog.Content>
    </Dialog>
  )
}
