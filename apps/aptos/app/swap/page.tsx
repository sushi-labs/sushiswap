'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import { Dialog, Transition } from '@headlessui/react'
import { Drawer } from '@sushiswap/ui'
import SwapTrade from 'components/SwapTrade'
import DEFAULT_TOKEN_LIST from './../../config/tokenList.json'
import TokenListDialog from 'components/TokenListDialog'
import TradeInput from 'components/TradeInput'
import React, { useEffect, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import { getYTokenPrice } from 'utils/utilFunctions'

import { Network, Provider } from 'aptos'
import { Token } from 'utils/tokenType'
interface coinType {
  type: string
  data: any
}

export default function SwapPage() {
  const { wallet, account, connected, isLoading, connect, wallets, signAndSubmitTransaction } = useWallet()
  const [token0, setToken0] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[0])
  const [token1, setToken1] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[1])
  const [buttonError, setButtonError] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [inverse, setInverse] = useState<boolean>(false)
  const [filteredCoin0, setFilteredCoin0] = useState<coinType | undefined>(undefined)
  const [filteredCoin1, setFilteredCoin1] = useState<coinType | undefined>(undefined)
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
  const [tokenSelectedNumber, setTokenSelectedNumber] = useState<string>('')
  const [token1Value, setToken1Value] = useState<number>(0)
  const [swapPerTokenPrice, setSwapPerTokenPrice] = useState<any>()
  const [isTransactionPending, setisTransactionPending] = useState(false)
  const [noRouteFound, setNoRouteFound] = useState<string>('')

  const handleChangeToken = (token: Token) => {
    setOpen(false)
    if (tokenSelectedNumber == '0') {
      setToken0(token)
    } else {
      setToken1(token)
    }
  }
  const getSwapPrice = async (tradeVal: number): Promise<any> => {
    setSwapPerTokenPrice(0)
    const output: any = !inverse
      ? await getYTokenPrice(tradeVal * 10 ** 8, token0?.address, token1?.address)
      : await getYTokenPrice(tradeVal * 10 ** 8, token1?.address, token0?.address)
    setSwapPerTokenPrice(output)
    if (output?.message?.includes('Unexpected') || output?.message?.includes('Cannot read properties')) {
      setNoRouteFound('No Route Found')
    } else {
      setNoRouteFound('')
    }
  }

  const provider = new Provider(Network.TESTNET)

  useEffect(() => {
    getSwapPrice(token1Value)
    setLoadingPrice(true)
    if (connected) {
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`)
        .then((res) => res.json())
        .then((data) => {
          const coinData0 = data.filter((coin: coinType) => {
            return coin?.type.includes(token0.address)
          })
          const coinData1 = data.filter((coin: coinType) => {
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
    setisTransactionPending(true)
    if (!account) return []
    const payload = {
      function: '0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::router::swap_exact_input',
      type_arguments: !inverse ? [token0?.address, token1?.address] : [token1?.address, token0?.address],
      arguments: [token1Value * 10 ** 8, '0'],
      type: 'entry_function_payload',
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload)
      // wait for transaction
      await provider.waitForTransaction(response.hash)
      setisTransactionPending(false)
    } catch (error: any) {
    } finally {
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 swap-container">
        <Drawer.Root>
          <WidgetTitleV2 />
          <SwitchAppType />
          <div className="relative">
            {inverse == false ? (
              <>
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token0.name}
                  decimals={token0.decimals}
                  imgURL={token0.logoURI}
                  coinData={filteredCoin0?.data?.coin?.value}
                  isLoadingPrice={isLoadingPrice}
                  setTokenSelectedNumber={setTokenSelectedNumber}
                  tokenNumber="0"
                  setButtonError={setButtonError}
                  getSwapPrice={getSwapPrice}
                  setToken1Value={setToken1Value}
                />
                <SwapTrade inverse={inverse} setInverse={setInverse} />
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token1.name}
                  decimals={token1.decimals}
                  coinData={filteredCoin1?.data?.coin?.value}
                  imgURL={token1.logoURI}
                  isLoadingPrice={isLoadingPrice}
                  setTokenSelectedNumber={setTokenSelectedNumber}
                  tokenNumber="1"
                  getSwapPrice={getSwapPrice}
                  disabledInput={true}
                  outpuSwapTokenAmount={swapPerTokenPrice}
                />
              </>
            ) : (
              <>
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token1.name}
                  decimals={token1.decimals}
                  imgURL={token1.logoURI}
                  coinData={filteredCoin1?.data?.coin?.value}
                  isLoadingPrice={isLoadingPrice}
                  setTokenSelectedNumber={setTokenSelectedNumber}
                  tokenNumber="1"
                  getSwapPrice={getSwapPrice}
                  setButtonError={setButtonError}
                  setToken1Value={setToken1Value}
                />
                <SwapTrade inverse={inverse} setInverse={setInverse} />
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token0.name}
                  decimals={token0.decimals}
                  coinData={filteredCoin0?.data?.coin?.value}
                  imgURL={token0.logoURI}
                  isLoadingPrice={isLoadingPrice}
                  setTokenSelectedNumber={setTokenSelectedNumber}
                  tokenNumber="0"
                  getSwapPrice={getSwapPrice}
                  disabledInput={true}
                  outpuSwapTokenAmount={swapPerTokenPrice}
                />
              </>
            )}
            <div className="pt-4">
              {connected ? (
                <button
                  className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                    buttonError || noRouteFound ? 'pointer-events-none relative opacity-[0.4] overflow-hidden' : ''
                  }`}
                  disabled={buttonError || noRouteFound ? true : false}
                  onClick={() => {
                    token1Value ? swapToken() : {}
                  }}
                >
                  {noRouteFound ? (
                    noRouteFound
                  ) : buttonError ? (
                    buttonError
                  ) : token1Value ? (
                    <>Swap</>
                  ) : (
                    <>Enter Amount</>
                  )}
                </button>
              ) : (
                <WalletSelector />
              )}
            </div>
            {/* <ThunderCoreBanner /> */}
          </div>
        </Drawer.Root>
        {/*spacer for fixed positioned swap button */}
      </div>
      <div className="h-[68px] w-full" />
      <TokenListDialog
        open={open}
        setOpen={setOpen}
        tokens={DEFAULT_TOKEN_LIST}
        handleChangeToken={handleChangeToken}
      />
    </>
  )
}
