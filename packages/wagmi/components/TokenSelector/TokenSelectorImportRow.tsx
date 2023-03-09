import { ExclamationCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import chain from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Button, classNames, CopyHelper, Currency, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import React, { FC, useMemo, useState } from 'react'

interface TokenSelectorImportRow {
  hideIcons?: boolean
  currencies: (Token | undefined)[]
  className?: string
  onImport(): void
  slideIn?: boolean
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({
  currencies,
  className,
  onImport,
  hideIcons = false,
  slideIn = true,
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const content = useMemo(
    () => (
      <div className="my-3 space-y-3">
        <div className="flex flex-col items-center gap-2 p-3 rounded-2xl">
          {!hideIcons && (
            <div className="w-10 h-10 overflow-hidden bg-white rounded-full">
              <div className="flex items-center justify-center w-full h-full bg-red/10">
                <div className="w-5 h-5">
                  <ExclamationCircleIcon width={20} height={20} className="text-red" />
                </div>
              </div>
            </div>
          )}
          <Typography weight={500} variant="lg" className="text-slate-200">
            Trade at your own risk!
          </Typography>
          <Typography variant="sm" weight={400} className="text-center text-slate-400">
            {currencies.length > 1 ? "These tokens don't" : "This token doesn't"} appear on the active token list(s).
            Anyone can create a token, including creating fake versions of existing tokens that claim to represent
            projects
          </Typography>
        </div>
        {currencies.map((currency) => {
          if (!currency) return
          return (
            <div
              key={currency.wrapped.address}
              className="flex items-center justify-between p-3 px-4 bg-slate-700 rounded-2xl"
            >
              <div className="flex flex-col">
                <Typography weight={500} className="text-slate-200">
                  {currency.symbol}
                </Typography>
                <Typography weight={500} variant="xs" className="text-slate-400">
                  {currency.name}
                </Typography>
              </div>
              <div className="flex-flex-col">
                <Typography
                  variant="sm"
                  weight={500}
                  as="a"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex items-center gap-1 text-blue hover:text-blue-400"
                  href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
                >
                  View on Explorer <ArrowTopRightOnSquareIcon width={16} height={16} />
                </Typography>
                <Typography weight={500} variant="xs" className="flex justify-end text-slate-400">
                  <CopyHelper toCopy={shortenAddress(currency.wrapped.address)}>
                    {shortenAddress(currency.wrapped.address)}
                  </CopyHelper>
                </Typography>
              </div>
            </div>
          )
        })}
        <Button size="md" as="div" onClick={onImport}>
          Import
        </Button>
      </div>
    ),
    [currencies, hideIcons, onImport]
  )

  return (
    <>
      {slideIn && currencies[0] ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={classNames(
              className,
              `group flex items-center w-full px-6 py-2.5 token-${currencies[0]?.symbol}`
            )}
          >
            <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
              <div className="flex flex-row items-center flex-grow gap-2">
                <div className="w-7 h-7">
                  <Currency.Icon currency={currencies[0]} width={28} height={28} />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="xs" weight={500} className="text-slate-200">
                    {currencies[0].symbol}
                  </Typography>
                  <Typography variant="xxs" className="text-slate-500">
                    {currencies[0].name}
                  </Typography>
                </div>
              </div>
              <Button as="div" color="blue" size="xs">
                Import
              </Button>
            </div>
          </button>
          <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
            <Overlay.Content className="bg-slate-800 !pb-0">
              <Overlay.Header onClose={() => setOpen(false)} title="Import Token" />
              {content}
            </Overlay.Content>
          </SlideIn.FromLeft>
        </>
      ) : (
        content
      )}
    </>
  )
}
