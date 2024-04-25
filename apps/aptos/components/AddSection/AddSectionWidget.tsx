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
import {
  usePoolActions,
  usePoolState,
} from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { usePool } from '../../utils/hooks/usePool'
import { Pool } from '../../utils/hooks/usePools'
import { useTokensFromPool } from '../../utils/hooks/useTokensFromPool'
import { usePoolPairs } from '../../utils/swap-get-route/use-pool-pairs'

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

  const { token0, token1 } = useTokensFromPool(pool as Pool)

  const { setToken0, setToken1 } = usePoolActions()

  const { token0: token0State, token1: token1State } = usePoolState()

  useEffect(() => {
    if (token0State.address !== token0.address) {
      setToken0(token0)
    }
    if (token1State.address !== token1.address) {
      setToken1(token1)
    }
  }, [token0, token1, setToken0, setToken1])

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
      {/* <div className="flex flex-col gap-4">
        <CurrencyInput
          id={'liquidity-from'}
          token={token0}
          value={String(amount0)}
          onChange={onChangeToken0TypedAmount}
          type="INPUT"
          className="border border-accent px-3 py-1.5 !rounded-xl"
        />
        <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
          <div className="p-1  rounded-full">
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
      </div> */}
      <WidgetFooter>
        <PoolAddDepositButton buttonProps={buttonProps} />
      </WidgetFooter>
    </Widget>
  )
}
