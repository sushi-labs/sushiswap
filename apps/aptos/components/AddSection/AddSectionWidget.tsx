import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { CogIcon } from '@heroicons/react/24/outline'
import { useSlippageTolerance } from '@sushiswap/hooks'
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
import React, { FC, useCallback, useEffect } from 'react'
import { liquidityArgs } from 'utils/liquidityPayload'
import { useNetwork } from 'utils/useNetwork'
import { usePool } from '../../utils/usePool'
import { Pool } from '../../utils/usePools'
import { useTokensFromPools } from '../../utils/useTokensFromPool'
import { usePoolPairs } from '../../utils/utilFunctions'
import { AddSectionReviewModal } from '../Pool/AddSectionReviewModel'
import { usePoolActions, usePoolState } from '../Pool/PoolProvider'

type PayloadType = {
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
    poolPairRatio,
    poolReserves,
    slippageAmount0,
    slippageAmount1,
  } = usePoolState()

  const [slippageAmount] = useSlippageTolerance()

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

  const { account, signAndSubmitTransaction } = useWallet()

  const addLiquidity = useCallback(
    async (close: () => void) => {
      const provider = new Provider(networkNameToNetwork(network))

      const payload: PayloadType = liquidityArgs(
        swapContract,
        token0.address,
        token1.address,
        parseInt(String(Number(amount0) * 10 ** token0.decimals)),
        parseInt(String(Number(amount1) * 10 ** token1.decimals)),
        parseInt(String(Number(slippageAmount0) * 10 ** token0.decimals)),
        parseInt(String(Number(slippageAmount1) * 10 ** token1.decimals)),
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

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
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

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
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
    if (amount0) {
      setSlippageAmount0(Number(amount0))
    }
    if (amount1) {
      setSlippageAmount1(Number(amount1))
    }

    slippageAmount
  }, [setSlippageAmount0, setSlippageAmount1, amount0, amount1, slippageAmount])

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
          value={String(amount0)}
          onChange={onChangeToken0TypedAmount}
          type="INPUT"
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
          id={'liquidity-to'}
          token={token1}
          value={String(amount1)}
          onChange={onChangeToken1TypedAmount}
          type="INPUT"
          className="border border-accent px-3 py-1.5 !rounded-xl"
        />
      </div>
      <WidgetFooter>
        <AddLiquidityButton
          buttonError={'AHOY'}
          token1Value={String(amount0)}
        />
      </WidgetFooter>
      <AddSectionReviewModal>
        {({ close }) => (
          <Button size="xl" fullWidth onClick={() => addLiquidity(close)}>
            Add
          </Button>
        )}
      </AddSectionReviewModal>
    </Widget>
  )
}
