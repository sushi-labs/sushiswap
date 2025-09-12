import { XMarkIcon } from '@heroicons/react/20/solid'
import { usePinnedTokens } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Badge,
  Button,
  Currency,
  IconButton,
  buttonIconVariants,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { NativeAddress } from 'src/lib/constants'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import { useChipTokens } from '../hooks/use-chip-tokens'

interface TokenSelectorChipBar {
  chainId: EvmChainId
  onSelect(currency: EvmCurrency): void
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
      {tokens?.slice(0, 5)?.map(({ token, default: isDefault }) => (
        <TraceEvent
          events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
          name={InterfaceEventName.TOKEN_SELECTED}
          properties={{
            token_symbol: token?.symbol,
            token_address:
              token.type === 'native' ? NativeAddress : token.address,
          }}
          element={InterfaceElementName.COMMON_BASES_CURRENCY_BUTTON}
          key={token.id}
        >
          <div
            className="group"
            testdata-id={`token-selector-chip-${
              token.type === 'native'
                ? NativeAddress
                : token.address.toLowerCase()
            }`}
          >
            <Button
              size="sm"
              variant="secondary"
              className="group !rounded-full"
              key={token.id}
              onClick={() => onSelect(token)}
            >
              <Badge
                className="border border-slate-50 dark:border-slate-900 rounded-full z-[11]"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon chainId={token.chainId} width={12} height={12} />
                }
              >
                <Currency.Icon
                  width={24}
                  height={24}
                  className={buttonIconVariants({ size: 'default' })}
                  currency={token}
                  disableLink
                />
              </Badge>
              {token.symbol}
              {!isDefault && (
                <IconButton
                  size="xs"
                  name="remove"
                  icon={XMarkIcon}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Native tokens should always be default
                    if (token.type === 'native') return
                    mutate('remove', `${token.id}:${token.symbol}`)
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
