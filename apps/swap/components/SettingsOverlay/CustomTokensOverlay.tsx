import { ChevronRightIcon } from '@heroicons/react/outline'
import { CurrencyDollarIcon } from '@heroicons/react/solid'
import { Token } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { Currency, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import { TokenSelectorCustomTokenRow } from '@sushiswap/wagmi'
import React, { FC, useMemo, useState } from 'react'

import { useAllCustomTokens } from '../../lib/state/storage'

export const CustomTokensOverlay: FC = () => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const [customTokens, { removeCustomToken }] = useAllCustomTokens()
  const [ids, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    Object.values(customTokens).forEach((customTokensPerChain) =>
      Object.entries(customTokensPerChain).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      })
    )

    return [ids, tokens]
  }, [customTokens])

  if (!isMounted) return <></>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group items-center relative rounded-xl flex justify-between gap-3 w-full"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <CurrencyDollarIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex gap-1 w-full justify-between items-center py-4">
          <Typography variant="sm" weight={700}>
            Custom Tokens
          </Typography>
          <div className="flex gap-1">
            <Typography variant="sm" className="group-hover:text-slate-200 text-slate-300">
              {ids.length || '0'} Tokens
            </Typography>
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
                  onRemove={() => removeCustomToken({ chainId: currency.chainId, address: currency.wrapped.address })}
                />
              )}
            />
          </div>
          {tokens.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
              <div className="flex flex-col gap-1 justify-center items-center">
                <Typography variant="xs" className="flex italic text-slate-500">
                  No custom tokens found
                </Typography>
              </div>
            </div>
          )}
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
