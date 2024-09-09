import { XMarkIcon } from '@heroicons/react/20/solid'
import { usePinnedTokens } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, Currency, IconButton, buttonIconVariants } from '@sushiswap/ui'
import { NativeAddress } from 'src/lib/hooks/react-query'
import type { ChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'
import { useChipTokens } from '../hooks/use-chip-tokens'

interface TokenSelectorChipBar {
  chainId: ChainId
  onSelect(currency: Type): void
  includeNative?: boolean
  showPinnedTokens?: boolean
}

export function TokenSelectorChipBar({
  chainId,
  onSelect,
  includeNative,
  showPinnedTokens = true,
}: TokenSelectorChipBar) {
  const tokens = useChipTokens({ chainId, includeNative, showPinnedTokens })

  const { mutate } = usePinnedTokens()

  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map(({ token, default: isDefault }) => (
        <TraceEvent
          events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
          name={InterfaceEventName.TOKEN_SELECTED}
          properties={{
            token_symbol: token?.symbol,
            token_address: token?.isNative ? NativeAddress : token?.address,
          }}
          element={InterfaceElementName.COMMON_BASES_CURRENCY_BUTTON}
          key={token.id}
        >
          <div
            className="group"
            testdata-id={`token-selector-chip-${
              token.isNative ? NativeAddress : token.address.toLowerCase()
            }`}
          >
            <Button
              size="sm"
              variant="secondary"
              className="group"
              key={token.id}
              onClick={() => onSelect(token)}
            >
              <Currency.Icon
                width={20}
                height={20}
                className={buttonIconVariants({ size: 'default' })}
                currency={token}
                disableLink
              />
              {token.symbol}
              {!isDefault && (
                <IconButton
                  size="xs"
                  name="remove"
                  icon={XMarkIcon}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    mutate('remove', token.id)
                  }}
                />
              )}
            </Button>
          </div>
        </TraceEvent>
      ))}
    </div>
  )
}
