import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { formatUnits } from 'viem'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'

export const SimpleSwapToken1Input = () => {
  const { token1, outputAmount, isPriceFetching } = useSimpleSwapState()
  const { setToken1 } = useSimpleSwapActions()

  const outputSwapTokenAmount = outputAmount
    ? formatUnits(outputAmount, token1.decimals)
    : ''

  return (
    <CurrencyInput
      chainId={token1.chainId}
      id="swap-to"
      onSelect={setToken1}
      currency={token1}
      fetching={isPriceFetching}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
      className="border border-accent p-4 bg-muted rounded-2xl"
      disableInsufficientBalanceError={true}
      label={<SwapInputLabel chainId={token1.chainId} type="OUTPUT" />}
    />
  )
}
