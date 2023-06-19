import { ChevronRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon, XCircleIcon } from '@heroicons/react/20/solid'
import chain from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { Currency, IconButton, NetworkIcon, Overlay, SlideIn, Typography } from '@sushiswap/ui'
import React, { CSSProperties, FC, useMemo, useState } from 'react'

import { TokenSelectorProps } from './TokenSelector'

export const TokenSelectorCustomTokenRow: FC<{
  style: CSSProperties
  currency: Type
  onRemove(): void
}> = ({ style, currency, onRemove }) => {
  return (
    <div className="flex items-center w-full p-4" style={style}>
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-2">
          <div className="w-7 h-7">
            <Currency.Icon currency={currency} width={28} height={28} />
          </div>
          <div className="flex flex-col items-start">
            <Typography variant="xs" weight={500} className="text-slate-200">
              {currency.symbol}
            </Typography>
            <div className="flex gap-1">
              <NetworkIcon type="naked" chainId={currency.chainId} width={14} height={14} />
              <Typography variant="xxs" className="text-slate-500">
                {chain[currency.chainId].name}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconButton onClick={onRemove}>
            <XCircleIcon width={20} height={20} className="text-slate-500" />
          </IconButton>
          <IconButton
            as="a"
            rel="noopener noreffer"
            target="_blank"
            href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)}
          >
            <ArrowTopRightOnSquareIcon width={20} height={20} className="text-blue" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

type TokenSelectorSettingsOverlayProps = Pick<TokenSelectorProps, 'customTokenMap' | 'onRemoveToken'>

export const TokenSelectorCustomTokensOverlay: FC<TokenSelectorSettingsOverlayProps> = ({
  customTokenMap,
  onRemoveToken,
}) => {
  const isMounted = useIsMounted()
  const [open, setOpen] = useState<boolean>(false)
  const [ids, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    if (customTokenMap) {
      Object.entries(customTokenMap).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      })
    }

    return [ids, tokens]
  }, [customTokenMap])

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
          <Typography variant="sm" weight={500}>
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
                  onRemove={() =>
                    onRemoveToken &&
                    onRemoveToken({
                      chainId: currency.chainId,
                      address: currency.wrapped.address,
                    })
                  }
                />
              )}
            />
          </div>
          {tokens.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center gap-1">
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
