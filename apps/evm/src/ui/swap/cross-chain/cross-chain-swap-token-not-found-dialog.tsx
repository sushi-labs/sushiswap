'use client'

import { useCustomTokens } from '@sushiswap/hooks'
import { useTokenSecurity } from '@sushiswap/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { GoPlusLabsIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list'
import { useTokenWithCache } from '@sushiswap/wagmi'
import React, { useCallback, useMemo } from 'react'
import { Chain } from 'sushi/chain'
import { Native, Token, defaultQuoteCurrency } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'

import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTokenNotFoundDialog = () => {
  const {
    state: { chainId0, chainId1, token0, token1 },
    mutate: { setToken0, setToken1, setTokens },
  } = useDerivedStateCrossChainSwap()

  const { mutate: customTokensMutate, hasToken } = useCustomTokens()
  const { data: tokenFrom, isInitialLoading: tokenFromLoading } =
    useTokenWithCache({
      chainId: chainId0,
      address: token0?.wrapped.address,
      withStatus: true,
    })

  const { data: tokenTo, isInitialLoading: tokenToLoading } = useTokenWithCache(
    {
      chainId: chainId1,
      address: token1?.wrapped.address,
      withStatus: true,
    },
  )

  const token0NotInList = Boolean(
    tokenFrom?.status !== 'APPROVED' &&
      tokenFrom?.token &&
      !hasToken(tokenFrom?.token),
  )
  const token1NotInList = Boolean(
    tokenTo?.status !== 'APPROVED' &&
      tokenTo?.token &&
      !hasToken(tokenTo?.token),
  )

  const onImport = useCallback(
    ([token0, token1]: (Token | undefined)[]) => {
      const _tokens = []
      if (tokenFrom?.status !== 'APPROVED' && token0) _tokens.push(token0)
      if (tokenTo?.status !== 'APPROVED' && token1) _tokens.push(token1)

      customTokensMutate('add', _tokens)

      if (token0) setToken0(token0)
      if (token1) setToken1(token1)
    },
    [
      customTokensMutate,
      setToken0,
      setToken1,
      tokenFrom?.status,
      tokenTo?.status,
    ],
  )

  const reset = useCallback(() => {
    setTokens(
      Native.onChain(chainId0),
      defaultQuoteCurrency[chainId1 as keyof typeof defaultQuoteCurrency],
    )
  }, [chainId0, chainId1, setTokens])

  const { data: tokenSecurity } = useTokenSecurity({
    currencies: useMemo(
      () => [
        ...(token0NotInList && tokenFrom?.token ? [tokenFrom.token] : []),
        ...(token1NotInList && tokenTo?.token ? [tokenTo.token] : []),
      ],
      [token0NotInList, token1NotInList, tokenFrom, tokenTo],
    ),
    enabled: Boolean(
      !tokenFromLoading &&
        !tokenToLoading &&
        (token0NotInList || token1NotInList),
    ),
  })

  const isNotHoneyPot = Boolean(
    !tokenFromLoading &&
      !tokenToLoading &&
      (token0NotInList || token1NotInList),
  )

  if (!tokenSecurity) return null

  return (
    <Dialog
      open={Boolean(
        !tokenFromLoading &&
          !tokenToLoading &&
          (token0NotInList || token1NotInList),
      )}
    >
      <DialogContent>
        <DialogHeader>
          {isNotHoneyPot ? (
            <>
              <DialogTitle>
                Unknown token{tokenFrom?.token && tokenTo?.token ? 's' : ''}
              </DialogTitle>
              <DialogDescription>
                Anyone can create a token, including creating fake versions of
                existing tokens that claim to represent projects. If you
                purchase this token, you may not be able to sell it back.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-red">
                Honeypot token{tokenSecurity.honeypots.length > 1 ? 's' : ''}{' '}
                detected
              </DialogTitle>
              <DialogDescription>
                {tokenSecurity.honeypots.length > 1
                  ? 'These tokens have been identified as potential honeypot scams and are not supported. Do not interact with these tokens to safeguard your assets.'
                  : 'This token has been identified as a potential honeypot scam and is not supported. Do not interact with this token to safeguard your assets.'}{' '}
                Click{' '}
                <a
                  href="https://coinbrain.com/dictionary/honeypot-scam"
                  rel="noreferrer noopener"
                  className="text-blue"
                >
                  here
                </a>{' '}
                to learn more about honepot scams.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {isNotHoneyPot ? (
            <>
              {token0 && token0NotInList && !tokenFrom?.token && (
                <List>
                  <List.Label>
                    Token {tokenFrom?.token && tokenTo?.token ? '1' : ''}
                  </List.Label>
                  <List.Control>
                    <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                      Could not retrieve token info for{' '}
                      <a
                        target="_blank"
                        href={Chain.from(chainId0)?.getTokenUrl(
                          token0.wrapped.address,
                        )}
                        className="text-blue font-medium"
                        rel="noreferrer"
                      >
                        {shortenAddress(token0.wrapped.address)}
                      </a>{' '}
                      are you sure this token is on {Chain.from(chainId0)?.name}
                      ?
                    </p>
                  </List.Control>
                </List>
              )}
              {token1 && token1NotInList && !tokenTo?.token && (
                <List>
                  <List.Label>
                    Token {tokenFrom?.token && tokenTo?.token ? '2' : ''}
                  </List.Label>
                  <List.Control>
                    <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                      Could not retrieve token info for{' '}
                      <a
                        target="_blank"
                        href={Chain.from(chainId1)?.getTokenUrl(
                          token1.wrapped.address,
                        )}
                        className="text-blue font-medium"
                        rel="noreferrer"
                      >
                        {shortenAddress(token1.wrapped.address)}
                      </a>{' '}
                      are you sure this token is on {Chain.from(chainId1)?.name}
                      ?
                    </p>
                  </List.Control>
                </List>
              )}
              {token0NotInList && tokenFrom?.token && (
                <List>
                  <List.Label>
                    Token {tokenFrom.token && tokenTo?.token ? '1' : ''}
                  </List.Label>
                  <List.Control>
                    <List.KeyValue title="Name">
                      {tokenFrom.token.name}
                    </List.KeyValue>
                    <List.KeyValue title="Symbol">
                      {tokenFrom.token.symbol}
                    </List.KeyValue>
                    <List.KeyValue title="Address">
                      <a
                        target="_blank"
                        href={Chain.from(chainId0)?.getTokenUrl(
                          tokenFrom.token.address,
                        )}
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
                  <List.Label>
                    Token {tokenFrom?.token && tokenTo?.token ? '2' : ''}
                  </List.Label>
                  <List.Control>
                    <List.KeyValue title="Name">
                      {tokenTo.token.name}
                    </List.KeyValue>
                    <List.KeyValue title="Symbol">
                      {tokenTo.token.symbol}
                    </List.KeyValue>
                    <List.KeyValue title="Address">
                      <a
                        target="_blank"
                        href={Chain.from(chainId1)?.getTokenUrl(
                          tokenTo.token.address,
                        )}
                        className="text-blue"
                        rel="noreferrer"
                      >
                        {shortenAddress(tokenTo.token.address)}
                      </a>
                    </List.KeyValue>
                  </List.Control>
                </List>
              )}

              {tokenSecurity?.isSupported && (
                <div className="flex items-center gap-0.5 justify-center mt-4">
                  <span className="text-xs text-gray-700 dark:text-slate-400">
                    Honeypot detection powered by GoPlus
                  </span>
                  <GoPlusLabsIcon width={22} height={20} />
                </div>
              )}
            </>
          ) : (
            <>
              <Button asChild variant="link" />
              {tokenFrom?.token &&
                tokenSecurity.honeypots.includes(tokenFrom.token.address) && (
                  <List>
                    <List.Label>
                      Token{' '}
                      {tokenTo?.token &&
                      tokenSecurity.honeypots.includes(tokenTo.token.address)
                        ? '1'
                        : ''}
                    </List.Label>
                    <List.Control>
                      <List.KeyValue title="Name">
                        {tokenFrom.token.name}
                      </List.KeyValue>
                      <List.KeyValue title="Symbol">
                        {tokenFrom.token.symbol}
                      </List.KeyValue>
                      <List.KeyValue title="Address">
                        <a
                          target="_blank"
                          href={Chain.from(chainId0)?.getTokenUrl(
                            tokenFrom.token.address,
                          )}
                          className="text-blue"
                          rel="noreferrer"
                        >
                          {shortenAddress(tokenFrom.token.address)}
                        </a>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              {tokenTo?.token &&
                tokenSecurity.honeypots.includes(tokenTo.token.address) && (
                  <List>
                    <List.Label>
                      Token{' '}
                      {tokenFrom?.token &&
                      tokenSecurity.honeypots.includes(tokenFrom.token.address)
                        ? '2'
                        : ''}
                    </List.Label>
                    <List.Control>
                      <List.KeyValue title="Name">
                        {tokenTo.token.name
                          ? `${tokenTo.token.name} (SCAM)`
                          : null}
                      </List.KeyValue>
                      <List.KeyValue title="Symbol">
                        {tokenTo.token.symbol
                          ? `${tokenTo.token.symbol} (SCAM)`
                          : null}
                      </List.KeyValue>
                      <List.KeyValue title="Address">
                        <a
                          target="_blank"
                          href={Chain.from(chainId1)?.getTokenUrl(
                            tokenTo.token.address,
                          )}
                          className="text-blue"
                          rel="noreferrer"
                        >
                          {shortenAddress(tokenTo.token.address)}
                        </a>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              {tokenSecurity.isSupported && (
                <div className="flex items-center gap-0.5 justify-center">
                  <span className="text-xs text-gray-700 dark:text-slate-400">
                    Honeypot detection powered by GoPlus
                  </span>
                  <GoPlusLabsIcon width={22} height={20} />
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          {isNotHoneyPot ? (
            (token0NotInList && tokenFrom?.token) ||
            (token1NotInList && tokenTo?.token) ? (
              <Button
                fullWidth
                size="xl"
                onClick={() => onImport([tokenFrom?.token, tokenTo?.token])}
              >
                I understand
              </Button>
            ) : (
              <Button fullWidth size="xl" onClick={reset}>
                Close
              </Button>
            )
          ) : (
            <Button fullWidth size="xl" onClick={reset}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
