import React, { useEffect, useRef, useState } from 'react'
import TradeInput from './TradeInput'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useAllCommonPairs } from 'utils/utilFunctions'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { useTokenBalance } from 'utils/useTokenBalance'

interface Props {
  handleSwap: () => void
}

export const SwapTradeInput = ({ handleSwap }: Props) => {
  const { connected, account, network } = useWallet()
  const tradeVal = useRef<HTMLInputElement>(null)
  const [controller, setController] = useState<AbortController | null>(null)
  const { amount, token0, token1, error, isTransactionPending } = useSwapState()
  const { data: balance, isLoading } = useTokenBalance(
    account?.address as string,
    token0,
    Number(network?.chainId) || 1
  )
  console.log('isLoading', isLoading)
  console.log(balance)
  const [slippageTolerance] = useSlippageTolerance()
  const {
    setAmount,
    setError,
    setToken0,
    setOutputAmount,
    setPriceFetching,
    setSlippageAmount,
    setBestRoutes,
    setNoRouteFound,
  } = useSwapActions()
  useEffect(() => {}, [controller])
  const getSwapPrice = async (tradeVal: number = 0): Promise<any> => {
    if (controller) {
      controller.abort()
    }
    const newController = new AbortController()
    setController(newController)
    setPriceFetching(true)
    setOutputAmount('')
    setNoRouteFound('')
    if (tradeVal > 0) {
      const routes: any = await useAllCommonPairs(
        tradeVal * 10 ** 8,
        token0,
        token1,
        network?.name?.toLowerCase(),
        newController
      )
      if (routes?.amountOut) {
        setOutputAmount(routes.amountOut)
        setSlippageAmount(routes?.amountOut)
      }
      if (routes?.route) {
        setBestRoutes(routes?.route)
        setNoRouteFound('')
      } else {
        setBestRoutes([])
        setNoRouteFound('Price Impact High')
      }
    }
    setPriceFetching(false)
  }

  useEffect(() => {
    checkBalance(String(amount))
  }, [account, connected, network, token0, token1, isTransactionPending, slippageTolerance, amount, balance])

  const checkBalance = (value: string) => {
    setAmount(value)
    getSwapPrice(parseFloat(value))
    if (connected) {
      const priceEst = balance / 10 ** token0?.decimals < parseFloat(value)
      if (priceEst) {
        setError('Exceeds Balance')
      } else {
        setError('')
      }
    } else {
      setError('')
    }
  }
  return (
    <TradeInput
      id="swap-from"
      type="INPUT"
      setToken={setToken0}
      token={token0}
      alteredSelected={token1}
      value={String(amount)}
      balance={balance}
      error={error}
      isLoadingPrice={isLoading}
      onUserInput={checkBalance}
      tradeVal={tradeVal}
      setAmount={setAmount}
      handleSwap={handleSwap}
    />
  )
}
