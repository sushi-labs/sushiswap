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
import { AddLiquidityButton } from 'components/Pool/AddLiquidityButton'
import { useParams } from 'next/navigation'
import React, { FC, useCallback, useEffect } from 'react'
import { CurrencyInput } from 'ui/common/currency/currency-input/currency-input'
import {
  usePoolActions,
  usePoolState,
} from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { usePool } from '../../utils/hooks/usePool'
import { Pool } from '../../utils/hooks/usePools'
import { useTokensFromPools } from '../../utils/hooks/useTokensFromPool'
import { usePoolPairs } from '../../utils/swap-get-route/use-pool-pairs'
import { AddSectionReviewModal } from '../Pool/AddSectionReviewModel'

export const AddSectionWidget: FC = () => {
  usePoolPairs()

  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id as string)
  const { data: pool } = usePool(tokenAddress)

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const { setToken0, setToken1, setAmount0, setAmount1 } = usePoolActions()

  const {
    token0: token0State,
    token1: token1State,
    amount0,
    amount1,
    poolPairRatio,
  } = usePoolState()

  useEffect(() => {
    if (token0State.address !== token0.address) {
      setToken0(token0)
    }
    if (token1State.address !== token1.address) {
      setToken1(token1)
    }
  }, [token0, token1, setToken0, setToken1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (typeof poolPairRatio === 'number') {
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
    [poolPairRatio, token0, token1, setAmount1],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (typeof poolPairRatio === 'number') {
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
    [poolPairRatio, token0, token1, setAmount0],
  )

  useEffect(() => {
    onChangeToken0TypedAmount(String(amount0))
  }, [onChangeToken0TypedAmount, amount0])

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
        <CurrencyInput
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
        <CurrencyInput
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
        <Button size="xl" fullWidth>
          Add
        </Button>
      </AddSectionReviewModal>
    </Widget>
  )
}
