import React from 'react'
import TradeInput from './TradeInput'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { formatNumber } from 'utils/utilFunctions'

interface Props {
  handleSwap: () => void
}

export const SwapTradeOutput = ({ handleSwap }: Props) => {
  const { token0, token1, balance1, isLoadingPrice, outputAmount, isPriceFetching } = useSwapState()
  const outputSwapTokenAmount = outputAmount
    ? String(formatNumber(parseFloat(outputAmount), token1 ? token1.decimals : 8))
    : ''
  const { setToken1 } = useSwapActions()
  return (
    <TradeInput
      handleSwap={handleSwap}
      id="swap-to"
      balance={balance1}
      setToken={setToken1}
      isLoadingPrice={isLoadingPrice || isPriceFetching}
      token={token1}
      alteredSelected={token0}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
    />
  )
}
