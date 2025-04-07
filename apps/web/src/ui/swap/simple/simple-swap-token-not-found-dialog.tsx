'use client'

import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { useCustomTokens } from '@sushiswap/hooks'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkExternal,
  List,
  Loader,
  Message,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import React, { useCallback } from 'react'
import { useTokenSecurity } from 'src/lib/hooks/react-query'
import { TokenSecurityView } from 'src/lib/wagmi/components/token-security-view'
import { EvmChain } from 'sushi/chain'
import {
  defaultCurrency,
  defaultQuoteCurrency,
  isTokenSecurityChainId,
} from 'sushi/config'
import type { Token } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

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
      if (token0?.approved === false) _tokens.push(token0)
      if (token1?.approved === false) _tokens.push(token1)

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

  const { data: token0SecurityResponse, isLoading: isToken0SecurityLoading } =
    useTokenSecurity({
      currency: token0NotInList && token0?.isToken ? token0 : undefined,
      enabled: Boolean(token0NotInList && token0?.isToken),
    })

  const { data: token1SecurityResponse, isLoading: isToken1SecurityLoading } =
    useTokenSecurity({
      currency: token1NotInList && token1?.isToken ? token1 : undefined,
      enabled: Boolean(token1NotInList && token1?.isToken),
    })

  const isTokenSecurityLoading =
    isToken0SecurityLoading || isToken1SecurityLoading

  const isHoneypot = Boolean(
    token0SecurityResponse?.is_honeypot?.goPlus ||
      token0SecurityResponse?.is_honeypot?.deFi ||
      token1SecurityResponse?.is_honeypot?.goPlus ||
      token1SecurityResponse?.is_honeypot?.deFi,
  )

  return (
    <Dialog
      open={Boolean(token0NotInList || token1NotInList)}
      onOpenChange={(open) => !open && reset()}
    >
      <DialogContent className="!max-h-screen overflow-y-auto">
        <DialogHeader className="!text-left !space-y-3">
          <DialogTitle>
            <div
              className={classNames(
                'inline-flex items-center px-2 py-1.5 gap-1 rounded-full',
                isTokenSecurityLoading
                  ? 'bg-muted'
                  : isHoneypot
                    ? 'bg-red/20 text-red'
                    : 'bg-yellow/20 text-yellow',
              )}
            >
              {isTokenSecurityLoading ? (
                <div className="w-7 h-7 flex justify-center items-center">
                  <Loader width={28} height={28} />
                </div>
              ) : isHoneypot ? (
                <ExclamationTriangleIcon width={28} height={28} />
              ) : (
                <ExclamationCircleIcon width={28} height={28} />
              )}
            </div>
          </DialogTitle>
          {isTokenSecurityLoading ? (
            <span className="w-52">
              <SkeletonText fontSize="xl" />
            </span>
          ) : (
            <span className="text-xl font-semibold">
              {isHoneypot ? 'Honeypot Token Detected' : 'Unverified Token'}
            </span>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {token0 && token0NotInList && !token0?.isToken && (
            <List>
              {token1NotInList ? <List.Label>Token 1</List.Label> : null}
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
            <>
              <List>
                {token1NotInList ? <List.Label>Token 1</List.Label> : null}
                <List.Control className="!p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Badge
                        position="bottom-right"
                        badgeContent={
                          <div className="bg-white rounded-full dark:bg-slate-800">
                            <NetworkIcon
                              width={20}
                              height={20}
                              chainId={token0.chainId}
                            />
                          </div>
                        }
                      >
                        <div className="w-10 h-10">
                          <UnknownTokenIcon width={40} height={40} />
                        </div>
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-2xl font-medium">
                          {token0.symbol ?? '-'}
                        </span>
                        <span className="font-medium text-muted-foreground">
                          {token0.name ?? '-'}
                        </span>
                      </div>
                    </div>
                    <LinkExternal
                      target="_blank"
                      href={EvmChain.from(token0.chainId)?.getTokenUrl(
                        token0.address,
                      )}
                      className="font-medium"
                    >
                      {shortenAddress(token0.address)}{' '}
                    </LinkExternal>
                  </div>
                </List.Control>
              </List>
              {isTokenSecurityChainId(token0.chainId) && (
                <List className="!pt-0 max-h-64">
                  <List.Control className="!overflow-y-auto flex flex-col gap-3 p-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Token Security Scan
                      </span>
                    </div>
                    <TokenSecurityView
                      token={token0}
                      tokenSecurity={token0SecurityResponse}
                      isTokenSecurityLoading={isToken0SecurityLoading}
                    />
                  </List.Control>
                </List>
              )}
            </>
          )}
          {token1 && token1NotInList && !token1.isToken && (
            <List>
              {token0NotInList ? <List.Label>Token 2</List.Label> : null}
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
            <>
              <List>
                {token0NotInList ? <List.Label>Token 2</List.Label> : null}
                <List.Control className="!p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Badge
                        position="bottom-right"
                        badgeContent={
                          <div className="bg-white rounded-full dark:bg-slate-800">
                            <NetworkIcon
                              width={20}
                              height={20}
                              chainId={token1.chainId}
                            />
                          </div>
                        }
                      >
                        <div className="w-10 h-10">
                          <UnknownTokenIcon width={40} height={40} />
                        </div>
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-2xl font-medium">
                          {token1.symbol ?? '-'}
                        </span>
                        <span className="font-medium text-muted-foreground">
                          {token1.name ?? '-'}
                        </span>
                      </div>
                    </div>
                    <LinkExternal
                      target="_blank"
                      href={EvmChain.from(token1.chainId)?.getTokenUrl(
                        token1.address,
                      )}
                      className="font-medium"
                    >
                      {shortenAddress(token1.address)}{' '}
                    </LinkExternal>
                  </div>
                </List.Control>
              </List>
              {isTokenSecurityChainId(token1.chainId) && (
                <List className="!pt-0 max-h-64">
                  <List.Control className="!overflow-y-auto flex flex-col gap-3 p-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Token Security Scan
                      </span>
                    </div>
                    <TokenSecurityView
                      token={token1}
                      tokenSecurity={token1SecurityResponse}
                      isTokenSecurityLoading={isToken1SecurityLoading}
                    />
                  </List.Control>
                </List>
              )}
            </>
          )}
        </div>
        <Message size="sm" variant={isHoneypot ? 'destructive' : 'warning'}>
          {isHoneypot
            ? 'Honeypot tokens restrict selling. Sushi does not support this token type.'
            : 'Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects. If you purchase this token, you may not be able to sell it back.'}
        </Message>
        <DialogFooter>
          {isHoneypot ? (
            <Button fullWidth size="xl" onClick={reset}>
              Close
            </Button>
          ) : (
            <div className="flex gap-3 w-full">
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
                Confirm Import
              </Button>
              <Button fullWidth size="xl" onClick={reset} variant="secondary">
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
