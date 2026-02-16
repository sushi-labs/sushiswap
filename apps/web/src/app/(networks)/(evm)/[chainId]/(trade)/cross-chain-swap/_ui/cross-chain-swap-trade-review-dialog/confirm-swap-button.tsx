import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { Button, Dots } from '@sushiswap/ui'
import type { XSwapSupportedChainId } from 'src/config'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'

export function ConfirmSwapButton<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>({
  confirm,
  write,
  isWritePending,
  isEstGasError,
  isStepQueryError,
  showPriceImpactWarning,
  showSlippageWarning,
}: {
  confirm: () => void
  write?: (confirm: () => void) => Promise<void>
  isWritePending: boolean
  isEstGasError: boolean
  isStepQueryError: boolean
  showPriceImpactWarning: boolean
  showSlippageWarning: boolean
}) {
  const trace = useTrace()

  const {
    state: { swapAmountString, token0, token1 },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()

  return (
    <TraceEvent
      events={[BrowserEvent.onClick]}
      element={InterfaceElementName.CONFIRM_SWAP_BUTTON}
      name={SwapEventName.XSWAP_SUBMITTED_BUTTON_CLICKED}
      properties={{
        ...trace,
      }}
    >
      <Button
        fullWidth
        size="xl"
        loading={!write && !isEstGasError && !isStepQueryError}
        onClick={() => write?.(confirm)}
        disabled={
          isWritePending ||
          Boolean(!write && +swapAmountString > 0) ||
          isEstGasError ||
          isStepQueryError
        }
        color={
          isEstGasError ||
          isStepQueryError ||
          showPriceImpactWarning ||
          showSlippageWarning
            ? 'red'
            : 'blue'
        }
        testId="confirm-swap"
      >
        {isEstGasError || isStepQueryError ? (
          'Shoot! Something went wrong :('
        ) : isWritePending ? (
          <Dots>Confirm Swap</Dots>
        ) : (
          `Swap ${token0?.symbol} for ${token1?.symbol}`
        )}
      </Button>
    </TraceEvent>
  )
}
