import React, { useEffect, useState } from 'react'
import { ContentBlock } from './ContentBlock'
import TradeInput from './TradeInput'
import { Token } from 'utils/tokenType'
import DEFAULT_TOKEN_LIST from './../config/tokenList.json'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import SwapTrade from './SwapTrade'
import TradeOutput from './TradeOutput'
import { SwapButton } from './SwapButton'
import { Network, Provider } from 'aptos'
import { getYTokenPrice } from 'utils/utilFunctions'
import TokenListDialog from './TokenListDialog'
import { PlusIcon } from '@heroicons/react/20/solid'

interface coinType {
  type: string
  data: any
}

export const PoolPageV3 = () => {
  const { account, connected, disconnect, network, signAndSubmitTransaction } = useWallet()
  const [open, setOpen] = useState<boolean>(false)
  const [inverse, setInverse] = useState<boolean>(false)
  const [tokenSelectedNumber, setTokenSelectedNumber] = useState<string>('')
  const [token0, setToken0] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[0])
  const [token1, setToken1] = useState<Token>(DEFAULT_TOKEN_LIST.tokens[1])
  const [filteredCoin0, setFilteredCoin0] = useState<coinType | undefined>(undefined)
  const [filteredCoin1, setFilteredCoin1] = useState<coinType | undefined>(undefined)
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
  const [buttonError, setButtonError] = useState<string>('')
  const [swapPerTokenPrice, setSwapPerTokenPrice] = useState<any>()
  const [token1Value, setToken1Value] = useState<number>(0)
  const [controller, setController] = useState<AbortController | null>(null)
  const [isTransactionPending, setisTransactionPending] = useState(false)
  const [isLoadingPriceLower, setLoadingPriceLower] = useState<boolean>(true)
  const [noRouteFound, setNoRouteFound] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)

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
    const output: any = !inverse
      ? await getYTokenPrice(
          parseInt((tradeVal * 10 ** token0?.decimals) as unknown as string),
          token0?.address,
          token1?.address,
          newController
        )
      : await getYTokenPrice(
          parseInt((tradeVal * 10 ** token1?.decimals) as unknown as string),
          token1?.address,
          token0?.address,
          newController
        )
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
    setisTransactionPending(true)
    if (!account) return []
    const payload = {
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::swap_exact_input`,
      type_arguments: !inverse ? [token0?.address, token1?.address] : [token1?.address, token0?.address],
      arguments: [parseInt((token1Value * 10 ** token0.decimals) as unknown as string), '0'],
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
    <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
      <div className="flex flex-col gap-4">
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
        <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
          <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
            <PlusIcon strokeWidth={3} className="w-4 h-4 dark:text-slate-400 text-slate-600" />
          </button>
        </div>
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
      </div>
      <SwapButton
        noRouteFound={noRouteFound}
        buttonError={buttonError}
        token1Value={token1Value}
        swapToken={swapToken}
      />
      <div className='h-[68px] w-full"'>
        <TokenListDialog
          open={open}
          selected={[token0, token1]}
          setOpen={setOpen}
          tokens={DEFAULT_TOKEN_LIST}
          handleChangeToken={handleChangeToken}
        />
      </div>
    </ContentBlock>
  )
}
