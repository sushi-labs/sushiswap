import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { SlideIn } from '@sushiswap/ui/future/components/animation'
import { Button } from '@sushiswap/ui/future/components/button'
import { Icon } from '@sushiswap/ui/future/components/currency/Icon'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Overlay } from '@sushiswap/ui/future/components/overlay'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { shortenAddress } from '@sushiswap/format'
import { useTokenSecurity } from '@sushiswap/react-query'
import { DangerousIcon, GoPlusLabsIcon } from '@sushiswap/ui/icons'
import { Link } from '@sushiswap/ui'

interface TokenSelectorImportRow {
  currencies: (Token | undefined)[]
  onImport(): void
  slideIn?: boolean
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({ currencies, onImport, slideIn = true }) => {
  const [open, setOpen] = useState<boolean>(false)

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  const { data: tokenSecurity } = useTokenSecurity({ currencies, enabled: open })

  const content = useMemo(
    () =>
      !tokenSecurity?.honeypots || tokenSecurity.honeypots.length === 0 ? (
        <div className="space-y-3 my-3">
          <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
            <ExclamationTriangleIcon width={26} height={26} className="text-red" />
            <span className="font-medium text-lg text-gray-900 dark:text-slate-200">Trade at your own risk!</span>
            <span className="text-sm text-gray-600 dark:text-slate-400 text-center">
              {currencies.length > 1 ? "These tokens don't" : "This token doesn't"} appear on the active token list(s).
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects
            </span>
          </div>
          <List>
            <List.Control>
              {currencies.reduce<ReactNode[]>((acc, cur) => {
                if (cur) {
                  acc.push(
                    <div className="py-0.5 h-[64px]">
                      <div className="flex items-center w-full h-full rounded-lg px-3">
                        <div className="flex items-center justify-between flex-grow gap-2 rounded">
                          <div className="flex flex-row items-center flex-grow gap-4">
                            <Icon currency={cur} width={40} height={40} />
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                                {cur.symbol}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                                {cur.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-right font-medium text-sm text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                              {shortenAddress(cur.address)}
                            </span>
                            <a
                              target="_blank"
                              href={Chain.from(cur.chainId).getTokenUrl(cur.address)}
                              className="flex gap-1 text-sm items-center text-blue font-medium justify-end"
                              rel="noreferrer"
                            >
                              View on Explorer <ArrowTopRightOnSquareIcon width={14} height={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return acc
              }, [])}
            </List.Control>
          </List>
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
            {tokenSecurity?.isSupported && (
              <div className="flex items-center gap-0.5 justify-center">
                <span className="text-xs text-gray-700 dark:text-slate-400">Honeypot detection powered by GoPlus</span>
                <GoPlusLabsIcon width={22} height={20} />
              </div>
            )}
            <Button fullWidth size="xl" variant="outlined" color="blue" onClick={onClick}>
              Import
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 my-3">
          <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
            <DangerousIcon width={26} height={26} className="text-red" />
            <span className="font-medium text-lg text-gray-900 dark:text-slate-200">Honeypot Token Not Supported!</span>
            {/* TODO: link to academy article */}
            <Link.External
              href="https://coinbrain.com/dictionary/honeypot-scam"
              className="text-blue underline text-sm"
            >
              What is a honeypot token?
            </Link.External>
            <span className="text-sm text-gray-600 dark:text-slate-400 text-center">
              {tokenSecurity.honeypots.length > 1
                ? 'These tokens have been identified as potential honeypot scams and are not supported. Do not interact with these tokens to safeguard your assets.'
                : 'This token has been identified as a potential honeypot scam and is not supported. Do not interact with this token to safeguard your assets.'}
            </span>
          </div>
          <List>
            <List.Control>
              {tokenSecurity.honeypots.reduce<ReactNode[]>((acc, cur) => {
                const currency = currencies.find((currency) => currency?.address === cur)
                if (currency) {
                  acc.push(
                    <div className="py-0.5 h-[64px]">
                      <div className="flex items-center w-full h-full rounded-lg px-3">
                        <div className="flex items-center justify-between flex-grow gap-2 rounded">
                          <div className="flex flex-row items-center flex-grow gap-4">
                            <Icon currency={currency} width={40} height={40} />
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                                {currency.symbol}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                                {currency.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-right font-medium text-sm text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                              {shortenAddress(currency.address)}
                            </span>
                            <a
                              target="_blank"
                              href={Chain.from(currency.chainId).getTokenUrl(currency.address)}
                              className="flex gap-1 text-sm items-center text-blue font-medium justify-end"
                              rel="noreferrer"
                            >
                              View on Explorer <ArrowTopRightOnSquareIcon width={14} height={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return acc
              }, [])}
            </List.Control>
          </List>
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
            {tokenSecurity.isSupported && (
              <div className="flex items-center gap-0.5 justify-center">
                <span className="text-xs text-gray-700 dark:text-slate-400">Honeypot detection powered by GoPlus</span>
                <GoPlusLabsIcon width={22} height={20} />
              </div>
            )}
            <Button fullWidth size="xl" variant="outlined" color="blue" disabled>
              Honeypot Token Not Supported
            </Button>
          </div>
        </div>
      ),
    [currencies, onImport, tokenSecurity]
  )

  return (
    <>
      {slideIn && currencies[0] ? (
        <>
          <div className="py-0.5 h-[64px]">
            <div className="flex items-center w-full h-full rounded-lg px-3">
              <div className="flex items-center justify-between flex-grow gap-2 rounded">
                <div className="flex flex-row items-center flex-grow gap-4">
                  <Icon currency={currencies[0]} width={40} height={40} />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                      {currencies[0].symbol}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                      {currencies[0].name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <Button className="rounded-full" color="blue" size="xs" onClick={() => setOpen(true)}>
                    Import
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <SlideIn.FromRight show={open} onClose={() => setOpen(false)}>
            <Overlay.Content className="bg-white dark:bg-slate-800 !pb-0">
              <Overlay.Header onBack={() => setOpen(false)} title="" />
              {content}
            </Overlay.Content>
          </SlideIn.FromRight>
        </>
      ) : (
        content
      )}
    </>
  )
}
