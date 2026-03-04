import {
  Badge,
  Button,
  SelectIcon,
  SelectPrimitive,
  TextField,
  classNames,
} from '@sushiswap/ui'
import React, { useCallback, useEffect, useState } from 'react'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import { useTokenBalance } from '~stellar/_common/lib/hooks/token/use-token-balance'
import type { Token } from '~stellar/_common/lib/types/token.type'
import TokenSelector from '~stellar/_common/ui/token-selector/token-selector'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ChainId } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { useStellarWallet } from '~stellar/providers'
import { TokenIcon } from '../../General/TokenIcon'
import { CurrencyInputBalancePanel } from './currency-input-balance-panel'
import { CurrencyInputPricePanel } from './currency-input-price-panel'

type CurrencyInput = {
  id: string
  type: 'INPUT' | 'OUTPUT'
  token: Token | undefined
  value: string
  onChange?: (value: string) => void
  onSelect?: (token: Token) => void
  disabled?: boolean
  className?: string
  fetching?: boolean
  disableInsufficientBalanceError?: boolean
  networks?: readonly ChainId[]
  onNetworkChange?: (network: number) => void
  label?: string
}

export function CurrencyInput({
  id,
  type,
  token,
  value,
  onChange,
  disabled,
  onSelect,
  className,
  fetching,
  disableInsufficientBalanceError = false,
  label,
  networks,
  onNetworkChange,
}: CurrencyInput) {
  const { connectedAddress } = useStellarWallet()
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)

  const { data: balance, isLoading: isBalanceLoading } = useTokenBalance(
    connectedAddress,
    token?.contract ?? null,
  )

  const onUserInput = useCallback(
    (amount: string) => {
      if (onChange) {
        onChange(amount)
      }
    },
    [onChange],
  )

  useEffect(() => {
    if (typeof balance !== 'undefined' && token) {
      const priceEst =
        Number(balance) / 10 ** token.decimals < Number.parseFloat(value)
      setInsufficientBalance(priceEst)
    }
  }, [balance, value, token])

  const balanceClick = () => {
    if (balance && token) {
      onUserInput(String(Number(balance) / 10 ** token.decimals))
    } else {
      onUserInput('0')
    }
  }

  const { data: tokenPrice, isLoading: isPriceLoading } = useStablePrice({
    token,
  })
  // Show $0.00 when there's no price information instead of showing an error
  const amountUSD = tokenPrice ? Number(tokenPrice) * Number(value) : 0

  const showInsufficientBalance =
    insufficientBalance && !disableInsufficientBalanceError

  // Only show "No pool" error if there's actually no pool found for price calculation
  // If there's no price info, just show $0.00 instead
  const priceError = undefined

  const error = showInsufficientBalance ? 'Insufficient balance' : priceError

  return (
    <div
      className={classNames(
        error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative space-y-2 overflow-hidden pb-2',
        className,
      )}
    >
      <div
        data-state={fetching ? 'active' : 'inactive'}
        className="transition-all data-[state=inactive]:hidden data-[state=active]:block absolute inset-0 overflow-hidden p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-gradient-to-r before:from-transparent dark:before:via-slate-50/10 before:via-gray-900/[0.07] before:to-transparent"
      />
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative flex items-center gap-4">
        <div className="flex flex-1 items-center">
          <TextField
            testdata-id={`${id}-input`}
            type="number"
            variant="naked"
            disabled={disabled}
            onValueChange={(value) => {
              if (onUserInput) {
                onUserInput(value)
              }
            }}
            value={value}
            readOnly={disabled}
            className={classNames('p-0 py-1 !text-3xl font-medium')}
          />
        </div>

        {onSelect ? (
          <TokenSelector
            id={id}
            selected={token}
            onSelect={onSelect}
            networks={networks}
            onNetworkSelect={onNetworkChange}
          >
            <Button
              size="lg"
              variant={token ? 'secondary' : 'default'}
              id={`${id}-token-selector`}
              type="button"
              testdata-id="swap-from-button"
              className={classNames(
                token ? 'pl-2 pr-3 text-xl' : '',
                '!rounded-full flex',
              )}
            >
              {token ? (
                networks ? (
                  <>
                    <div className="w-[28px] h-[28px] mr-1.5">
                      <Badge
                        className="border border-slate-900 rounded-full z-[11]"
                        position="bottom-right"
                        badgeContent={
                          <NetworkIcon
                            chainId={StellarChainId.STELLAR}
                            width={16}
                            height={16}
                          />
                        }
                      >
                        <TokenIcon currency={token} height={28} width={28} />
                      </Badge>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xl leading-5">{token.code}</span>
                      <span className="text-xs leading-3 text-muted-foreground">
                        Stellar
                      </span>
                    </div>
                    <SelectPrimitive.Icon asChild>
                      <ChevronRightIcon
                        strokeWidth={2}
                        width={16}
                        height={16}
                      />
                    </SelectPrimitive.Icon>
                  </>
                ) : (
                  <>
                    <div className="w-[28px] h-[28px] mr-0.5">
                      <TokenIcon currency={token} width={28} height={28} />
                    </div>
                    <span className="text-xl">{token.code}</span>
                    <SelectIcon />
                  </>
                )
              ) : (
                'Select token'
              )}
            </Button>
          </TokenSelector>
        ) : (
          <div
            id={`${id}-button`}
            className={classNames(
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
            )}
          >
            {token ? (
              <>
                <span className="w-[28px] h-[28px] mr-0.5">
                  <TokenIcon currency={token} height={28} width={28} />
                </span>
                {token.code}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <CurrencyInputPricePanel
          isLoading={isPriceLoading}
          error={error}
          value={String(amountUSD)}
        />
        <CurrencyInputBalancePanel
          coinData={balance ?? 0n}
          isLoading={isBalanceLoading}
          decimals={token?.decimals ?? 7}
          onClick={balanceClick}
          type={type}
        />
      </div>
    </div>
  )
}
