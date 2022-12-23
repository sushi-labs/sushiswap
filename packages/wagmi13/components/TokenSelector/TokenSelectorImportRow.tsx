import { DocumentDuplicateIcon, ExclamationTriangleIcon, LinkIcon } from '@heroicons/react/24/outline'
import chain from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Button } from '@sushiswap/ui13/components/button'
import { ClipboardController } from '@sushiswap/ui13/components/ClipboardController'
import { Icon } from '@sushiswap/ui13/components/currency/Icon'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import { Overlay } from '@sushiswap/ui13/components/overlay'
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
      <div className="space-y-3 my-3">
        <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
          {!hideIcons && (
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden">
              <div className="flex items-center justify-center w-full h-full bg-red/10">
                <div className="w-5 h-5">
                  <ExclamationTriangleIcon width={20} height={20} className="text-red" />
                </div>
              </div>
            </div>
          )}
          <span className="font-medium text-lg text-slate-200">Trade at your own risk!</span>
          <span className="text-sm text-slate-400 text-center">
            {currencies.length > 1 ? "These tokens don't" : "This token doesn't"} appear on the active token list(s).
            Anyone can create a token, including creating fake versions of existing tokens that claim to represent
            projects
          </span>
        </div>
        {currencies.map((currency) => {
          if (!currency) return
          return (
            <div
              key={currency.wrapped.address}
              className="flex justify-between px-4 p-3 items-center bg-slate-700 rounded-2xl"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">{currency.symbol}</span>
                <span className="text-xs font-medium text-slate-400">{currency.name}</span>
              </div>
              <div className="flex-flex-col">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm font-medium text-blue hover:text-blue-400 flex gap-1 items-center"
                  href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
                >
                  View on Explorer <LinkIcon width={16} height={16} />
                </a>
                <ClipboardController>
                  {({ isCopied, setCopied }) => (
                    <IconButton
                      onClick={() => setCopied(currency?.wrapped.address)}
                      className="p-0.5"
                      description={isCopied ? 'Copied!' : 'Copy'}
                    >
                      <DocumentDuplicateIcon width={18} height={18} />
                    </IconButton>
                  )}
                </ClipboardController>
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
                  <Icon currency={currencies[0]} width={28} height={28} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-slate-200">{currencies[0].symbol}</span>
                  <span className="text-[10px] text-slate-500">{currencies[0].name}</span>
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
