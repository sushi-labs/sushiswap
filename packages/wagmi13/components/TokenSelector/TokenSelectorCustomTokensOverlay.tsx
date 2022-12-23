import { ChevronRightIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Token } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { useCustomTokens, useRemoveCustomToken } from '@sushiswap/react-query'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Currency } from '@sushiswap/ui13/components/currency'
import { Overlay } from '@sushiswap/ui13/components/overlay'
import React, { FC, useMemo, useState } from 'react'

import { TokenSelectorCustomTokenRow } from './TokenSelectorCustomRow'

export const TokenSelectorCustomTokensOverlay: FC = () => {
  const isMounted = useIsMounted()
  const { data: customTokens } = useCustomTokens()
  const { mutate: onRemoveToken } = useRemoveCustomToken()

  const [open, setOpen] = useState<boolean>(false)

  const [ids, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    if (customTokens) {
      Object.entries(customTokens).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      })
    }

    return [ids, tokens]
  }, [customTokens])

  if (!isMounted) return <></>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
      >
        <div className="flex items-center justify-center w-5 h-5">
          <CurrencyDollarIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1 py-4">
          <span className="text-sm font-medium">Custom Tokens</span>
          <div className="flex gap-1">
            <span className="text-sm group-hover:text-slate-200 text-slate-300">{ids.length || '0'} Tokens</span>
            <div className="w-5 h-5 -mr-1.5 flex items-center">
              <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
            </div>
          </div>
        </div>
      </button>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Custom Tokens" />
          <div className="border-t border-slate-200/5 -ml-3 -mr-3 relative min-h-[320px] rounded-t-none lg:max-h-[calc(100%-108px)] rounded-xl overflow-hidden h-full">
            <Currency.List
              className="h-full"
              currencies={tokens}
              rowRenderer={({ style, currency }) => (
                <TokenSelectorCustomTokenRow
                  style={style}
                  currency={currency}
                  onRemove={() => onRemoveToken(currency.wrapped)}
                />
              )}
            />
          </div>
          {tokens.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-xs flex italic text-slate-500">No custom tokens found</span>
              </div>
            </div>
          )}
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
