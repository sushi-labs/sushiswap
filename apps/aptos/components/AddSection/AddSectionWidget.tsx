import { CogIcon } from '@heroicons/react/24/outline'
import {
  ButtonProps,
  IconButton,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import {
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui/components/settings'
import { Widget, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useParams } from 'next/navigation'
import React, { FC, useEffect } from 'react'
import { PoolAddCurrencyInput } from 'ui/pool/pool/add/pool-add-currency-input'
import { PoolAddDepositButton } from 'ui/pool/pool/add/pool-add-deposit-button'
import { usePool } from '../../lib/pool/use-pool'
import { useTokensFromPool } from '../../lib/pool/use-tokens-from-pool'
import { usePoolPairs } from '../../lib/swap/swap-get-route/use-pool-pairs'
import {
  usePoolActions,
  usePoolState,
} from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'

const buttonProps: ButtonProps = {
  // size: 'xl',
  fullWidth: true,
  variant: 'outline',
}

export const AddSectionWidget: FC = () => {
  usePoolPairs()

  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id as string)
  const { data: pool } = usePool(tokenAddress)

  const { token0, token1 } = useTokensFromPool(pool)

  const { setToken0, setToken1 } = usePoolActions()

  const { token0: token0State, token1: token1State } = usePoolState()

  useEffect(() => {
    if (!token0 || !token1) return

    if (token0State.address !== token0.address) {
      setToken0(token0)
    }
    if (token1State.address !== token1.address) {
      setToken1(token1)
    }
  }, [token0, token0State, token1, token1State, setToken0, setToken1])

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
      <PoolAddCurrencyInput theme="outline" disabled={true} />
      <WidgetFooter>
        <PoolAddDepositButton buttonProps={buttonProps} />
      </WidgetFooter>
    </Widget>
  )
}
