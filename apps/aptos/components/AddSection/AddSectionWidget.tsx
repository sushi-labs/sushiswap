import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { CogIcon } from '@heroicons/react/24/outline'
import {
  IconButton,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import {
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui/components/settings'
import { Widget, WidgetHeader } from '@sushiswap/ui/components/widget'
import { Provider } from 'aptos'
import { AddLiquidityButton } from 'components/Pool/AddLiquidityButton'
import { TradeInput } from 'components/TradeInput'
import { createToast } from 'components/toast'
import { networkNameToNetwork } from 'config/chains'
import { useParams } from 'next/navigation'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { liquidityArgs } from 'utils/liquidityPayload'
import { useNetwork } from 'utils/useNetwork'
import { useTokenBalance } from 'utils/useTokenBalance'
import { usePool } from '../../utils/usePool'
import { Pool } from '../../utils/usePools'
import { useTokensFromPools } from '../../utils/useTokensFromPool'
import { usePoolPairs } from '../../utils/utilFunctions'
import { AddSectionReviewModal } from '../Pool/AddSectionReviewModel'
import { usePoolActions, usePoolState } from '../Pool/PoolProvider'

type payloadType = {
  type: string
  type_arguments: string[]
  arguments: number[]
  function: string
}

export const AddSectionWidget: FC = () => {
  usePoolPairs()

  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)
  const { data: pool } = usePool(tokenAddress)

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const {
    setToken0,
    setToken1,
    setAmount0,
    setAmount1,
    setisTransactionPending,
    setSlippageAmount0,
    setSlippageAmount1,
  } = usePoolActions()

  const {
    token0: token0State,
    token1: token1State,
    amount0,
    amount1,
    isPriceFetching,
    poolPairRatio,
    poolReserves,
    slippageAmount0,
    slippageAmount1,
  } = usePoolState()

  useEffect(() => {
    if (token0State.address !== token0.address) {
      setToken0(token0)
    }
    if (token1State.address !== token1.address) {
      setToken1(token1)
    }
  }, [token0, token1, setToken0, setToken1])

  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()

  const { account, signAndSubmitTransaction, connected } = useWallet()
  const [error0, setError0] = useState('')
  const [error1, setError1] = useState('')

  const addLiquidity = useCallback(
    async (close: () => void) => {
      const provider = new Provider(networkNameToNetwork(network))
      const payload: payloadType = liquidityArgs(
        swapContract,
        token0.address,
        token1.address,
        parseInt(String(Number(amount0) * 10 ** token0.decimals)),
        parseInt(String(Number(amount1) * 10 ** token1.decimals)),
        parseInt(String(slippageAmount0)),
        parseInt(String(slippageAmount1)),
      )
      setisTransactionPending(true)
      if (!account) return []
      try {
        const response: any = await signAndSubmitTransaction(payload)
        await provider.waitForTransaction(response?.hash)
        if (!response?.success) return
        const toastId = `completed:${response?.hash}`
        const summery = poolReserves
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
      } catch {
        const toastId = `failed:${Math.random()}`
        createToast({ summery: 'User rejected request', toastId: toastId })
      } finally {
        setisTransactionPending(false)
      }
    },
    [
      account,
      poolReserves,
      network,
      token0,
      token1,
      amount0,
      amount1,
      swapContract,
      amount0,
      amount1,
      slippageAmount0,
      slippageAmount1,
      setAmount0,
      setAmount1,
      setisTransactionPending,
      signAndSubmitTransaction,
    ],
  )

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
      // setAmount0(value)
      if (poolReserves?.data) {
        if (value) {
          const decimalDiff = token0.decimals - token1.decimals

          setAmount1(
            String(
              parseFloat(
                (parseFloat(value) * poolPairRatio * 10 ** decimalDiff).toFixed(
                  token1.decimals,
                ),
              ),
            ),
          )
        } else {
          setAmount1('')
        }
      }
    },
    [poolPairRatio, poolReserves, token0, token1, setAmount1],
  )

  console.log('update')

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      PoolInputBalance1(value)
      // setAmount1(value)
      if (poolReserves?.data) {
        if (value) {
          const decimalDiff = token1.decimals - token0.decimals

          setAmount0(
            String(
              parseFloat(
                (
                  (parseFloat(value) / poolPairRatio) *
                  10 ** decimalDiff
                ).toFixed(token0.decimals),
              ),
            ),
          )
        } else {
          setAmount0('')
        }
      }
    },
    [poolPairRatio, poolReserves, token0, token1, setAmount0],
  )

  useEffect(() => {
    onChangeToken0TypedAmount(String(amount0))
  }, [onChangeToken0TypedAmount, amount0])

  useEffect(() => {
    PoolInputBalance1(String(amount1))
    PoolInputBalance0(String(amount0))
  }, [amount1, amount0])

  useEffect(() => {
    setSlippageAmount0(amount0 ? Number(amount0) * 10 ** token0.decimals : 0)
    setSlippageAmount1(amount1 ? Number(amount1) * 10 ** token1.decimals : 0)
  }, [amount0, amount1, token0, token1, setSlippageAmount0, setSlippageAmount1])

  const PoolInputBalance0 = useCallback(
    (tradeVal: string) => {
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
    },
    [connected, balance0, setAmount0, token0],
  )

  const PoolInputBalance1 = useCallback(
    (tradeVal1: string) => {
      const regexPattern = /^[0-9]*(\.[0-9]*)?$/
      if (regexPattern.test(tradeVal1)) {
        setAmount1(tradeVal1)
      }
      if (connected && typeof balance1 === 'number') {
        const priceEst =
          balance1 / 10 ** token1.decimals < parseFloat(tradeVal1)
        if (priceEst) {
          setError1('Exceeds Balance')
        } else {
          setError1('')
        }
      }
    },
    [connected, balance1, setAmount1, token1],
  )

  const swapTokenIfAlreadySelected = useCallback(() => {
    setToken0(token1)
    setToken1(token0)
  }, [setToken0, setToken1, token0, token1])

  return (
    <Widget id="addLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Add Liquidity</WidgetTitle>
        <WidgetDescription>
          Provide liquidity to receive SLP tokens.
        </WidgetDescription>
        <WidgetAction variant="empty">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: 'addLiquidity',
                defaultValue: '0.5',
                title: 'Add Liquidity Slippage',
              },
            }}
            modules={[
              SettingsModule.CustomTokens,
              SettingsModule.SlippageTolerance,
            ]}
          >
            <IconButton
              size="sm"
              name="Settings"
              icon={CogIcon}
              variant="secondary"
            />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      <div className="flex flex-col gap-4">
        <TradeInput
          id={'liquidity-from'}
          token={token0}
          alteredSelected={token1}
          value={String(amount0)}
          balance={balance0}
          error={error0}
          isLoadingPrice={isLoadingBalance0 || isPriceFetching}
          onUserInput={onChangeToken0TypedAmount}
          tradeVal={tradeVal}
          setAmount={setAmount0}
          type="INPUT"
          handleSwap={swapTokenIfAlreadySelected}
          className="border border-accent px-3 py-1.5 !rounded-xl"
        />
        <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
          <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
            <PlusIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
          </div>
        </div>
        <TradeInput
          alteredSelected={token0}
          id={'liquidity-to'}
          token={token1}
          value={String(amount1)}
          balance={balance1}
          error={error1}
          isLoadingPrice={isLoadingBalance1 || isPriceFetching}
          onUserInput={onChangeToken1TypedAmount}
          tradeVal={tradeVal1}
          setAmount={setAmount1}
          type="INPUT"
          handleSwap={swapTokenIfAlreadySelected}
          className="border border-accent px-3 py-1.5 !rounded-xl"
        />
      </div>
      <WidgetFooter>
        <AddLiquidityButton
          buttonError={error0 || error1}
          token1Value={String(amount0)}
        />
      </WidgetFooter>
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
    </Widget>
  )
}
