import { XMarkIcon } from '@heroicons/react/20/solid'
import { usePinnedTokens } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Button,
  Currency,
  IconButton,
  OverflowX,
  buttonIconVariants,
} from '@sushiswap/ui'
import { NativeAddress } from 'src/lib/constants'
import { type EvmCurrency, isEvmChainId } from 'sushi/evm'
import { type SvmCurrency, isSvmChainId } from 'sushi/svm'
import type { TokenSelectorChainId } from '../config'
import { useChipTokens } from '../hooks/use-chip-tokens'
import { useTokenSelectorTheme } from '../token-selector-theme'

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
  const theme = useTokenSelectorTheme()
  const tokens = useChipTokens({ chainId, includeNative })

  const isPinnable = (
    t: CurrencyFor<TChainId>,
  ): t is CurrencyFor<TChainId> & (EvmCurrency | SvmCurrency) =>
    isEvmChainId(t.chainId) || isSvmChainId(t.chainId)

  return (
    <OverflowX
      key={chainId}
      variant={theme}
      wrapperClassName="shrink-0"
      className="min-h-[82px]"
    >
      <div className="grid grid-flow-col auto-cols-max justify-start gap-2">
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
                variant={theme === 'perps' ? 'perps-secondary' : 'secondary'}
                className="group !h-auto !rounded-lg px-2 py-3 !w-[62px]"
                key={token.id}
                onClick={() => onSelect(token)}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <Currency.Icon
                    width={30}
                    height={30}
                    className={buttonIconVariants({ size: 'default' })}
                    currency={token}
                    disableLink
                  />
                  <div className="truncate w-[52px]">{token.symbol}</div>
                  {!isDefault && isPinnable(token) && (
                    <PinRemoveButton token={token} />
                  )}
                </div>
              </Button>
            </div>
          </TraceEvent>
        ))}
      </div>
    </OverflowX>
  )
}

function PinRemoveButton({ token }: { token: EvmCurrency | SvmCurrency }) {
  const theme = useTokenSelectorTheme()
  const { mutate } = usePinnedTokens()
  return (
    <IconButton
      size="xs"
      name="remove"
      icon={XMarkIcon}
      variant="ghost"
      className={
        theme === 'perps'
          ? 'text-perps-muted-50 hover:bg-white/[0.06] hover:text-perps-muted'
          : undefined
      }
      onClick={(e) => {
        e.stopPropagation()
        // Native tokens should always be default
        if (token.type === 'native') return
        mutate('remove', token.id)
      }}
    />
  )
}
