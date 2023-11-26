import { FC, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { Layout } from 'components/Layout'
import { ContentBlock } from 'components/ContentBlock'
import TradeInput from 'components/TradeInput'
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { usePoolPairs } from 'utils/utilFunctions'
import { usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'
import { Provider } from 'aptos'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AddLiquidityButton } from 'app/pool/Pool/AddLiquidityButton'
import { AddSectionReviewModal } from 'app/pool/Pool/AddSectionReviewModel'
import { Button } from '@sushiswap/ui/future/components/button'
import { createToast } from 'components/toast'
import { liquidityArgs } from 'utils/liquidityPayload'
import { useTokenBalance } from 'utils/useTokenBalance'
import Loading from 'app/loading'
import { useAccount } from 'utils/useAccount'
import { useSearchParams } from 'next/navigation'
import getTokenFromAddress from 'utils/getTokenFromAddress'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { useNetwork } from 'utils/useNetwork'
import { networkNameToNetwork } from 'config/chains'
import { useSlippageTolerance } from '@sushiswap/hooks'

export function Add() {
  // const router = useRouter()
  const { isLoadingAccount } = useAccount()
  usePoolPairs()

  return (
    <>
      {isLoadingAccount && <Loading />}
      <Layout className="flex justify-center">
        <div className="flex flex-col gap-2">
          <Link className="flex items-center gap-4 mb-2 group" href="/pool" shallow={true}>
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
          <div className="flex items-center justify-between">
            <h1 className="mt-2 text-3xl font-medium">Add Liquidity</h1>
            <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
          <div>
            <_Add />
          </div>
        </div>
      </Layout>
    </>
  )
}

const _Add: FC = () => {
  const {
    setToken0,
    setToken1,
    setAmount0,
    setAmount1,
    setisTransactionPending,
    setSlippageAmount0,
    setSlippageAmount1,
  } = usePoolActions()
  const { token0, token1, amount0, amount1, isPriceFetching, poolPairRatio, pairs, slippageAmount0, slippageAmount1 } =
    usePoolState()
  const { account, signAndSubmitTransaction, connected } = useWallet()
  const [error0, setError0] = useState('')
  const [error1, setError1] = useState('')

  const [slippageAmount] = useSlippageTolerance()

  type payloadType = {
    type: string
    type_arguments: string[]
    arguments: number[]
    function: string
  }

  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()

  const addLiquidity = async (close: () => void) => {
    const provider = new Provider(networkNameToNetwork(network))
    const payload: payloadType = liquidityArgs(
      swapContract,
      token0.address,
      token1.address,
      parseInt(String(Number(amount0) * 10 ** token0.decimals)),
      parseInt(String(Number(amount1) * 10 ** token1.decimals)),
      parseInt(String(slippageAmount0)),
      parseInt(String(slippageAmount1))
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      const response: any = await signAndSubmitTransaction(payload)
      await provider.waitForTransaction(response?.hash)
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
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
      createToast({ summery: 'User rejected request', toastId: toastId })
    } finally {
      setisTransactionPending(false)
    }
  }

  const { data: balance0, isLoading: isLoadingBalance0 } = useTokenBalance({
    account: account?.address as string,
    currency: token0.address,
  })
  const { data: balance1, isLoading: isLoadingBalance1 } = useTokenBalance({
    account: account?.address as string,
    currency: token1.address,
  })

  const tradeVal = useRef<HTMLInputElement>(null)
  const tradeVal1 = useRef<HTMLInputElement>(null)
  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      PoolInputBalance0(value)
      setAmount0(value)
      if (pairs?.data) {
        if (value) {
          const decimalDiff = token0.decimals - token1.decimals

          setAmount1(
            String(parseFloat((parseFloat(value) * poolPairRatio * 10 ** decimalDiff).toFixed(token1.decimals)))
          )
        } else {
          setAmount1('')
        }
      }
    },
    [poolPairRatio, balance0, token0, token1]
  )

  const searchParams = useSearchParams()
  const token0Address = searchParams.get('token0')
  const token1Address = searchParams.get('token1')

  useEffect(() => {
    const _token0 = getTokenFromAddress({ address: token0Address, network })
    const _token1 = getTokenFromAddress({ address: token1Address, network })
    if (_token0) setToken0(_token0)
    if (_token1) setToken1(_token1)
  }, [])

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      PoolInputBalance1(value)
      setAmount1(value)
      if (pairs?.data) {
        if (value) {
          const decimalDiff = token1.decimals - token0.decimals

          setAmount0(
            String(parseFloat(((parseFloat(value) / poolPairRatio) * 10 ** decimalDiff).toFixed(token0.decimals)))
          )
        } else {
          setAmount0('')
        }
      }
    },
    [poolPairRatio, balance1]
  )

  useEffect(() => {
    onChangeToken0TypedAmount(String(amount0))
  }, [account, connected, network, token0, token1, balance0, poolPairRatio])

  useEffect(() => {
    PoolInputBalance1(String(amount1))
    PoolInputBalance0(String(amount0))
  }, [amount1, token1, balance1])

  useEffect(() => {
    setSlippageAmount0(amount0 ? Number(amount0) * 10 ** token0.decimals : 0)
    setSlippageAmount1(amount1 ? Number(amount1) * 10 ** token1.decimals : 0)
  }, [amount0, amount1, slippageAmount])

  const PoolInputBalance0 = (tradeVal: string) => {
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal)) {
      setAmount0(tradeVal)
    }
    if (connected && typeof balance0 === 'number') {
      const priceEst = balance0 / 10 ** token0.decimals < parseFloat(tradeVal)
      if (priceEst) {
        setError0('Exceeds Balance')
      } else {
        setError0('')
      }
    }
  }

  const PoolInputBalance1 = (tradeVal1: string) => {
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal1)) {
      setAmount1(tradeVal1)
    }
    if (connected && typeof balance1 === 'number') {
      const priceEst = balance1 / 10 ** token1.decimals < parseFloat(tradeVal1)
      if (priceEst) {
        setError1('Exceeds Balance')
      } else {
        setError1('')
      }
    }
  }

  const swapTokenIfAlreadySelected = () => {
    setToken0(token1)
    setToken1(token0)
  }

  return (
    <>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
          <div className="flex flex-col gap-4">
            <TradeInput
              id={'liquidity-from'}
              token={token0}
              alteredSelected={token1}
              value={String(amount0)}
              setToken={setToken0}
              balance={balance0}
              error={error0}
              isLoadingPrice={isLoadingBalance0 || isPriceFetching}
              onUserInput={onChangeToken0TypedAmount}
              tradeVal={tradeVal}
              setAmount={setAmount0}
              type="INPUT"
              handleSwap={swapTokenIfAlreadySelected}
            />
            <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
              <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
                <PlusIcon strokeWidth={3} className="w-4 h-4 dark:text-slate-400 text-slate-600" />
              </button>
            </div>
            <TradeInput
              alteredSelected={token0}
              id={'liquidity-to'}
              token={token1}
              value={String(amount1)}
              setToken={setToken1}
              balance={balance1}
              error={error1}
              isLoadingPrice={isLoadingBalance1 || isPriceFetching}
              onUserInput={onChangeToken1TypedAmount}
              tradeVal={tradeVal1}
              setAmount={setAmount1}
              type="INPUT"
              handleSwap={swapTokenIfAlreadySelected}
            />
            <AddLiquidityButton buttonError={error0 || error1} token1Value={String(amount0)} />
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
    </>
  )
}
