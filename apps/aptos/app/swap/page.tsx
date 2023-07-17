'use client'
import { Widget as UIWidget } from '@sushiswap/ui/future/components/widget'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Drawer } from '@sushiswap/ui'
import SwapTrade from 'components/SwapTrade'
import { SwapButton } from 'components/SwapButton'
import React, { useEffect, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import Container from '@sushiswap/ui/future/components/Container'
import Loading from 'app/loading'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { TradeReviewDialog } from 'components/TradeReviewDialog'
import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { SwapTradeInput } from 'components/SwapTradeInput'
import { coinType } from 'utils/tokenData'
import { SwapTradeOutput } from 'components/SwapTradeOutput'
import { useTokens } from 'utils/useTokens'

type Data = {
  chainId: number
  id: string
  address: string
  decimals: number
  name: string | undefined
  symbol: string | undefined
}
export default function SwapPage() {
  const { account, connected, disconnect, network } = useWallet()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [slippageTolerance] = useSlippageTolerance('swapSlippage')
  const { setBalance0, setBalance1, setLoadingPrice, setToken0, setToken1 } = useSwapActions()
  const { token0, token1, isTransactionPending } = useSwapState()
  const [controller, setController] = useState<AbortController | null>(null)
  const { tokens } = useTokens()
  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
    setToken0(tokens[0])
    setToken1(tokens[1])
  }, [network])
  useEffect(() => {
    // setValue({})
    if (controller) {
      controller.abort()
    }
    const newController = new AbortController()
    setController(newController)
    setLoadingPrice(true)
    if (account?.address && network?.name && token0 && token1) {
      fetch(
        `https://fullnode.${network?.name?.toLowerCase()}.aptoslabs.com/v1/accounts/${account?.address}/resources`,
        { signal: newController.signal }
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.error_code) {
            const coinData0 = data?.filter((coin: coinType) => {
              return coin?.type.includes(token0.address)
            })
            const coinData1 = data?.filter((coin: coinType) => {
              return coin?.type.includes(token1.address)
            })
            setBalance0(coinData0[0]?.data?.coin?.value)
            setBalance1(coinData1[0]?.data?.coin?.value)
            setLoadingPrice(false)
          } else {
            setBalance0(0)
            setBalance1(0)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoadingPrice(false)
        })
    } else {
      setLoadingPrice(false)
      setBalance0(0)
      setBalance1(0)
    }
  }, [account, connected, network, token0, token1, isTransactionPending, slippageTolerance])

  useEffect(() => {
    if (connected) {
      setLoading(false)
    } else {
      const loadingInterval = setTimeout(() => {
        setLoading(false)
      }, 1750)
      return () => {
        clearInterval(loadingInterval)
      }
    }
  }, [connected])
  return (
    <>
      {isLoading && <Loading />}
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Drawer.Root>
            <WidgetTitleV2 />
            <div className="flex items-center justify-between">
              <SwitchAppType />
              <SettingsOverlay modules={[SettingsModule.SlippageTolerance, SettingsModule.CarbonOffset]} />
            </div>
            <UIWidget.Content>
              <SwapTradeInput />
              <SwapTrade />
              <SwapTradeOutput />
              <SwapButton />
            </UIWidget.Content>
          </Drawer.Root>
          {/*spacer for fixed positioned swap button */}
        </div>
        <div className="h-[68px] w-full" />

        <TradeReviewDialog isTransactionPending={isTransactionPending} />
        {/* <button onClick={() => testData()}>click</button> */}
      </Container>
    </>
  )
}
