import React, { useCallback, useMemo } from 'react'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useSearchParams } from 'next/navigation'
import { defaultQuoteCurrency, Native, Token } from '@sushiswap/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Button } from '@sushiswap/ui/future/components/button'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useCustomTokens } from '@sushiswap/hooks'
import { queryParamsSchema } from '../../lib/swap/queryParamsSchema'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { useTokenSecurity } from '@sushiswap/react-query'
import { DangerousIcon, GoPlusLabsIcon } from '@sushiswap/ui/icons'
import { Link } from '@sushiswap/ui'

export const TokenNotFoundDialog = () => {
  const searchParams = useSearchParams()
  const _fromChainId = searchParams?.get('fromChainId')
  const _fromCurrency = searchParams?.get('fromCurrency')
  const _toChainId = searchParams?.get('toChainId')
  const _toCurrency = searchParams?.get('toCurrency')

  const { fromChainId, fromCurrency, toChainId, toCurrency } = queryParamsSchema.parse({
    fromChainId: _fromChainId,
    fromCurrency: _fromCurrency,
    toChainId: _toChainId,
    toCurrency: _toCurrency,
  })

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
    setTokens(Native.onChain(network0), defaultQuoteCurrency[network1 as keyof typeof defaultQuoteCurrency])
  }, [network0, network1, setTokens])

  const { data: tokenSecurity } = useTokenSecurity({
    currencies: useMemo(
      () => [
        ...(token0NotInList && tokenFrom?.token ? [tokenFrom.token] : []),
        ...(token1NotInList && tokenTo?.token ? [tokenTo.token] : []),
      ],
      [token0NotInList, token1NotInList, tokenFrom?.token, tokenTo?.token]
    ),
    enabled: Boolean(!tokenFromLoading && !tokenToLoading && (token0NotInList || token1NotInList)),
  })

  return (
    <Dialog
      open={Boolean(!tokenFromLoading && !tokenToLoading && (token0NotInList || token1NotInList))}
      onClose={() => {}}
    >
      <Dialog.Content className="flex flex-col gap-4">
        {!tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0 ? (
          <>
            <Dialog.Header title={`Unknown Token${tokenFrom?.token && tokenTo?.token ? 's' : ''}`} />
            <p className="text-gray-700 dark:text-slate-400">
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects. If you purchase this token, you may not be able to sell it back.
            </p>
            {fromCurrency && token0NotInList && !tokenFrom?.token && (
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
            {toCurrency && token1NotInList && !tokenTo?.token && (
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
            {token0NotInList && tokenFrom?.token && (
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
            <div className="flex flex-col gap-1">
              {tokenSecurity?.isSupported && (
                <div className="flex items-center gap-0.5 justify-center">
                  <span className="text-xs text-gray-700 dark:text-slate-400">
                    Honeypot detection powered by GoPlus
                  </span>
                  <GoPlusLabsIcon width={22} height={20} />
                </div>
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
            </div>
          </>
        ) : (
          <>
            <Dialog.Header
              title={
                <div className="flex gap-2 items-center">
                  <DangerousIcon width={18} height={18} className="text-red" />
                  <span>Honeypot Token{tokenSecurity.honeypots.length > 1 ? 's' : ''}</span>
                </div>
              }
            />
            {/* TODO: link to academy article */}
            <Link.External
              href="https://coinbrain.com/dictionary/honeypot-scam"
              className="text-blue underline text-sm"
            >
              What is a honeypot token?
            </Link.External>
            <p className="text-gray-700 dark:text-slate-400">
              {tokenSecurity.honeypots.length > 1
                ? 'These tokens have been identified as potential honeypot scams and are not supported. Do not interact with these tokens to safeguard your assets.'
                : 'This token has been identified as a potential honeypot scam and is not supported. Do not interact with this token to safeguard your assets.'}
            </p>
            {tokenFrom?.token && tokenSecurity.honeypots.includes(tokenFrom.token.address) && (
              <List>
                <List.Label>
                  Token {tokenTo?.token && tokenSecurity.honeypots.includes(tokenTo.token.address) ? '1' : ''}
                </List.Label>
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
            {tokenTo?.token && tokenSecurity.honeypots.includes(tokenTo.token.address) && (
              <List>
                <List.Label>
                  Token {tokenFrom?.token && tokenSecurity.honeypots.includes(tokenFrom.token.address) ? '2' : ''}
                </List.Label>
                <List.Control>
                  <List.KeyValue title="Name">
                    {tokenTo.token.name ? `${tokenTo.token.name} (SCAM)` : null}
                  </List.KeyValue>
                  <List.KeyValue title="Symbol">
                    {tokenTo.token.symbol ? `${tokenTo.token.symbol} (SCAM)` : null}
                  </List.KeyValue>
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
            <div className="flex flex-col gap-1">
              {tokenSecurity.isSupported && (
                <div className="flex items-center gap-0.5 justify-center">
                  <span className="text-xs text-gray-700 dark:text-slate-400">
                    Honeypot detection powered by GoPlus
                  </span>
                  <GoPlusLabsIcon width={22} height={20} />
                </div>
              )}
              <Button size="xl" onClick={reset}>
                Close
              </Button>
            </div>
          </>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
