'use client'

import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import { type ReactNode, useMemo } from 'react'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import type { Amount } from 'sushi'
import { EvmChainId, type EvmCurrency, SUSHI, XSUSHI } from 'sushi/evm'
import { useSushiBar } from './sushi-bar-provider'
import { XSushiPrice } from './x-sushi-price'

interface StakeSectionWidgetProps {
  input: string
  parsedInput: Amount<EvmCurrency> | undefined
  onInput(value: string): void
  children: ReactNode
}

export const StakeSectionWidget = ({
  input,
  parsedInput,
  onInput,
  children,
}: StakeSectionWidgetProps) => {
  const { totalSupply, sushiBalance, isLoading } = useSushiBar()

  const xSushiAmount = useMemo(
    () =>
      parsedInput?.gt(0n) && totalSupply?.gt(0n) && sushiBalance?.gt(0n)
        ? parsedInput.mul(totalSupply.amount).div(sushiBalance.amount)
        : undefined,
    [parsedInput, totalSupply, sushiBalance],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <Web3Input.Currency
          type="INPUT"
          className="border border-accent p-4 bg-muted rounded-2xl"
          loading={false}
          value={input}
          onChange={onInput}
          currency={SUSHI[EvmChainId.ETHEREUM]}
          chainId={EvmChainId.ETHEREUM}
          label="You stake"
        />
        <div className="flex items-center justify-center mt-[-30px] mb-[-30px] z-10">
          <div className="shadow-md z-10 group bg-background dark:bg-muted py-3 px-7 border border-accent transition-all rounded-full">
            <SwitchArrowsIcon className="w-3.5 h-3.5" />
          </div>
        </div>
        <Web3Input.Currency
          type="OUTPUT"
          className="border border-accent p-4 bg-muted rounded-2xl"
          loading={Boolean(isLoading && parsedInput?.gt(0n))}
          value={xSushiAmount?.toSignificant() ?? ''}
          currency={XSUSHI[EvmChainId.ETHEREUM]}
          chainId={EvmChainId.ETHEREUM}
          disabled
          disableInsufficientBalanceError
          label="You receive"
        />
      </div>
      <div>
        <XSushiPrice />
      </div>
      {children}
    </div>
  )
}
