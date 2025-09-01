import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { Widget, WidgetHeader } from '@sushiswap/ui'
import React, { type FC, type ReactNode } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import { ToggleZapCard } from './ToggleZapCard'

interface AddSectionWidgetProps {
  isFarm: boolean
  chainId: EvmChainId
  input0: string
  input1: string
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  onSelectToken0?(currency: EvmCurrency): void
  onSelectToken1?(currency: EvmCurrency): void
  onInput0(value: string): void
  onInput1(value: string): void
  toggleZapMode(value: boolean): void
  children: ReactNode
}

export const AddSectionWidget: FC<AddSectionWidgetProps> = ({
  chainId,
  input0,
  input1,
  token0,
  token1,
  onSelectToken0,
  onSelectToken1,
  onInput0,
  onInput1,
  toggleZapMode,
  children,
}) => {
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
                storageKey: SlippageToleranceStorageKey.AddLiquidity,
                title: 'Add Liquidity Slippage',
              },
              transactionDeadline: {
                storageKey: TTLStorageKey.AddLiquidity,
                defaultValue: getDefaultTTL(chainId).toString(),
              },
            }}
            modules={[
              SettingsModule.CustomTokens,
              SettingsModule.SlippageTolerance,
              SettingsModule.TransactionDeadline,
            ]}
          >
            <IconButton
              size="sm"
              name="Settings"
              icon={Cog6ToothIcon}
              variant="secondary"
            />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      {isZapSupportedChainId(chainId) ? (
        <div className="mb-4">
          <ToggleZapCard onCheckedChange={toggleZapMode} checked={false} />
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        <Web3Input.Currency
          type="INPUT"
          className="p-4 bg-white dark:bg-slate-800 rounded-xl"
          loading={false}
          value={input0}
          onChange={onInput0}
          onSelect={onSelectToken0}
          currency={token0}
          chainId={chainId}
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
        <Web3Input.Currency
          type="INPUT"
          className="p-4 bg-white dark:bg-slate-800 rounded-xl"
          value={input1}
          onChange={onInput1}
          currency={token1}
          onSelect={onSelectToken1}
          chainId={chainId}
        />
      </div>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
