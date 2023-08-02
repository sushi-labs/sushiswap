'use client'

import { Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import {
  classNames,
  List,
  TextField,
  textFieldVariants,
  typographyVariants,
  WidgetDescription,
  WidgetFooter,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency as UICurrency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { Widget, WidgetAction, WidgetHeader, WidgetTitle } from '@sushiswap/ui/components/widget'
import React, { FC, ReactNode } from 'react'

import { usePoolPosition } from './PoolPositionProvider'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: ChainId
  percentage: string
  token0: Type
  token1: Type
  token0Minimum?: Amount<Type>
  token1Minimum?: Amount<Type>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  chainId,
  percentage,
  setPercentage,
  token0,
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const { balance, value0, value1 } = usePoolPosition()

  return (
    <Widget id="removeLiquidity" variant="empty">
      <div
        data-state={balance?.[FundSource.WALLET]?.greaterThan(ZERO) ? 'closed' : 'open'}
        className={classNames(
          'data-[state=open]:opacity-80 bg-gray-50 dark:bg-slate-900 data-[state=closed]:pointer-events-none opacity-0 z-10 absolute inset-0'
        )}
      />
      <WidgetHeader>
        <WidgetTitle>Remove Liquidity</WidgetTitle>
        <WidgetDescription>If you dont see your balance, maybe you forgot to unstake first?</WidgetDescription>
        <WidgetAction variant="empty">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: 'removeLiquidity',
                defaultValue: '0.5',
                title: 'Remove Liquidity Slippage',
              },
            }}
            modules={[SettingsModule.CustomTokens, SettingsModule.SlippageTolerance]}
          >
            <IconButton size="sm" name="Settings" icon={CogIcon} variant="secondary" />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className={textFieldVariants({ className: 'flex flex-col gap-2 !h-[unset]' })}>
            <TextField
              id="amount"
              placeholder="100"
              unit="%"
              type="percent"
              value={percentage}
              onValueChange={(val) => setPercentage(val ? Math.min(+val, 100).toString() : '')}
              className="text-2xl"
              variant="naked"
            />
            <div className="flex w-full justify-between gap-2">
              <span className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
                {formatUSD((value0 + value1) * (+percentage / 100))}
              </span>
              <Button size="sm" variant="link" testId="stake-balance" onClick={() => setPercentage('100')}>
                Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
              </Button>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Button
              size="xs"
              fullWidth
              variant={percentage === '25' ? 'default' : 'secondary'}
              onClick={() => setPercentage('25')}
              testId="remove-liquidity-25"
            >
              25%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={percentage === '50' ? 'default' : 'secondary'}
              onClick={() => setPercentage('50')}
              testId="remove-liquidity-50"
            >
              50%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={percentage === '75' ? 'default' : 'secondary'}
              onClick={() => setPercentage('75')}
              testId="remove-liquidity-75"
            >
              75%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={percentage === '100' ? 'default' : 'secondary'}
              onClick={() => setPercentage('100')}
              testId="remove-liquidity-max"
            >
              MAX
            </Button>
          </div>
        </div>
        <Transition
          show={Boolean(+percentage > 0 && token0Minimum && token1Minimum)}
          unmount={false}
          className="transition-[max-height] overflow-hidden"
          enter="duration-300 ease-in-out"
          enterFrom="transform max-h-0"
          enterTo="transform max-h-[380px]"
          leave="transition-[max-height] duration-250 ease-in-out"
          leaveFrom="transform max-h-[380px]"
          leaveTo="transform max-h-0"
        >
          <List>
            <List.Label>You&apos;ll receive at least:</List.Label>
            <List.Control className="!bg-secondary">
              {token0Minimum ? (
                <List.KeyValue flex title={`${token0Minimum.currency.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <UICurrency.Icon currency={token0Minimum.currency} width={18} height={18} />
                      {token0Minimum.toSignificant(4)}{' '}
                      {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                        ? Native.onChain(chainId).symbol
                        : token0Minimum?.currency.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : null}
              {token1Minimum ? (
                <List.KeyValue flex title={`${token1Minimum.currency.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <UICurrency.Icon currency={token1Minimum.currency} width={18} height={18} />
                      {token1Minimum.toSignificant(4)}{' '}
                      {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                        ? Native.onChain(chainId).symbol
                        : token1Minimum?.currency.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : null}
            </List.Control>
          </List>
        </Transition>
      </div>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
