import { Button, Dots } from '@sushiswap/ui'
import { useDerivedStateCrossChainSwap } from '../derivedstate-cross-chain-swap-provider'

export function ConfirmSwapButton({
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
  const {
    state: { swapAmountString, token0, token1 },
  } = useDerivedStateCrossChainSwap()

  return (
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
        `Swap ${token0?.code} for ${token1?.symbol}`
      )}
    </Button>
  )
}
