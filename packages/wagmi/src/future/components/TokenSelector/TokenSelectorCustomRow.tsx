import { LinkIcon, XCircleIcon } from '@heroicons/react/24/outline'
import chain from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Icon } from '@sushiswap/ui/components/currency/Icon'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import React, { CSSProperties, FC } from 'react'

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
            <Icon currency={currency} width={28} height={28} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-slate-200">{currency.symbol}</span>
            <div className="flex gap-1">
              <NetworkIcon type="naked" chainId={currency.chainId} width={14} height={14} />
              <span className="text-[10px] text-slate-500">{chain[currency.chainId].name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconButton
            icon={XCircleIcon}
            onClick={onRemove}
            name="Remove"
          />
          <a rel="noopener noreffer" href={chain[currency.chainId].getTokenUrl(currency.wrapped.address)} target="_blank">
            <IconButton
                icon={LinkIcon}
                iconProps={{  className: 'text-blue' }}
                name="View on explorer"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
