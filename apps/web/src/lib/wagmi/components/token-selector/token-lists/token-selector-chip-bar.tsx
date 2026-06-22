import { XMarkIcon } from '@heroicons/react/20/solid'
import { usePinnedTokens } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, Currency, IconButton, buttonIconVariants } from '@sushiswap/ui'
import { NativeAddress } from 'src/lib/constants'
import { type EvmCurrency, isEvmChainId } from 'sushi/evm'
import { type SvmCurrency, isSvmChainId } from 'sushi/svm'
import type { TokenSelectorChainId } from '../config'
import { useChipTokens } from '../hooks/use-chip-tokens'

interface TokenSelectorChipBar<TChainId extends TokenSelectorChainId> {
  chainId: TChainId
  onSelect(currency: CurrencyFor<TChainId>): void
  includeNative?: boolean
}

export function TokenSelectorChipBar<TChainId extends TokenSelectorChainId>({
  chainId,
  onSelect,
  includeNative,
}: TokenSelectorChipBar<TChainId>) {
  const tokens = useChipTokens({ chainId, includeNative })

  const isPinnable = (
    t: CurrencyFor<TChainId>,
  ): t is CurrencyFor<TChainId> & (EvmCurrency | SvmCurrency) =>
    isEvmChainId(t.chainId) || isSvmChainId(t.chainId)

  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map(({ token, default: isDefault }) => (
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
              {!isDefault && isPinnable(token) && (
                <PinRemoveButton token={token} />
              )}
            </Button>
          </div>
        </TraceEvent>
      ))}
    </div>
  )
}

function PinRemoveButton({ token }: { token: EvmCurrency | SvmCurrency }) {
  const { mutate } = usePinnedTokens()
  return (
    <IconButton
      size="xs"
      name="remove"
      icon={XMarkIcon}
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation()
        // Native tokens should always be default
        if (token.type === 'native') return
        mutate('remove', token.id)
      }}
    />
  )
}
