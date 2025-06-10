'use client'

import { Button, SelectIcon, TextField, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/BalancePanel'
import { PricePanel } from 'src/lib/wagmi/components/web3-input/Currency/PricePanel'
import { useAccount } from 'wagmi'
import { CurrencySelector } from './currency-selector'
import { useDerivedStateFiat } from './derivedstate-fiat-provider'

export const FiatInput = () => {
  const {
    state: { chainId, token0: fiat, swapAmountString },
    mutate: { setToken0: onSelect, setSwapAmount },
  } = useDerivedStateFiat()

  const { address } = useAccount()

  // const { data: balance, isLoading: isBalanceLoading } = useAmountBalance(fiat);

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
          loading={false}
          chainId={chainId}
          account={address}
          currency={undefined}
          disableMaxButton={true}
          balance={undefined}
          symbol={fiat?.code}
          type={'INPUT'}
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        {/* {isTokenLoading ? (
					<div className="flex items-center h-[44px] w-full">
						<SkeletonBox className="w-32 h-8 rounded-lg" />
					</div>
				) : null} */}

        <div className="w-full flex flex-col">
          {/* <div
						data-state={"active"}
						className={classNames(
							"data-[state=inactive]:hidden data-[state=active]:flex",
							"gap-4 items-center justify-between flex-grow"
						)}>
						<SkeletonBox className="w-2/3 h-[28px] rounded-lg" />
					 {currencyLoading ? (
                        <SkeletonBox className="w-1/3 h-[28px] rounded-lg" />
                      ) : null}
					</div> */}
          <div
            data-state={'active'}
            className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
          >
            <TextField
              // testdata-id={`${id}-input`}
              type="number"
              variant="naked"
              disabled={false}
              onValueChange={setSwapAmount}
              value={swapAmountString}
              // readOnly={disabled}
              maxDecimals={2}
              data-state={'active'}
              className={classNames('p-0 py-1 w-full !text-2xl font-medium')}
            />
          </div>

          <PricePanel
            value={'0'}
            currency={undefined}
            priceImpact={undefined}
            error={undefined}
            loading={false}
            price={1}
          />
        </div>

        {selector}
      </div>
    </div>
  )
}
