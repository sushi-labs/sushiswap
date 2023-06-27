'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
// import { Dialog, Transition } from '@headlessui/react'
import { Drawer } from '@sushiswap/ui'
import Container from '@sushiswap/ui/future/components/Container'
import SwapTrade from 'components/SwapTrade'
import DEFAULT_TOKEN_LIST from './../../config/tokenList.json'
import TokenListDialog from 'components/TokenListDialog'
import TradeInput from 'components/TradeInput'
import React, { useEffect, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import { getYTokenPrice } from 'utils/utilFunctions'

type Token = {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}

export default function SwapPage() {
  // const token0 = 'APTOS'
  // const token1 = 'SUSHI'
  const { wallet, account, connected, isLoading, connect, wallets } = useWallet()
  const [token0, setToken0] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[0])
  const [token1, setToken1] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[1])
  const [open, setOpen] = useState<boolean>(false)
  const [inverse, setInverse] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const [buttonMessage, setBttonMessage] = useState<string>('Connect Wallet')
  const [filteredCoin0, setFilteredCoin0] = useState<object | undefined>({})
  const [filteredCoin1, setFilteredCoin1] = useState<object | undefined>({})
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
  const [tokenSelectedNumber, setTokenSelectedNumber] = useState<string>('')
  // return <WidgetTitleV2 />
  const handleChangeToken = (token: Token) => {
    console.log(token)
    setOpen(false)
    if (tokenSelectedNumber == '0') {
      setToken0(token)
    } else {
      setToken1(token)
    }
  }
  useEffect(() => {
    getYTokenPrice(100000000, token0?.address, token1?.address)
    setLoadingPrice(true)
    if (connected) {
      setBttonMessage('Enter Amount')
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`)
        .then((res) => res.json())
        .then((data) => {
          const coinData0 = data.filter((coin: object) => {
            return coin.type.includes(token0.address)
          })
          const coinData1 = data.filter((coin: object) => {
            return coin.type.includes(token1.address)
          })
          // console.log(coinData0[0])
          // console.log(coinData1[0])
          setFilteredCoin0(coinData0[0])
          setFilteredCoin1(coinData1[0])
          setLoadingPrice(false)
        })
        .finally(() => {
          setLoadingPrice(false)
        })
    } else {
      setLoadingPrice(false)
      setFilteredCoin0({})
      setFilteredCoin1({})
    }
  }, [account, inverse, connected, token0, token1])

  return (
    <>
      <div className="flex flex-col gap-4 swap-container">
        <Drawer.Root>
          <WidgetTitleV2 />
          <SwitchAppType />
          <div>
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
                />
              </>
            )}
            <div className="pt-4">
              {connected ? (
                <button
                  className="btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold"
                  disabled={isLoading}
                >
                  {'Enter Amount'}
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
