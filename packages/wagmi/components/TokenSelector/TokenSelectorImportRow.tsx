import { ExternalLinkIcon, ShieldExclamationIcon } from '@heroicons/react/outline'
import chain from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Button, classNames, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import React, { FC, useState } from 'react'

interface TokenSelectorImportRow {
  hideIcons?: boolean
  currency: Token
  className?: string
  onImport(): void
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({
  currency,
  className,
  onImport,
  hideIcons = false,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={classNames(className, `group flex items-center w-full px-6 py-2.5 token-${currency?.symbol}`)}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
          <div className="flex flex-row items-center flex-grow gap-2">
            <div className="w-7 h-7">
              <Icon currency={currency} width={28} height={28} />
            </div>
            <div className="flex flex-col items-start">
              <Typography variant="xs" weight={700} className="text-slate-200">
                {currency.symbol}
              </Typography>
              <Typography variant="xxs" className="text-slate-500">
                {currency.name}
              </Typography>
            </div>
          </div>
          <Button color="blue" size="xs">
            Import
          </Button>
        </div>
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)}>
        <Overlay.Content className="bg-slate-800 !p-0">
          <Overlay.Header onClose={() => setOpen(false)} title="Import Token" className="p-3 pb-0" />
          <div className="p-3 space-y-3">
            <div className="bg-red/20 rounded-2xl p-6 flex flex-col gap-2 items-center">
              {!hideIcons && (
                <div className="w-9 h-9">
                  <ShieldExclamationIcon width={36} height={36} className="text-red-300" />
                </div>
              )}
              <Typography weight={700} className="text-red-300">
                Trade at your own risk!
              </Typography>
              <Typography variant="xs" weight={700} className="text-red-100 text-center">
                This token doesn't appear on the active token list(s). Anyone can create a token, including creating
                fake versions of existing tokens that claim to represent projects
              </Typography>
            </div>
            <div className="flex flex-col p-4 items-center bg-slate-700 rounded-2xl p-6">
              <div className="flex flex-col items-center gap-3">
                {!hideIcons && (
                  <div className="w-9 h-9">
                    <Icon currency={currency} width={36} height={36} />
                  </div>
                )}
                <Typography weight={700} variant="lg">
                  {currency.symbol}
                </Typography>
              </div>
              <Typography
                variant="sm"
                weight={700}
                as="a"
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue hover:text-blue-400 flex gap-1 items-center"
                href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
              >
                {shortenAddress(currency.wrapped.address)} <ExternalLinkIcon width={16} height={16} />
              </Typography>
            </div>
            <Button fullWidth onClick={onImport}>
              Import
            </Button>
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
