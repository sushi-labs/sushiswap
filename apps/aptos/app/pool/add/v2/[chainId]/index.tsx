import { GetStaticProps, InferGetServerSidePropsType } from 'next'
import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Token } from 'utils/tokenType'
import { Pair } from '@sushiswap/amm'
import DEFAULT_TOKEN_LIST from '../../../../../config/tokenList.json'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { Layout } from 'components/Layout'
import { PairState, PoolFinder } from '@sushiswap/wagmi'
import { Loader } from '@sushiswap/ui'
import { ContentBlock } from 'components/ContentBlock'
import TradeInput from 'components/TradeInput'
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { SwapButton } from 'components/SwapButton'
import { getPoolPairs } from 'utils/utilFunctions'
import { useRouter } from 'next/router'
import { SelectNetworkWidget, SelectTokensWidget } from 'components/NewPositionSection'
import { PoolProvider, usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'
import { title } from 'process'
import { Network, Provider } from 'aptos'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Input } from '@sushiswap/ui/future/components/input'
import { AddLiquidityButton } from 'app/pool/Pool/AddLiquidityButton'
import { AddSectionReviewModal } from 'app/pool/Pool/AddSectionReviewModel'
import { Button } from '@sushiswap/ui/future/components/button'
import { createToast } from 'components/toast'
import { payloadArgs } from 'utils/payloadUtil'

interface coinType {
  type: string
  data: any
}

export function Add() {
  // const router = useRouter()

  const { token0, token1 } = usePoolState()

  const { connected } = useWallet()

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
          <PoolFinder
            components={
              <PoolFinder.Components>
                {/* <PoolFinder.LegacyPool token0={token0} token1={token1} enabled={''} /> */}
              </PoolFinder.Components>
            }
          >
            {({ pool: [poolState, pool] }) => {
              const title =
                !token0 || !token1 ? (
                  'Select Tokens'
                ) : [PairState.LOADING].includes(poolState as PairState) ? (
                  <div className="h-[20px] flex items-center justify-center">
                    <Loader width={14} />
                  </div>
                ) : [PairState.EXISTS].includes(poolState as PairState) ? (
                  'Add Liquidity'
                ) : (
                  'Create Pool'
                )
              return <_Add pool={pool as Pair | null} poolState={poolState as PairState} title={title} />
            }}
          </PoolFinder>
          {/* <_Add title={title} /> */}
        </div>
      </div>
    </Layout>
  )
}

interface AddProps {
  title: ReactNode
  pool: Pair | null
  poolState: PairState
}

