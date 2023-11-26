import React from 'react'
import TradeInput from './TradeInput'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { formatNumber } from 'utils/utilFunctions'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

interface Props {
  handleSwap: () => void
}

export const SwapTradeOutput = ({ handleSwap }: Props) => {
  const { account } = useWallet()
  const { token0, token1, outputAmount, isPriceFetching } = useSwapState()
  const { data: balance, isLoading } = useTokenBalance({
    account: account?.address as string,
    currency: token1?.address,
    refetchInterval: 2000,
  })
  const outputSwapTokenAmount = outputAmount ? formatNumber(Number(outputAmount), token1 ? token1.decimals : 8) : ''
  const { setToken1 } = useSwapActions()
  return (
    <TradeInput
      handleSwap={handleSwap}
      id="swap-to"
      balance={balance}
      setToken={setToken1}
      isLoadingPrice={isLoading || isPriceFetching}
      token={token1}
      alteredSelected={token0}
      disabled={true}
      type="OUTPUT"
      value={outputSwapTokenAmount}
    />
  )
}
