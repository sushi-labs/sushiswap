'use client'
import { Currency, SkeletonBox, TextField, classNames } from '@sushiswap/ui'
import { useEffect } from 'react'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/balance-panel'
import { PricePanel } from 'src/lib/wagmi/components/web3-input/Currency/price-panel'
import { Amount } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

export const TransferInput = ({
  amount,
  setAmount,
  balance,
  currency,
  error,
  isLoading,
  address,
  chainId,
}: {
  amount: string
  setAmount: (value: string) => void
  balance: Amount<EvmCurrency> | undefined
  currency: EvmCurrency
  error: string | undefined
  isLoading: boolean
  address: EvmAddress | undefined
  chainId: EvmChainId
}) => {
  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrap().address,
  })
  const _amount = Amount.tryFromHuman(currency, amount)
  const insufficientBalance =
    address && _amount && _amount && balance?.lt(_amount)

  const _error = error
    ? error
    : insufficientBalance
      ? 'Exceeds Balance'
      : undefined

  // If currency changes, trim input to decimals
  useEffect(() => {
    if (currency && setAmount && amount?.includes('.')) {
      const [, decimals] = amount.split('.')
      if (decimals.length > currency.decimals) {
        setAmount(Number(amount).toFixed(currency.decimals))
      }
    }
  }, [amount, setAmount, currency])
  return (
    <div
      className={classNames(
        _error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative space-y-2 overflow-hidden pb-2',
        'w-full border-2 rounded-lg border-[#7D95A9] px-4 py-2 bg-[#1B293EC7] text-[#78869B]',
      )}
    >
      <div
        data-state={isLoading ? 'active' : 'inactive'}
        className="transition-all data-[state=inactive]:hidden data-[state=active]:block absolute inset-0 overflow-hidden p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-gradient-to-r before:from-transparent dark:before:via-slate-50/10 before:via-gray-900/[0.07] before:to-transparent"
      />

      <div className="relative flex items-center gap-4">
        <div
          data-state={isLoading ? 'active' : 'inactive'}
          className={classNames(
            'data-[state=inactive]:hidden data-[state=active]:flex',
            'gap-4 items-center justify-between flex-grow h-[44px]',
          )}
        >
          <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
          {isLoading ? (
            <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
          ) : null}
        </div>
        <div
          data-state={isLoading ? 'inactive' : 'active'}
          className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center "
        >
          <TextField
            type="number"
            variant="naked"
            disabled={!address || isLoading}
            onValueChange={setAmount}
            value={amount}
            readOnly={isLoading || !address}
            maxDecimals={2}
            data-state={isLoading ? 'inactive' : 'active'}
            className={classNames('p-0 py-1 !text-3xl font-medium')}
          />
        </div>

        <div
          className={classNames(
            'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
          )}
        >
          <div className="w-[28px] h-[28px] mr-0.5">
            <Currency.Icon
              disableLink
              currency={currency}
              width={28}
              height={28}
            />
          </div>

          {currency.symbol}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <PricePanel
          value={amount}
          currency={currency}
          priceImpact={undefined}
          error={_error}
          loading={isPriceLoading}
          price={price}
        />

        <BalancePanel
          loading={isLoading}
          chainId={chainId}
          account={address}
          onChange={setAmount}
          currency={currency}
          balance={balance}
          type={'INPUT'}
        />
      </div>
    </div>
  )
}
