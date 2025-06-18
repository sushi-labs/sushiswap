import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import {
  IconButton,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import { Widget, WidgetHeader } from '@sushiswap/ui'
import React, { type FC, type ReactNode, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'

interface TokenInput {
  token: Type | undefined
  amount: string
}

interface BladeAddSectionWidgetProps {
  chainId: EvmChainId
  availableTokens: Type[]
  inputs: TokenInput[]
  onSelectToken(index: number, currency: Type): void
  onInput(index: number, value: string): void
  onAddToken(): void
  onRemoveToken(index: number): void
  children: ReactNode
}

const RemoveIcon: FC = () => (
  <div className="overflow-clip relative shrink-0 size-4">
    <div className="absolute bottom-[4.165%] left-[4.167%] right-[4.167%] top-[4.169%]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g>
          <path
            d="M4.66667 6.66699C4.48986 6.66699 4.32029 6.73723 4.19526 6.86225C4.07024 6.98728 4 7.15685 4 7.33366C4 7.51047 4.07024 7.68004 4.19526 7.80506C4.32029 7.93009 4.48986 8.00033 4.66667 8.00033H10C10.1768 8.00033 10.3464 7.93009 10.4714 7.80506C10.5964 7.68004 10.6667 7.51047 10.6667 7.33366C10.6667 7.15685 10.5964 6.98728 10.4714 6.86225C10.3464 6.73723 10.1768 6.66699 10 6.66699H4.66667Z"
            fill="currentColor"
          />
          <path
            clipRule="evenodd"
            d="M14.6667 7.33333C14.6667 11.3833 11.3833 14.6667 7.33333 14.6667C3.28333 14.6667 0 11.3833 0 7.33333C0 3.28333 3.28333 0 7.33333 0C11.3833 0 14.6667 3.28333 14.6667 7.33333ZM13.3333 7.33333C13.3333 8.12126 13.1781 8.90148 12.8766 9.62943C12.5751 10.3574 12.1331 11.0188 11.576 11.576C11.0188 12.1331 10.3574 12.5751 9.62943 12.8766C8.90148 13.1781 8.12126 13.3333 7.33333 13.3333C6.5454 13.3333 5.76519 13.1781 5.03723 12.8766C4.30928 12.5751 3.64784 12.1331 3.09069 11.576C2.53354 11.0188 2.09158 10.3574 1.79006 9.62943C1.48853 8.90148 1.33333 8.12126 1.33333 7.33333C1.33333 5.74203 1.96547 4.21591 3.09069 3.09069C4.21591 1.96547 5.74203 1.33333 7.33333 1.33333C8.92463 1.33333 10.4508 1.96547 11.576 3.09069C12.7012 4.21591 13.3333 5.74203 13.3333 7.33333Z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  </div>
)

export const BladeAddSectionWidget: FC<BladeAddSectionWidgetProps> = ({
  chainId,
  availableTokens,
  inputs,
  onSelectToken,
  onInput,
  onAddToken,
  onRemoveToken,
  children,
}) => {
  const hasNativeToken = inputs.some((input) => input.token?.isNative)

  const selectedTokens = useMemo(
    () => inputs.map((input) => input.token?.wrapped.address).filter(Boolean),
    [inputs],
  )

  const hasUnselectedTokens = useMemo(
    () =>
      availableTokens.some(
        (token) => !selectedTokens.includes(token.wrapped.address),
      ),
    [availableTokens, selectedTokens],
  )

  const shouldShowAddButton = useMemo(
    () =>
      inputs.length < availableTokens.length &&
      hasUnselectedTokens &&
      !hasNativeToken,
    [
      inputs.length,
      availableTokens.length,
      hasUnselectedTokens,
      hasNativeToken,
    ],
  )

  const getTokenOptionsForInput = (inputIndex: number) => {
    const selectedTokenAddresses = inputs
      .filter((input, index) => index !== inputIndex && input.token)
      .map((input) => input.token!.wrapped.address)

    return availableTokens
      .filter(
        (token) => !selectedTokenAddresses.includes(token.wrapped.address),
      )
      .reduce(
        (acc, token) => {
          acc[token.wrapped.address] = token.wrapped
          // Only include native tokens if there's only one input (single asset mode)
          if (token.isNative && inputs.length === 1) {
            acc[NativeAddress] = token
          }
          return acc
        },
        {} as Record<string, Type>,
      )
  }

  return (
    <Widget id="addLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Add Liquidity</WidgetTitle>
        <WidgetDescription>
          Provide liquidity to earn fees & rewards.
        </WidgetDescription>
        <WidgetAction variant="empty">
          <IconButton
            size="sm"
            name="Settings"
            icon={Cog6ToothIcon}
            variant="secondary"
          />
        </WidgetAction>
      </WidgetHeader>
      <div className="flex flex-col gap-5">
        {inputs.map((input, index) => (
          <div key={index} className="relative">
            <Web3Input.Currency
              allowNative
              type="INPUT"
              className="border border-accent px-3 py-1.5 !rounded-xl"
              loading={false}
              value={input.amount}
              onChange={(value) => onInput(index, value)}
              onSelect={(currency) => onSelectToken(index, currency)}
              currency={input.token}
              currencies={getTokenOptionsForInput(index)}
              chainId={chainId}
            />
            {index === inputs.length - 1 &&
              inputs.length > 1 &&
              !hasNativeToken && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-[-30px] z-10">
                  <button
                    onClick={() => onRemoveToken(index)}
                    className="bg-neutral-100 dark:bg-neutral-800 relative rounded-full flex flex-row items-center justify-center pl-2 pr-3 py-2 gap-[7.8px] text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    type="button"
                  >
                    <RemoveIcon />
                    <span className="font-['Inter'] font-medium text-[14px] leading-[14px] whitespace-nowrap">
                      Remove
                    </span>
                  </button>
                </div>
              )}
            {index !== inputs.length - 1 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 z-10">
                <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
                  <PlusIcon
                    width={20}
                    height={20}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            )}
            {hasNativeToken && (
              <p className="text-sm text-center text-muted-foreground pt-2 pb-4">
                {input.token?.symbol ?? 'Native token'} can only be deposited as
                a single asset
              </p>
            )}
          </div>
        ))}

        {shouldShowAddButton && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onAddToken}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
              type="button"
            >
              <PlusIcon width={16} height={16} />
              Add Another Asset
            </button>
          </div>
        )}
      </div>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
