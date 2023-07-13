import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Input } from '@sushiswap/ui/future/components/input'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { PricePanel } from './PricePanel'
import { BalancePanel } from './BalancePanel'
import TokenListDialog from './TokenListDialog'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { Token } from 'utils/tokenType'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
interface PropType {
  type: 'INPUT' | 'OUTPUT'
  token: Token
  value: string
  setAmount?: (value: string) => void
  disabled?: boolean
  setToken: (token: Token) => void
  balance: number
  error?: string
  isLoadingPrice: boolean
  tradeVal?: React.RefObject<HTMLInputElement>
  onUserInput?: (value: string) => void
}
export default function TradeInput({
  type,
  token,
  value,
  setAmount,
  disabled,
  setToken,
  balance,
  error,
  isLoadingPrice,
  tradeVal,
  onUserInput,
}: PropType) {
  const focusInput = useCallback(() => {
    if (tradeVal) {
      tradeVal.current?.focus()
    }
  }, [])

  const balanceClick = () => {
    if (setAmount) {
      if (token.symbol == 'APT') {
        setAmount(((balance - 2000000) / 10 ** 8) as unknown as string)
      } else {
        setAmount((balance / 10 ** 8) as unknown as string)
      }
    }
  }

  return (
    <div
      className={`${
        error && '!bg-red-500/20 !dark:bg-red-900/30'
      } space-y-2 overflow-hidden pb-2 p-3 bg-white dark:bg-slate-800 rounded-xl`}
      onClick={focusInput}
    >
      <div className="relative flex items-center gap-4">
        {isLoadingPrice ? (
          <div className="w-full flex items-center">
            <div className="w-[170px]">
              <Skeleton.Text fontSize="text-2xl" className="w-full" />
            </div>
          </div>
        ) : (
          <Input.Numeric
            id="swap-from"
            variant="unstyled"
            value={value}
            ref={tradeVal}
            onUserInput={(value) => {
              if (onUserInput) {
                onUserInput(value)
              }
            }}
            disabled={disabled}
            className="text-gray-900 dark:text-slate-50 text-left border-none focus:outline-none focus:ring-0 p-0 bg-transparent w-full truncate font-medium without-ring !text-3xl py-1"
          />
        )}
        <TokenListDialog selected={token} handleChangeToken={setToken}>
          {({ setOpen }) => (
            <button
              onClick={(e) => {
                setOpen(true)
                e.stopPropagation()
              }}
              id="swap-from-button"
              type="button"
              testdata-id="swap-from-button"
              className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
            >
              <div className="w-[28px] h-[28px] mr-0.5">
                <img
                  src={token.logoURI}
                  alt={token.name}
                  height={28}
                  width={28}
                  decoding="async"
                  loading="lazy"
                  data-nimg={1}
                  className="rounded-full"
                  style={{ color: 'transparent' }}
                />
              </div>
              {token.symbol}
              <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
            </button>
          )}
        </TokenListDialog>
        <div
          style={{
            position: 'fixed',
            top: '1px',
            left: '1px',
            width: '1px',
            height: '0px',
            padding: '0px',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0px, 0px, 0px, 0px)',
            whiteSpace: 'nowrap',
            borderWidth: '0px',
            display: 'none',
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <PricePanel isLoading={isLoadingPrice} error={error} />
        <BalancePanel
          coinData={balance}
          isLoading={isLoadingPrice}
          decimals={token.decimals}
          onClick={balanceClick}
          type={type}
        />
      </div>
    </div>
  )
}
