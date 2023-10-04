import { Chain } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { shortenAddress } from 'sushi'
import { useTokenSecurity } from '@sushiswap/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  GoPlusLabsIcon,
  LinkExternal,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Icon } from '@sushiswap/ui/components/currency/Icon'
import { List } from '@sushiswap/ui/components/list/List'
import React, { FC, ReactNode, useCallback, useState } from 'react'

interface TokenSelectorImportRow {
  currencies: (Token | undefined)[]
  onImport(): void
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({ currencies, onImport }) => {
  const [open, setOpen] = useState(false)
  const { data: tokenSecurity } = useTokenSecurity({ currencies, enabled: open })

  const onClick = useCallback(() => {
    if (!tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0) {
      onImport()

      setTimeout(() => {
        setOpen(false)
      }, 250)
    } else {
      setOpen(false)
    }
  }, [onImport])

  return (
    <Dialog>
      <div className="relative py-0.5 h-[64px]">
        <div className="flex items-center w-full hover:bg-muted focus:bg-accent h-full rounded-lg px-3">
          {currencies[0] ? (
            <div className="flex flex-row items-center flex-grow gap-4">
              <div className="w-10 h-10">
                <Icon disableLink currency={currencies[0]} width={40} height={40} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white">
                  {currencies[0].symbol}
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                  {currencies[0].name}
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col">
            <DialogTrigger asChild>
              <Button size="xs">Import</Button>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          {!tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0 ? (
            <>
              <DialogTitle>Import token</DialogTitle>
              <DialogDescription>
                Trade at your own risk! {currencies.length > 1 ? "These tokens don't" : "This token doesn't"} appear on
                the active token list(s). Anyone can create a token, including creating fake versions of existing tokens
                that claim to represent projects.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Not supported!</DialogTitle>
              <DialogDescription>
                {tokenSecurity.honeypots.length > 1
                  ? 'These tokens have been identified as potential honeypot scams and are not supported. Do not interact with these tokens to safeguard your assets.'
                  : 'This token has been identified as a potential honeypot scam and is not supported. Do not interact with this token to safeguard your assets.'}{' '}
                <Button asChild variant="link" size="sm">
                  <LinkExternal href="https://coinbrain.com/dictionary/honeypot-scam">
                    Learn more about honeypot tokens
                  </LinkExternal>
                </Button>
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0 ? (
            <List className="!pt-0">
              <List.Control>
                {currencies.reduce<ReactNode[]>((acc, cur) => {
                  if (cur) {
                    acc.push(
                      <div className="flex items-center gap-4 py-2 px-4">
                        <Icon currency={cur} width={40} height={40} />
                        <div className="flex flex-col gap-1">
                          <span className="truncate font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                            {cur.symbol}
                          </span>
                          <a
                            target="_blank"
                            href={Chain.from(cur.chainId).getTokenUrl(cur.address)}
                            className="flex gap-1 text-sm text-blue font-medium"
                            rel="noreferrer"
                          >
                            {shortenAddress(cur.address)}
                          </a>
                        </div>
                      </div>
                    )
                  }

                  return acc
                }, [])}
              </List.Control>
            </List>
          ) : (
            <List className="!pt-0">
              <List.Control>
                {tokenSecurity.honeypots.reduce<ReactNode[]>((acc, cur) => {
                  const currency = currencies.find((currency) => currency?.address === cur)
                  if (currency) {
                    acc.push(
                      <div className="flex items-center gap-4 py-2 px-4">
                        <Icon currency={currency} width={40} height={40} />
                        <div className="flex flex-col gap-1">
                          <span className="truncate font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                            {currency.symbol}
                          </span>
                          <a
                            target="_blank"
                            href={Chain.from(currency.chainId).getTokenUrl(currency.address)}
                            className="flex gap-1 text-sm text-blue font-medium"
                            rel="noreferrer"
                          >
                            {shortenAddress(currency.address)}
                          </a>
                        </div>
                      </div>
                    )
                  }

                  return acc
                }, [])}
              </List.Control>
            </List>
          )}
        </div>
        <DialogFooter>
          <div className="flex flex-col gap-3 w-full">
            <Button fullWidth size="xl" onClick={onClick}>
              {!tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0 ? 'I understand' : 'Close'}
            </Button>
            {tokenSecurity?.isSupported ? (
              <div className="flex items-center gap-0.5 justify-center">
                <span className="text-xs text-gray-700 dark:text-slate-400">Honeypot detection powered by GoPlus</span>
                <GoPlusLabsIcon width={22} height={22} />
              </div>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
