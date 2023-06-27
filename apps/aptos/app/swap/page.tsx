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
import { Network, Provider } from 'aptos'

export default function SwapPage() {
  // const token0 = 'APTOS'
  // const token1 = 'SUSHI'
  const { wallet, account, connected, isLoading, connect, wallets, signAndSubmitTransaction } = useWallet()
  const [token0, setToken0] = useState(DEFAULT_TOKEN_LIST.tokens[0])
  const [token1, setToken1] = useState(DEFAULT_TOKEN_LIST.tokens[1])
  const [open, setOpen] = useState<boolean>(false)
  const [inverse, setInverse] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const [buttonMessage, setBttonMessage] = useState<string>('Connect Wallet')
  const [filteredCoin, setFilteredCoin] = useState<object | undefined>({})
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
  // console.log(wallets)
  // return <WidgetTitleV2 />

  const provider = new Provider(Network.TESTNET)

  useEffect(() => {
    setLoadingPrice(true)
    if (connected) {
      setBttonMessage('Enter Amount')
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`)
        .then((res) => res.json())
        .then((data) => {
          const coinData = data.filter((coin: object) => {
            if (!inverse) {
              return coin.type.includes(token0.address)
            }
            return coin.type.includes(token1.address)
          })
          if (coinData.length) {
            setLoadingPrice(false)
          }
          console.log(coinData[0])
          setFilteredCoin(coinData[0])
        })
        .finally(() => {
          setLoadingPrice(false)
        })
    } else {
      setLoadingPrice(false)
      setFilteredCoin({})
    }
  }, [account, inverse, connected])

  const swapToken = async () => {
    if (!account) return []
    const payload = {
      function: '0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::router::swap_exact_input',
      type_arguments: [
        '0xe05d610ddad41a45e61b1327f01fcc0a582eedae00683ef969b85fa892c4b4f::usdt::Tether',
        '0x5728d69f8a1c64b4cdb59f7746fe1a847215716e77c4bc90128c1100da826946::matic::Polygon',
      ],
      arguments: ['10000000000', '0'],
      type: 'entry_function_payload',
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload)
      // wait for transaction
      await provider.waitForTransaction(response.hash)
    } catch (error: any) {
    } finally {
    }
  }

  return (
    <>
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Drawer.Root>
        <button
            onClick={() => {
              swapToken()
            }}
          >
            Test swap
          </button>
          <WidgetTitleV2 />
          <SwitchAppType />
          <div>
            {inverse == false ? (
              <>
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token0.name}
                  imgURL={token0.logoURI}
                  coinData={filteredCoin?.data?.coin?.value}
                  isLoadingPrice={isLoadingPrice}
                />
                <SwapTrade inverse={inverse} setInverse={setInverse} />
                <TradeInput setOpen={setOpen} tokenName={token1.name} imgURL={token1.logoURI} />
              </>
            ) : (
              <>
                <TradeInput
                  setOpen={setOpen}
                  tokenName={token1.name}
                  imgURL={token1.logoURI}
                  coinData={filteredCoin?.data?.coin?.value}
                  isLoadingPrice={isLoadingPrice}
                />
                <SwapTrade inverse={inverse} setInverse={setInverse} />
                <TradeInput setOpen={setOpen} tokenName={token0.name} imgURL={token0.logoURI} />
              </>
            )}
            <div className="pt-4">
              <button
                onClick={() => {
                  !connected && connect(wallets[0].name)
                }}
                className="btn w-full font-medium flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <>Loading...</> : buttonMessage}
              </button>
            </div>
            {/* <ThunderCoreBanner /> */}
          </div>
        </Drawer.Root>
        {/*spacer for fixed positioned swap button */}
      </Container>
      <div className="h-[68px] w-full" />
      <TokenListDialog open={open} setOpen={setOpen} tokens={DEFAULT_TOKEN_LIST} />
    </>
  )
}
