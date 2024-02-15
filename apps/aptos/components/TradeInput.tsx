import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button, SelectIcon, TextField, classNames } from '@sushiswap/ui'
import React, { useCallback, useEffect, useState } from 'react'
import { Token } from 'utils/tokenType'
import useStablePrice from 'utils/useStablePrice'
import { useTokenBalance } from 'utils/useTokenBalance'
import { BalancePanel } from './BalancePanel'
import { Icon } from './Icon'
import { PricePanel } from './PricePanel'
import TokenListDialog from './TokenListDialog'

type TradeInput = {
  id: string
  type: 'INPUT' | 'OUTPUT'
  token: Token
  value: string
  onChange?: (value: string) => void
  onSelect?: (token: Token) => void
  disabled?: boolean
  className?: string
  fetching?: boolean
  disableInsufficientBalanceError?: boolean
}

export function TradeInput({
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
}: TradeInput) {
  const { account } = useWallet()
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)

  const { data: balance, isInitialLoading: isBalanceLoading } = useTokenBalance(
    {
      account: account?.address as string,
      currency: token.address,
      refetchInterval: 2000,
    },
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
    if (typeof balance !== 'undefined') {
      const priceEst = balance / 10 ** token.decimals < parseFloat(value)
      setInsufficientBalance(priceEst)
    }
  }, [balance, value, token])

  const balanceClick = () => {
    if (balance) {
      if (token.symbol === 'APT') {
        onUserInput(String((balance - 2000000) / 10 ** 8))
      } else {
        onUserInput(String(balance / 10 ** token.decimals))
      }
    } else {
      onUserInput('0')
    }
  }

  const tokenPrice = useStablePrice({ currency: token })
  const amountUSD = tokenPrice ? tokenPrice * Number(value) : 0

  const showInsufficientBalance =
    insufficientBalance && !disableInsufficientBalanceError
  const error = showInsufficientBalance ? 'Insufficient balance' : undefined

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
          <TokenListDialog
            id={id}
            selected={token}
            handleChangeToken={onSelect}
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
                <>
                  <span className="w-[28px] h-[28px] mr-0.5">
                    <Icon currency={token} height={28} width={28} />
                  </span>
                  {token.symbol}
                  <SelectIcon />
                </>
              ) : (
                'Select'
              )}
            </Button>
          </TokenListDialog>
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
                  <Icon currency={token} height={28} width={28} />
                </span>
                {token.symbol}
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
        <PricePanel
          isLoading={typeof tokenPrice === 'undefined'}
          error={error}
          value={String(amountUSD)}
        />
        <BalancePanel
          coinData={balance ? balance : 0}
          isLoading={isBalanceLoading}
          decimals={token?.decimals}
          onClick={balanceClick}
          type={type}
        />
      </div>
    </div>
  )
}
