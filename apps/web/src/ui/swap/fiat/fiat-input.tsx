'use client'

import {
  Button,
  SelectIcon,
  SkeletonText,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/BalancePanel'
import { useAccount } from 'wagmi'
import { CurrencySelector } from './currency-selector'
import { useDerivedStateFiat, useFiatTrade } from './derivedstate-fiat-provider'

export const FiatInput = () => {
  const {
    state: { chainId, token0: fiat, swapAmountString },
    mutate: { setToken0: onSelect, setSwapAmount },
  } = useDerivedStateFiat()

  const { data, isLoading } = useFiatTrade()

  const { address } = useAccount()

  const selector = useMemo(() => {
    return (
      <CurrencySelector selected={fiat} onSelect={onSelect}>
        <Button
          data-state={'active'}
          size="lg"
          variant={'secondary'}
          id={'swap-from-currency-selector'}
          type="button"
          className={classNames(
            fiat ? 'pl-2 pr-3 text-xl' : '',
            '!rounded-full data-[state=inactive]:hidden !text-xl data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
          )}
        >
          {fiat ? (
            <>
              <div className="w-[28px] h-[28px] mr-0.5">
                <img
                  src={fiat.flag}
                  alt={`${fiat.code} flag`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {fiat?.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select Fiat'
          )}
        </Button>
      </CurrencySelector>
    )
  }, [onSelect, fiat])

  return (
    <div
      className={
        'relative border space-y-4 border-accent p-3 bg-gray-100 dark:bg-slate-900 rounded-xl'
      }
    >
      <div className="flex justify-between items-end gap-4">
        <span className="text-sm text-muted-foreground">Pay With Card</span>
        <BalancePanel
          id={'fiat-input'}
          loading={isLoading}
          chainId={chainId}
          account={address}
          currency={undefined}
          disableMaxButton={true}
          balance={undefined}
          symbol={fiat?.symbol}
          type={'INPUT'}
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="w-full flex flex-col">
          <div className="flex flex-1 items-center">
            <TextField
              type="number"
              variant="naked"
              disabled={!fiat || isLoading}
              onValueChange={setSwapAmount}
              value={swapAmountString}
              maxDecimals={2}
              data-state={'active'}
              className={classNames('p-0 py-1 w-full !text-2xl font-medium')}
            />
          </div>
          {isLoading ? (
            <div className="w-1/5 flex items-center">
              <SkeletonText fontSize="sm" className="w-full" />
            </div>
          ) : (
            <p className="font-medium text-sm flex items-baseline select-none text-gray-500 dark:text-slate-400">
              {data?.sourceAmount ? `${data?.sourceAmount.toFixed(2)}` : '0.00'}
            </p>
          )}
        </div>

        {selector}
      </div>
    </div>
  )
}
