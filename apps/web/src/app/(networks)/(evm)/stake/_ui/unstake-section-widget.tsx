'use client'

import { ArrowDownIcon } from '@heroicons/react/20/solid'
import {
  Widget,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import type { Amount } from 'sushi'
import { EvmChainId, type EvmCurrency, SUSHI } from 'sushi/evm'
import { useSushiBar } from './sushi-bar-provider'
import { XSushiPrice } from './x-sushi-price'

interface BarSectionWidgetProps {
  input: string
  amountOut: Amount<EvmCurrency> | undefined
  inputToken: EvmCurrency
  outputToken: EvmCurrency
  onInput(value: string): void
  children: ReactNode
}

export const BarSectionWidget = ({
  input,
  amountOut,
  inputToken,
  outputToken,
  onInput,
  children,
}: BarSectionWidgetProps) => {
  const { totalSupply, sushiBalance } = useSushiBar()

  return (
    <Widget id="stakeSushi" variant="empty">
      <WidgetHeader>
        <WidgetTitle>
          {inputToken.isSame(SUSHI[EvmChainId.ETHEREUM]) ? 'Stake' : 'Unstake'}
        </WidgetTitle>
        <WidgetDescription>
          <XSushiPrice totalSupply={totalSupply} sushiBalance={sushiBalance} />
        </WidgetDescription>
      </WidgetHeader>
      <div className="flex flex-col gap-4">
        <Web3Input.Currency
          type="INPUT"
          className="border border-accent px-3 py-1.5 !rounded-xl"
          loading={false}
          value={input}
          onChange={onInput}
          currency={inputToken}
          chainId={EvmChainId.ETHEREUM}
        />
        <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
          <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
            <ArrowDownIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
          </div>
        </div>
        <Web3Input.Currency
          type="OUTPUT"
          className="border border-accent px-3 py-1.5 !rounded-xl"
          loading={Boolean(!amountOut && input)}
          value={amountOut?.toSignificant() ?? ''}
          currency={outputToken}
          chainId={EvmChainId.ETHEREUM}
          disabled
          disableInsufficientBalanceError
        />
      </div>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
