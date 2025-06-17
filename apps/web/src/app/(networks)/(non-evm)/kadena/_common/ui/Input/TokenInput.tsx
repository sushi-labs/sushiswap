import {
  Button,
  SelectIcon,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useKdaPrice } from '~kadena/_common/lib/hooks/use-kda-price'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { Icon } from '../General/Icon'
import { TokenSelector } from '../General/TokenSelector'
import { DollarAmountDisplay } from '../Shared/DollarAmountDisplay'
import { TokenBalanceDisplay } from '../Shared/TokenBalanceDisplay'

const themes = {
  default: 'bg-white dark:bg-slate-800',
  outline: 'border border-accent',
} as const

type TokenInputProps = {
  id?: string
  type: 'input' | 'output'
  currency: KadenaToken | undefined
  setToken?: (token: KadenaToken) => void
  amount: string
  setAmount: (amount: string) => void
  className?: string
  hideIcon?: boolean
  label?: string
  theme?: keyof typeof themes
  isLoadingAmount?: boolean
}

export const TokenInput = ({
  id,
  type,
  currency,
  setToken,
  amount,
  setAmount,
  className,
  hideIcon,
  label,
  theme = 'default',
  isLoadingAmount = false,
}: TokenInputProps) => {
  const { activeAccount } = useKadena()

  const { data, isLoading: isLoadingTokenBalance } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses: currency ? [currency.tokenAddress] : [],
  })
  const { data: priceData, isLoading: isLoadingKdaPrice } = useKdaPrice()

  const tokenBalance = data?.balanceMap[currency?.tokenAddress ?? ''] ?? 0

  //@DEV @TODO: get way to find price of token not just KDA
  const usdValue = currency?.tokenAddress === 'coin' ? priceData?.priceUsd : 0

  const usdAmount = amount
    ? (Number(amount) * (usdValue ? Number(usdValue) : 0)).toString(10)
    : '0.00'

  const isLoading = isLoadingKdaPrice || isLoadingTokenBalance
  const currencyLoading = false
  const fetching = false

  const insufficientBalance =
    type === 'input' && Number(amount) > (tokenBalance ?? 0)
  const _error = insufficientBalance ? 'Exceeds Balance' : undefined

  const selector = useMemo(() => {
    if (!setToken) return null

    return (
      <TokenSelector selected={currency} onSelect={setToken}>
        <Button
          data-state={currencyLoading ? 'inactive' : 'active'}
          size="lg"
          variant={currency ? 'secondary' : 'default'}
          id={id}
          type="button"
          className={classNames(
            currency ? 'pl-2 pr-3 text-xl' : '',
            '!rounded-full data-[state=inactive]:hidden data-[state=active]:flex',
          )}
        >
          {currency ? (
            <>
              <div className="w-[28px] h-[28px] mr-0.5">
                <Icon currency={currency} width={28} height={28} />
              </div>
              {currency.tokenSymbol}
              <SelectIcon />
            </>
          ) : (
            'Select Token'
          )}
        </Button>
      </TokenSelector>
    )
  }, [currency, id, setToken])

  return (
    <div
      className={classNames(
        _error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative space-y-2 overflow-hidden pb-2 p-3 rounded-xl',
        themes[theme],
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
        <div
          data-state={isLoading ? 'active' : 'inactive'}
          className={classNames(
            'data-[state=inactive]:hidden data-[state=active]:flex',
            'gap-4 items-center justify-between flex-grow h-[44px]',
          )}
        >
          <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
          {currencyLoading ? (
            <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
          ) : null}
        </div>
        <div
          data-state={isLoading ? 'inactive' : 'active'}
          className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
        >
          {isLoadingAmount ? (
            <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
          ) : (
            <TextField
              testdata-id={`${id}-input`}
              type="number"
              variant="naked"
              disabled={type === 'output'}
              onValueChange={(e) => {
                if (type === 'output') return
                const value = e

                setAmount(value)
              }}
              value={amount}
              readOnly={type === 'output'}
              data-state={isLoading ? 'inactive' : 'active'}
              className={classNames('p-0 py-1 !text-3xl font-medium')}
            />
          )}
        </div>

        {selector}
        {!setToken ? (
          <div
            id={`${id}-button`}
            className={classNames(
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
            )}
          >
            {currency ? (
              <>
                {!hideIcon && (
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Icon currency={currency} width={28} height={28} />
                  </div>
                )}
                {currency.tokenSymbol}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <DollarAmountDisplay
          isLoading={amount !== '' && isLoadingKdaPrice}
          error={undefined}
          value={usdAmount}
        />
        <TokenBalanceDisplay
          amount={tokenBalance ?? 0}
          isLoading={isLoadingTokenBalance}
          type={type}
          // zero decimals b/c number comes back formatted
          decimals={0}
          maxAmount={() => {
            if (type === 'output') return
            if (tokenBalance === 0) {
              setAmount('')
              return
            }
            setAmount(String(tokenBalance))
          }}
        />
      </div>
    </div>
  )
}

/*{
  {hasTokenListSelect ? (
          <TokenListSelect setToken={setToken} token={token} />
        ) : (
          <Button
            icon={() =>
              token ? <Icon currency={token} width={26} height={26} /> : <></>
            }
            size="sm"
            variant="ghost"
            className={`!rounded-full flex items-center !p-5 !text-xl focus:bg-transparent hover:bg-transparent !cursor-default`}
          >
            <span>{token?.symbol ?? 'Select Token'}</span>
          </Button>
        )}

      <div className="flex items-center justify-between gap-2">
        
        
      </div>
    </div>
}*/
