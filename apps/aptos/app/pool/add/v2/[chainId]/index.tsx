import { FC, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { Layout } from 'components/Layout'
import { ContentBlock } from 'components/ContentBlock'
import TradeInput from 'components/TradeInput'
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { getPoolPairs } from 'utils/utilFunctions'
import { SelectNetworkWidget, SelectTokensWidget } from 'components/NewPositionSection'
import { usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'
import { Network, Provider } from 'aptos'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AddLiquidityButton } from 'app/pool/Pool/AddLiquidityButton'
import { AddSectionReviewModal } from 'app/pool/Pool/AddSectionReviewModel'
import { Button } from '@sushiswap/ui/future/components/button'
import { createToast } from 'components/toast'
import { liquidityArgs } from 'utils/liquidityPayload'
import { useTokens } from 'utils/useTokens'

interface coinType {
  type: string
  data: any
}

export function Add() {
  // const router = useRouter()

  const { token0, token1, pairs, pairFound, poolPairRatio } = usePoolState()
  const { setPairs, setPairFound } = usePoolActions()

  const { connected } = useWallet()

  getPoolPairs()
  console.log(pairs)
  console.log(poolPairRatio)

  return (
    <Layout className="flex justify-center">
      <div className="flex flex-col gap-2">
        <Link className="flex items-center gap-4 mb-2 group" href="/" shallow={true}>
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
            Go back to pools list
          </span>
        </Link>
        <h1 className="mt-2 text-3xl font-medium">Add Liquidity</h1>
        <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
          Create a new pool or create a liquidity position on an existing pool.
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
        <div className="hidden md:block">
          <_Add />
        </div>
      </div>
    </Layout>
  )
}

const _Add: FC = () => {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const [filteredCoin0, setFilteredCoin0] = useState<coinType | undefined>(undefined)
  const [filteredCoin1, setFilteredCoin1] = useState<coinType | undefined>(undefined)
  const [buttonError, setButtonError] = useState<string>('')
  const [token1Value, setToken1Value] = useState<number>(0)
  const tradeValInput = useRef<HTMLInputElement>(null)
  const tradeValOutput = useRef<HTMLInputElement>(null)
  const [controller, setController] = useState<AbortController | null>(null)
  const [swapPerTokenPrice, setSwapPerTokenPrice] = useState<any>()
  const [isLoadingPriceLower, setLoadingPriceLower] = useState<boolean>(true)
  const [reserves, setReserves] = useState<any>()
  const [noRouteFound, setNoRouteFound] = useState<string>('')
  const { network, disconnect, account, signAndSubmitTransaction } = useWallet()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error0, setError0] = useState('')
  const [error1, setError1] = useState('')
  type payloadType = {
    type: string
    type_arguments: string[]
    arguments: string[]
    function: string
  }

  const addLiquidity = async (close: () => void) => {
    const provider = new Provider(Network.TESTNET)
    const payload: payloadType = liquidityArgs(
      token0.address,
      token1.address,
      String(parseInt(String(Number(amount0) * 10 ** token0.decimals))),
      String(parseInt(String(Number(amount1) * 10 ** token1.decimals)))
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      const response: Promise<any> = await signAndSubmitTransaction(payload)
      console.log(response)
      await provider.waitForTransaction(response?.hash)
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      // const summery = noLiquidity
      // ? `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
      // : `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`;
      const summery = pairs
        ? `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`
        : `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
      createToast({
        summery: summery,
        toastId: toastId,
      })
      setisTransactionPending(false)
      close()
      setAmount0('')
      setAmount1('')
    } catch (error) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: `User rejected request`, toastId: toastId })
      close()
    } finally {
      setisTransactionPending(false)
    }
  }
  const focusInput = useCallback(() => {
    // tradeVal.current?.focus()
  }, [])

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const { connected } = useWallet()
  const { tokens } = useTokens()

  const {
    setBalance1,
    setBalance0,
    setToken0,
    setToken1,
    setAmount0,
    setAmount1,
    setPairFound,
    setLoadingPrice,
    setPairs,
    setNotPairFound,
    setPriceFetching,
    setisTransactionPending,
  } = usePoolActions()
  const {
    token0,
    token1,
    balance0,
    balance1,
    isTransactionPending,
    isLoadingPrice,
    amount0,
    amount1,
    isPriceFetching,
    pairFound,
    poolPairRatio,
    pairs,
  } = usePoolState()
  const tradeVal = useRef<HTMLInputElement>(null)
  const tradeVal1 = useRef<HTMLInputElement>(null)

  const onChangeToken0TypedAmount = (value: string) => {
    PoolInputBalance0(value)
    setAmount0(value)
    console.log(pairs)
    console.log(value, '---', pairs?.data?.reserve_x, pairs?.data?.reserve_y)
    if (pairs?.data) {
      if (value) {
        const reserve_x = pairs?.data?.reserve_x
        const reserve_y = pairs?.data?.reserve_y
        setAmount1(String(parseFloat(String(value)) * poolPairRatio))
        console.log(String(parseFloat(String(value)) * (reserve_y / reserve_x)))
        console.log(pairs)
      } else {
        setAmount1('')
      }
    }
  }

  const onChangeToken1TypedAmount = (value: string) => {
    PoolInputBalance1(value)
    setAmount1(value)
    console.log(pairs)
    console.log(value, '---', pairs?.data?.reserve_x, pairs?.data?.reserve_y)
    if (pairs?.data) {
      if (value) {
        const reserve_x = pairs?.data?.reserve_x
        const reserve_y = pairs?.data?.reserve_y
        setAmount0(String(parseFloat(String(value)) / poolPairRatio))
        console.log(String(parseFloat(String(value)) * (reserve_x / reserve_y)))
        console.log(pairs)
      } else {
        setAmount0('')
      }
    }
  }

  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
    setToken0(tokens[0])
    setToken1(tokens[1])
  }, [network])

  // const getPools = async (tradeVal: number): Promise<any> => {
  //   if (controller) {
  //     controller.abort()
  //     setSwapPerTokenPrice('')
  //   }

  //   const newController = new AbortController()
  //   setController(newController)
  //   setLoadingPriceLower(true)
  //   setSwapPerTokenPrice('')
  //   setPriceFetching(false)
  //   // const reserves = await getPoolPairs(newController)
  //   //
  //   setLoadingPriceLower(false)
  //   // const pairs: any = await getPoolPairs()
  //   // if (pairs?.pair) {
  //   //   setPairFound(pairs?.pair)
  //   // }
  //   // if (pairs?.message?.includes('Unexpected') || pairs?.message?.includes('Cannot read properties')) {
  //   //   setNotPairFound(true)
  //   // } else {
  //   //   setNotPairFound(false)
  //   // }
  //   // setPriceFetching(false)
  // }
  const provider = new Provider(Network.TESTNET)

  // useEffect(() => {
  //   onChangeToken0TypedAmount(String(amount0))
  // }, [account, connected, network, token0, isTransactionPending, balance0, poolPairRatio])

  useEffect(() => {
    onChangeToken0TypedAmount(String(amount0))
  }, [account, connected, network, token0, isTransactionPending, balance0, poolPairRatio])

  // useEffect(() => {
  //   onChangeToken1TypedAmount(String(amount1))
  // }, [account, connected, network, token1, isTransactionPending, balance1, poolPairRatio])

  useEffect(() => {
    PoolInputBalance0(String(amount0))
  }, [account, connected, network, token0, balance0, poolPairRatio, amount0])
  useEffect(() => {
    PoolInputBalance1(String(amount1))
  }, [account, connected, network, token1, balance1, poolPairRatio, amount1])

  const PoolInputBalance0 = (tradeVal: string) => {
    console.log('-==================', tradeVal)
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal)) {
      setAmount0(tradeVal)
    }
    if (setButtonError) setButtonError('')
    console.log(balance0 / 10 ** token0.decimals < parseFloat(tradeVal))
    if (connected) {
      const priceEst = balance0 / 10 ** token0.decimals < parseFloat(tradeVal)
      if (priceEst) {
        setError0('Exceeds Balance')
        if (setButtonError) setButtonError('Insufficient Balance')
      } else {
        setError0('')
        if (setButtonError) setButtonError('')
      }
    } else {
      setError0('')
    }
  }

  const PoolInputBalance1 = (tradeVal1: string) => {
    console.log(tradeVal1)
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal1)) {
      setAmount1(tradeVal1)
    }
    if (setButtonError) setButtonError('')
    if (connected) {
      const priceEst = balance1 / 10 ** token1.decimals < parseFloat(tradeVal1)
      if (priceEst) {
        setError1('Exceeds Balance')
        if (setButtonError) setButtonError('Insufficient Balance')
      } else {
        setError1('')
        if (setButtonError) setButtonError('')
      }
    } else {
      setError1('')
    }
  }

  useEffect(() => {
    setLoadingPrice(true)
    if (connected) {
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error_code) {
            const coinData0 = data?.filter((coin: coinType) => {
              return coin?.type.includes(token0.address)
            })
            const coinData1 = data?.filter((coin: coinType) => {
              return coin?.type.includes(token1.address)
            })
            console.log(coinData0[0]?.data?.coin?.value)
            setBalance0(coinData0[0]?.data?.coin?.value)
            setBalance1(coinData1[0]?.data?.coin?.value)
            setLoadingPrice(false)
          }
        })
      setLoadingPrice(false)
    } else {
      setLoadingPrice(false)
    }
  }, [account, connected, network, token0, token1, isTransactionPending])

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
    <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
      <SelectNetworkWidget />
      <SelectTokensWidget />
      <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
        <div className="flex flex-col gap-4">
          <TradeInput
            id={`liquidity-from`}
            token={token0}
            value={String(amount0)}
            setToken={setToken0}
            balance={balance0}
            error={error0}
            isLoadingPrice={isLoadingPrice || isPriceFetching}
            onUserInput={onChangeToken0TypedAmount}
            tradeVal={tradeVal}
            setAmount={setAmount0}
            type="INPUT"
          />
          <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
            <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
              <PlusIcon strokeWidth={3} className="w-4 h-4 dark:text-slate-400 text-slate-600" />
            </button>
          </div>
          <TradeInput
            id={`liquidity-to`}
            token={token1}
            value={String(amount1)}
            setToken={setToken1}
            balance={balance1}
            error={error1}
            isLoadingPrice={isLoadingPrice || isPriceFetching}
            onUserInput={onChangeToken1TypedAmount}
            tradeVal={tradeVal1}
            setAmount={setAmount1}
            type="INPUT"
          />
          <AddLiquidityButton buttonError={error0 || error1 || buttonError} token1Value={String(amount0)} />
        </div>
      </ContentBlock>
      <AddSectionReviewModal>
        {({ close }) => (
          <Button
            size="xl"
            fullWidth
            onClick={() => {
              addLiquidity(close)
            }}
          >
            Add
          </Button>
        )}
      </AddSectionReviewModal>
    </div>
  )
}
