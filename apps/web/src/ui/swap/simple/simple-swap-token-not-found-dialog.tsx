'use client'

import { useCustomTokens } from '@sushiswap/hooks'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  List,
  Message,
} from '@sushiswap/ui'
import React, { useCallback, useMemo } from 'react'
import { useTokenSecurity } from 'src/lib/hooks/react-query'
import { EvmChain } from 'sushi/chain'
import {
  defaultCurrency,
  defaultQuoteCurrency,
  isTokenSecurityChainId,
} from 'sushi/config'
import type { Token } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'

import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-context'

export const SimpleSwapTokenNotFoundDialog = () => {
  const {
    state: { chainId, token0, token1 },
    mutate: { setToken0, setToken1, setTokens },
  } = useDerivedStateSimpleSwap()

  const { mutate: customTokensMutate, hasToken } = useCustomTokens()

  const token0NotInList = Boolean(
    token0?.approved === false && token0.isToken && !hasToken(token0),
  )
  const token1NotInList = Boolean(
    token1?.approved === false && token1.isToken && !hasToken(token1),
  )

  const onImport = useCallback(
    ([token0, token1]: (Token | undefined)[]) => {
      const _tokens: Token[] = []
      if (token0?.approved === false && token0) _tokens.push(token0)
      if (token1?.approved === false && token1) _tokens.push(token1)

      customTokensMutate('add', _tokens)

      if (token0) setToken0(token0)
      if (token1) setToken1(token1)
    },
    [customTokensMutate, setToken0, setToken1],
  )

  const reset = useCallback(() => {
    setTokens(
      defaultCurrency[chainId as keyof typeof defaultCurrency],
      defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
    )
  }, [chainId, setTokens])

  const { data: tokenSecurityResponse, isLoading: tokenSecurityLoading } =
    useTokenSecurity({
      currencies: useMemo(
        () => [
          ...(token0NotInList && token0?.isToken ? [token0] : []),
          ...(token1NotInList && token1?.isToken ? [token1] : []),
        ],
        [token0NotInList, token1NotInList, token0, token1],
      ),
      enabled: Boolean(token0NotInList || token1NotInList),
    })

  const honeypot = Boolean(
    (token0?.isToken &&
      tokenSecurityResponse?.[token0?.address]?.is_honeypot) ||
      (token1?.isToken && tokenSecurityResponse?.[token1.address]?.is_honeypot),
  )

  if (isTokenSecurityChainId(chainId) && tokenSecurityLoading) return null

  return (
    <Dialog
      open={Boolean(token0NotInList || token1NotInList)}
      onOpenChange={(open) => !open && reset()}
    >
      <DialogContent className="!max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Unknown token
            {(token0NotInList || !token0?.isToken) &&
            (token1NotInList || !token1?.isToken)
              ? 's'
              : ''}
          </DialogTitle>
          <DialogDescription className="!mr-0 !text-xs">
            Anyone can create a token, including creating fake versions of
            existing tokens that claim to represent projects. If you purchase
            this token, you may not be able to sell it back.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {token0 && token0NotInList && !token0?.isToken && (
            <List>
              {token1NotInList || !token1?.isToken ? (
                <List.Label>Token 1</List.Label>
              ) : null}
              <List.Control>
                <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                  Could not retrieve token info for{' '}
                  <a
                    target="_blank"
                    href={EvmChain.from(chainId)?.getTokenUrl(
                      token0.wrapped.address,
                    )}
                    className="text-blue font-medium"
                    rel="noreferrer"
                  >
                    {shortenAddress(token0.wrapped.address)}
                  </a>{' '}
                  are you sure this token is on {EvmChain.from(chainId)?.name}?
                </p>
              </List.Control>
            </List>
          )}
          {token0NotInList && token0?.isToken && (
            <List>
              {token1NotInList || !token1?.isToken ? (
                <List.Label>Token 1</List.Label>
              ) : null}
              <List.Control>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Name
                    </span>
                  }
                >
                  {token0.name}
                </List.KeyValue>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Symbol
                    </span>
                  }
                >
                  {token0.symbol}
                </List.KeyValue>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Address
                    </span>
                  }
                >
                  <a
                    target="_blank"
                    href={EvmChain.from(chainId)?.getTokenUrl(token0.address)}
                    className="text-blue"
                    rel="noreferrer"
                  >
                    {shortenAddress(token0.address)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
          {token1 && token1NotInList && !token1.isToken && (
            <List>
              {token0NotInList || !token0?.isToken ? (
                <List.Label>Token 2</List.Label>
              ) : null}
              <List.Control>
                <p className="p-3 text-sm text-gray-900 dark:text-slate-50">
                  Could not retrieve token info for{' '}
                  <a
                    target="_blank"
                    href={EvmChain.from(chainId)?.getTokenUrl(
                      token1.wrapped.address,
                    )}
                    className="text-blue font-medium"
                    rel="noreferrer"
                  >
                    {shortenAddress(token1.wrapped.address)}
                  </a>{' '}
                  are you sure this token is on {EvmChain.from(chainId)?.name}?
                </p>
              </List.Control>
            </List>
          )}
          {token1NotInList && token1?.isToken && (
            <List>
              {token0NotInList || !token0?.isToken ? (
                <List.Label>Token 2</List.Label>
              ) : null}
              <List.Control>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Name
                    </span>
                  }
                >
                  {token1.name}
                </List.KeyValue>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Symbol
                    </span>
                  }
                >
                  {token1.symbol}
                </List.KeyValue>
                <List.KeyValue
                  title={
                    <span className="text-gray-900 dark:text-slate-50">
                      Address
                    </span>
                  }
                >
                  <a
                    target="_blank"
                    href={EvmChain.from(chainId)?.getTokenUrl(token1.address)}
                    className="text-blue"
                    rel="noreferrer"
                  >
                    {shortenAddress(token1.address)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </div>
        <DialogFooter>
          {!honeypot &&
          ((token0NotInList && token0?.isToken) ||
            (token1NotInList && token1?.isToken)) ? (
            <Button
              fullWidth
              size="xl"
              onClick={() =>
                onImport([
                  token0?.isToken ? token0 : undefined,
                  token1?.isToken ? token1 : undefined,
                ])
              }
            >
              I understand
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button fullWidth size="xl" onClick={reset}>
                Close
              </Button>
              <Message variant="destructive" size="sm">
                Sushi does not support honeypot tokens. This token contract
                cannot be imported!
              </Message>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
