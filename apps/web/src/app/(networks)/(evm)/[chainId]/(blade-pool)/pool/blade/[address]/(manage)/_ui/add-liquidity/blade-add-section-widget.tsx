import { Cog6ToothIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import {
  Button,
  IconButton,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import { Widget, WidgetHeader, classNames } from '@sushiswap/ui'
import React, { type FC, type ReactNode, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { type EvmChainId, type EvmCurrency, EvmNative } from 'sushi/evm'

interface TokenInput {
  token: EvmCurrency | undefined
  amount: string
}

interface BladeAddSectionWidgetProps {
  chainId: EvmChainId
  availableTokens: EvmCurrency[]
  inputs: TokenInput[]
  onSelectToken(index: number, currency: EvmCurrency): void
  onInput(index: number, value: string): void
  onAddToken(): void
  onRemoveToken(index: number): void
  children: ReactNode
}

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
    () => inputs.map((input) => input.token?.wrap().address).filter(Boolean),
    [inputs],
  )

  const hasUnselectedTokens = useMemo(
    () =>
      availableTokens.some(
        (token) => !selectedTokens.includes(token.wrap().address),
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
      .map((input) => input.token!.wrap().address)

    return availableTokens
      .filter((token) => !selectedTokenAddresses.includes(token.wrap().address))
      .reduce(
        (acc, token) => {
          const wrappedToken = token.wrap()
          acc[wrappedToken.address] = wrappedToken
          // Only include native tokens if there's only one input (single asset mode)
          if (token.isNative && inputs.length === 1) {
            acc[NativeAddress] = token
          }
          return acc
        },
        {} as Record<string, EvmCurrency>,
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
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-[-30px] z-10 bg-background rounded-full">
                  <Button
                    onClick={() => onRemoveToken(index)}
                    icon={MinusCircleIcon}
                    variant="secondary"
                    size="sm"
                    className="!rounded-full"
                    type="button"
                  >
                    Remove
                  </Button>
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
                {EvmNative.fromChainId(chainId).symbol} can only be deposited as
                a single asset
              </p>
            )}
          </div>
        ))}

        {shouldShowAddButton && (
          <div className="flex justify-center mt-6">
            <Button icon={PlusIcon} onClick={onAddToken} variant="link">
              Add Another Asset
            </Button>
          </div>
        )}
      </div>
      <WidgetFooter className={classNames(inputs.length > 1 && 'mt-8')}>
        {children}
      </WidgetFooter>
    </Widget>
  )
}
