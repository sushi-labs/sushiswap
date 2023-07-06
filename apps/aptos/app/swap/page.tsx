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
import React, { useEffect, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import WalletSelector from './../../components/WalletSelector'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { getYTokenPrice, useAllCommonPairs } from 'utils/utilFunctions'
import { Network, Provider } from 'aptos'
import { Token } from 'utils/tokenType'
import Container from '@sushiswap/ui/future/components/Container'
import Loading from 'app/loading'
import TradeOutput from 'components/TradeOutput'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { payloadArgs } from 'utils/payloadUtil'

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
  const [inverse, setInverse] = useState<boolean>(false)
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
    console.log('tradeVal', tradeVal)
    const output = inverse
      ? await useAllCommonPairs(tradeVal * 10 ** 8, token1, token0, newController)
      : await useAllCommonPairs(tradeVal * 10 ** 8, token0, token1, newController)
    // const output: any = !inverse
    //   ? await getYTokenPrice(
    //       parseInt((tradeVal * 10 ** token0?.decimals) as unknown as string),
    //       token0?.address,
    //       token1?.address,
    //       newController
    //     )
    //   : await getYTokenPrice(
    //       parseInt((tradeVal * 10 ** token1?.decimals) as unknown as string),
    //       token1?.address,
    //       token0?.address,
    //       newController
    //     )
    setSwapPerTokenPrice(output)
    if (output?.message?.includes('Unexpected') || output?.message?.includes('Cannot read properties')) {
      setNoRouteFound('No Route Found')
    } else {
      setNoRouteFound('')
    }
    setLoadingPriceLower(false)
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
  }, [account, inverse, connected, token0, token1, isTransactionPending])

  const swapToken = async () => {
    console.log(swapPerTokenPrice)
    const payload: any = payloadArgs(
      parseInt((token1Value * 10 ** token0.decimals) as unknown as string),
      swapPerTokenPrice
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      // sign and submit transaction to chain
      if (payload) {
        const response = await signAndSubmitTransaction(payload)
        // wait for transaction
        await provider.waitForTransaction(response.hash)
        setisTransactionPending(false)
      }
    } catch (error: any) {
    } finally {
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
                tokenName={!inverse ? token0.name : token1.name}
                decimals={!inverse ? token0.decimals : token1.decimals}
                imgURL={!inverse ? token0.logoURI : token1.logoURI}
                coinData={!inverse ? filteredCoin0?.data?.coin?.value : filteredCoin1?.data?.coin?.value}
                isLoadingPrice={isLoadingPrice}
                setTokenSelectedNumber={setTokenSelectedNumber}
                tokenNumber={!inverse ? '0' : '1'}
                setButtonError={setButtonError}
                setSwapPerTokenPrice={setSwapPerTokenPrice}
                getSwapPrice={getSwapPrice}
                setToken1Value={setToken1Value}
              />
              <SwapTrade inverse={inverse} setInverse={setInverse} />
              <TradeOutput
                setOpen={setOpen}
                tokenName={!inverse ? token1.name : token0.name}
                decimals={!inverse ? token1.decimals : token0.decimals}
                imgURL={!inverse ? token1.logoURI : token0.logoURI}
                coinData={!inverse ? filteredCoin1?.data?.coin?.value : filteredCoin0?.data?.coin?.value}
                isLoadingPrice={isLoadingPrice}
                setTokenSelectedNumber={setTokenSelectedNumber}
                tokenNumber={!inverse ? '1' : '0'}
                outpuSwapTokenAmount={swapPerTokenPrice}
                isLoadingPriceLower={isLoadingPriceLower}
              />

              <SwapButton
                noRouteFound={noRouteFound}
                buttonError={buttonError}
                token1Value={token1Value}
                swapToken={swapToken}
              />
            </UIWidget.Content>
          </Drawer.Root>
          {/*spacer for fixed positioned swap button */}
        </div>
        <div className="h-[68px] w-full" />
        <TokenListDialog
          open={open}
          selected={[token0, token1]}
          setOpen={setOpen}
          tokens={DEFAULT_TOKEN_LIST}
          handleChangeToken={handleChangeToken}
        />
      </Container>
    </>
  )
}
