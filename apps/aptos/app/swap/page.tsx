'use client'
import { Widget as UIWidget } from '@sushiswap/ui/future/components/widget'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import { Dialog, Transition } from '@headlessui/react'
import { Drawer } from '@sushiswap/ui'
import SwapTrade from 'components/SwapTrade'
import DEFAULT_TOKEN_LIST from './../../config/tokenList.json'
import TokenListDialog from 'components/TokenListDialog'
import TradeInput from 'components/TradeInput'
import { SwapButton } from 'components/SwapButton'
import React, { useEffect, useRef, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { getPoolPairs, getYTokenPrice, useAllCommonPairs } from 'utils/utilFunctions'
import { Network, Provider } from 'aptos'
import { Token } from 'utils/tokenType'
import Container from '@sushiswap/ui/future/components/Container'
import Loading from 'app/loading'
import TradeOutput from 'components/TradeOutput'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { payloadArgs } from 'utils/payloadUtil'
import { Theme, toast } from 'react-toastify'
import { ToastContent } from '@sushiswap/ui/future/components/toast/ToastContent'
import { useTheme } from 'next-themes'
import { ToastButtons } from '@sushiswap/ui/future/components/toast/ToastButtons'
import { TOAST_OPTIONS } from '@sushiswap/ui/future/components/toast'
import { TradeReviewDialog } from 'components/TradeReviewDialog'

interface coinType {
  type: string
  data: any
}
export default function SwapPage() {
  const { account, connected, disconnect, network, signAndSubmitTransaction } = useWallet()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [token0, setToken0] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[0])
  const [token1, setToken1] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[1])
  const [buttonError, setButtonError] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [filteredCoin0, setFilteredCoin0] = useState<coinType | undefined>(undefined)
  const [filteredCoin1, setFilteredCoin1] = useState<coinType | undefined>(undefined)
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
  const [isLoadingPriceLower, setLoadingPriceLower] = useState<boolean>(true)
  const [tokenSelectedNumber, setTokenSelectedNumber] = useState<string>('')
  const [token1Value, setToken1Value] = useState<number>(0)
  const [swapPerTokenPrice, setSwapPerTokenPrice] = useState<any>()
  const [isTransactionPending, setisTransactionPending] = useState(false)
  const [noRouteFound, setNoRouteFound] = useState<string>('')
  const [controller, setController] = useState<AbortController | null>(null)
  const [slippageTolerance] = useSlippageTolerance('swapSlippage')
  const tradeVal = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const slippageAmount =
    swapPerTokenPrice?.amountOut -
    (swapPerTokenPrice?.amountOut * parseFloat(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance)) / 100

  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
  }, [network])

  const handleChangeToken = (token: Token) => {
    setOpen(false)
    if (tokenSelectedNumber == '0') {
      setToken0(token)
    } else {
      setToken1(token)
    }
  }
  const getSwapPrice = async (tradeVal: number): Promise<any> => {
    if (controller) {
      controller.abort()
      setSwapPerTokenPrice('')
    }

    const newController = new AbortController()
    setController(newController)
    setLoadingPriceLower(true)
    setSwapPerTokenPrice('')
    const returnRoutes = await useAllCommonPairs(tradeVal * 10 ** 8, token0, token1, newController)
    setSwapPerTokenPrice(returnRoutes)
    if (returnRoutes?.message?.includes('Unexpected') || returnRoutes?.message?.includes('Cannot read properties')) {
      setNoRouteFound('No Route Found')
    } else {
      setNoRouteFound('')
    }
    setLoadingPriceLower(false)

    const reserves = await getPoolPairs(newController)
    console.log('reserves', reserves)
  }

  const provider = new Provider(Network.TESTNET)

  useEffect(() => {
    return () => {
      // Cleanup function to abort the fetch request when the component is unmounted
      if (controller) {
        controller.abort()
      }
    }
  }, [controller])
  useEffect(() => {
    getSwapPrice(token1Value)
    setLoadingPrice(true)
    if (connected) {
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`)
        .then((res) => res.json())
        .then((data) => {
          const coinData0 = data?.filter((coin: coinType) => {
            return coin?.type.includes(token0.address)
          })
          const coinData1 = data?.filter((coin: coinType) => {
            return coin?.type.includes(token1.address)
          })
          setFilteredCoin0(coinData0[0])
          setFilteredCoin1(coinData1[0])
          setLoadingPrice(false)
        })
        .finally(() => {
          setLoadingPrice(false)
        })
    } else {
      setLoadingPrice(false)
      setFilteredCoin0(undefined)
      setFilteredCoin1(undefined)
    }
  }, [account, connected, token0, token1, isTransactionPending])

  const swapToken = async (close: () => void) => {
    console.log(swapPerTokenPrice)
    const payload: any = payloadArgs(
      parseInt((token1Value * 10 ** token0.decimals) as unknown as string),
      swapPerTokenPrice,
      parseInt(String(slippageAmount))
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      // sign and submit transaction to chain
      const response: Promise<any> = await signAndSubmitTransaction(payload)
      // wait for transaction
      console.log(response)
      await provider.waitForTransaction(response?.hash)

      //return from here if response is failed
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      toast(
        <>
          <ToastContent
            summary={`Swap ${token1Value} ${token0.symbol} for ${parseFloat(
              (swapPerTokenPrice?.amountOut / 10 ** token1?.decimals).toFixed(9)
            )} ${token1.symbol}`}
            href={`https://explorer.aptoslabs.com/txn/${response?.version}?network=${network?.name?.toLowerCase()}`}
          />
          <ToastButtons onDismiss={() => toast.dismiss(toastId)} />
        </>,
        {
          ...TOAST_OPTIONS,
          toastId,
          theme: theme as Theme,
        }
      )
      setisTransactionPending(false)
      close()
    } catch (error) {
      console.error(error)
      const toastId = `failed:${Math.random()}`
      toast(
        <>
          <ToastContent summary={`User rejected request`} />
          <ToastButtons onDismiss={() => toast.dismiss(toastId)} />
        </>,
        {
          ...TOAST_OPTIONS,
          toastId,
          theme: theme as Theme,
        }
      )
    } finally {
      setisTransactionPending(false)
      if (tradeVal.current) {
        tradeVal.current.value = ''
      }
      console.log(tradeVal?.current?.value)
    }
  }
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

  const swapInput = () => {
    setToken0(token1)
    setToken1(token0)
  }

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
              <TradeInput
                setOpen={setOpen}
                currency={token0}
                setToken={setToken0}
                coinData={filteredCoin0?.data?.coin?.value}
                isLoadingPrice={isLoadingPrice}
                setTokenSelectedNumber={setTokenSelectedNumber}
                tokenNumber={'0'}
                setButtonError={setButtonError}
                setSwapPerTokenPrice={setSwapPerTokenPrice}
                getSwapPrice={getSwapPrice}
                setToken1Value={setToken1Value}
                tradeVal={tradeVal}
              />
              <SwapTrade setInverse={swapInput} />
              <TradeOutput
                setOpen={setOpen}
                currency={token1}
                setToken={setToken1}
                coinData={filteredCoin1?.data?.coin?.value}
                isLoadingPrice={isLoadingPrice}
                setTokenSelectedNumber={setTokenSelectedNumber}
                tokenNumber={'1'}
                outpuSwapTokenAmount={swapPerTokenPrice}
                isLoadingPriceLower={isLoadingPriceLower}
              />

              <SwapButton noRouteFound={noRouteFound} buttonError={buttonError} token1Value={token1Value} />
            </UIWidget.Content>
          </Drawer.Root>
          {/*spacer for fixed positioned swap button */}
        </div>
        <div className="h-[68px] w-full" />
        <TokenListDialog
          open={open}
          setOpen={setOpen}
          tokens={DEFAULT_TOKEN_LIST.tokens}
          handleChangeToken={handleChangeToken}
        />

        <TradeReviewDialog
          swapToken={swapToken}
          value1={token1Value}
          value2={swapPerTokenPrice?.amountOut}
          token0={token0}
          token1={token1}
          isTransactionPending={isTransactionPending}
          slippageAmount={slippageAmount}
        />
      </Container>
    </>
  )
}