const _Add: FC<AddProps> = ({ title }) => {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const [filteredCoin0, setFilteredCoin0] = useState<coinType | undefined>(undefined)
  const [filteredCoin1, setFilteredCoin1] = useState<coinType | undefined>(undefined)
  const [isLoadingPrice, setLoadingPrice] = useState<boolean>(true)
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
  const [error, setError] = useState('')
  const { setisTransactionPending } = usePoolActions()

  const addLiquidity = async (close: () => void) => {
    const provider = new Provider(Network.TESTNET)
    const payload: any = payloadArgs()
    setisTransactionPending(true)
    if (!account) return []
    try {
      const responce: Promise<any> = await signAndSubmitTransaction(payload)
      console.log(responce)
      await provider.waitForTransaction(responce?.hash)
      if (!responce?.success) return
      const toastId = `completed:${response?.hash}`
      // const summery = noLiquidity
      // ? `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
      // : `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`;
      const summery = `Created`
      createToast({
        summery: summery,
        toastId: toastId,
      })
      setisTransactionPending(false)
      close()
    } catch (error) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: `User rejected request`, toastId: toastId })
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

  const { setBalance1, setBalance0, setToken0, setToken1, setAmount0, setAmount1 } = usePoolActions()
  const { token0, token1, balance0, balance1, isTransactionPending, amount0, amount1, isPriceFetching } = usePoolState()
  const tradeVal = useRef<HTMLInputElement>(null)
  const tradeVal1 = useRef<HTMLInputElement>(null)

  // const [parsedInput0, parsedInput1] = useMemo(() => {
  //   return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  // }, [input0, input1, token0, token1])

  // const onChangeToken0TypedAmount = useCallback(
  //   (value: string) => {
  //     if (poolState === PairState.NOT_EXISTS) {
  //       setTypedAmounts((prev) => ({
  //         ...prev,
  //         input0: value,
  //       }))
  //     } else if (token0 && pool) {
  //       const parsedAmount = tryParseAmount(value, token0)
  //       setTypedAmounts({
  //         input0: value,
  //         input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
  //       })
  //     }
  //   },
  //   [pool, poolState, token0]
  // )

  // const onChangeToken1TypedAmount = useCallback(
  //   (value: string) => {
  //     if (poolState === PairState.NOT_EXISTS) {
  //       setTypedAmounts((prev) => ({
  //         ...prev,
  //         input1: value,
  //       }))
  //     } else if (token1 && pool) {
  //       const parsedAmount = tryParseAmount(value, token1)
  //       setTypedAmounts({
  //         input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
  //         input1: value,
  //       })
  //     }
  //   },
  //   [pool, poolState, token1]
  // )

  // useEffect(() => {
  //   if (pool) {
  //     onChangeToken0TypedAmount(input0)
  //   }
  // }, [onChangeToken0TypedAmount])

  // console.log(pool)

  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
  }, [network])

  const getPools = async (tradeVal: number): Promise<any> => {
    if (controller) {
      controller.abort()
      setSwapPerTokenPrice('')
    }

    const newController = new AbortController()
    setController(newController)
    setLoadingPriceLower(true)
    setSwapPerTokenPrice('')
    const reserves = await getPoolPairs(newController)
    setReserves(reserves)
    setLoadingPriceLower(false)
  }
  const provider = new Provider(Network.TESTNET)

  useEffect(() => {
    PoolInputBalance0('')
    PoolInputBalance1('')
  }, [])

  const PoolInputBalance0 = (tradeVal: string) => {
    console.log('1', tradeVal)
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal)) {
      setAmount0(tradeVal)
    }
    if (setButtonError) setButtonError('')
    if (connected) {
      const priceEst = ''
      if (priceEst) {
        setError('Exceeds Balance')
        if (setButtonError) setButtonError('Insufficient Balance')
      } else {
        setError('')
        if (setButtonError) setButtonError('')
      }
    } else {
      setError('')
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
      const priceEst = ''
      if (priceEst) {
        setError('Exceeds Balance')
        if (setButtonError) setButtonError('Insufficient Balance')
      } else {
        setError('')
        if (setButtonError) setButtonError('')
      }
    } else {
      setError('')
    }
  }

  // const balanceClick = () => {
  //   const timeOut = setTimeout(() => {
  //     PoolInputBalance0('')
  //     PoolInputBalance1('')
  //   }, 100)
  //   return () => {
  //     clearTimeout(timeOut)
  //   }
  // }

  useEffect(() => {
    getPools(token1Value)
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
    <div className={`${error && '!bg-red-500/20 !dark:bg-red-900/30'}`} onClick={focusInput}>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <SelectNetworkWidget />
        <SelectTokensWidget />
        <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
          <div className="flex flex-col gap-4">
            <TradeInput
              // coinData={filteredCoin0?.data?.coin?.value}
              // isLoadingPrice={isLoadingPrice}
              // setButtonError={setButtonError}
              // getSwapPrice={getPools}
              // tradeVal={tradeValInput}
              token={token0}
              value={String(amount0)}
              setToken={setToken0}
              balance={balance0}
              error={error}
              isLoadingPrice={isLoadingPrice || isPriceFetching}
              onUserInput={PoolInputBalance0}
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
              // coinData={filteredCoin1?.data?.coin?.value}
              // isLoadingPrice={isLoadingPrice}
              // setButtonError={setButtonError}
              // getSwapPrice={getPools}
              // tradeVal={tradeValOutput}
              token={token1}
              value={String(amount1)}
              setToken={setToken1}
              balance={balance1}
              error={error}
              isLoadingPrice={isLoadingPrice || isPriceFetching}
              onUserInput={PoolInputBalance1}
              tradeVal={tradeVal1}
              setAmount={setAmount1}
              type="INPUT"
            />
            <AddLiquidityButton buttonError="" token1Value={String(amount0)} />
            {/* <SwapButton buttonError={buttonError} token1Value={amount0} /> */}
          </div>
        </ContentBlock>
        <AddSectionReviewModal>
          <Button
            size="xl"
            fullWidth
            onClick={() => {
              addLiquidity(close)
            }}
          >
            Add
          </Button>
        </AddSectionReviewModal>
      </div>
    </div>
  )
}
