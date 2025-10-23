import {
  Button,
  SelectIcon,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useMemo } from 'react'
import { useStablePrice } from '~tron/_common/lib/hooks/useStablePrice'
import { useTokenBalance } from '~tron/_common/lib/hooks/useTokenBalance'
import { formatUnitsForInput } from '~tron/_common/lib/utils/formatters'
import type { IToken } from '~tron/_common/types/token-type'
import { Icon } from '../General/icon'
import { TokenSelector } from '../General/token-selector'
import { DollarAmountDisplay } from '../Shared/dollar-amount-display'
import { TokenBalanceDisplay } from '../Shared/token-balance-display'

const themes = {
  default: 'bg-gray-100 dark:bg-slate-800',
  outline: 'border border-accent',
} as const

type TokenInputProps = {
  id?: string
  type: 'input' | 'output'
  currency: IToken | undefined
  setToken?: (token: IToken) => void
  amount: string
  setAmount: (amount: string) => void
  className?: string
  hideIcon?: boolean
  label?: string
  theme?: keyof typeof themes
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
}: TokenInputProps) => {
  const { address } = useWallet()
  const { data: tokenBalance, isInitialLoading: isInitialLoadingTokenBalance } =
    useTokenBalance({
      accountAddress: address,
      tokenAddress: currency?.address,
    })
  const { data: usdValue, isLoading: isUSDValueLoading } = useStablePrice({
    token: currency,
  })

  const usdAmount = amount
    ? (Number(amount) * (usdValue ? Number(usdValue) : 0)).toString(10)
    : '0.00'

  const currencyLoading = false
  const isLoading = false
  const fetching = false

  const insufficientBalance = false
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
              {currency.symbol}
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
        'relative overflow-hidden',
        themes[theme],
        className,
      )}
    >
      <div
        data-state={fetching ? 'active' : 'inactive'}
        className="transition-all data-[state=inactive]:hidden data-[state=active]:block absolute inset-0 overflow-hidden p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-gradient-to-r before:from-transparent dark:before:via-slate-50/10 before:via-gray-900/[0.07] before:to-transparent"
      />
      <div className="flex items-center justify-between">
        {label ? (
          <span className="text-sm text-muted-foreground">{label}</span>
        ) : (
          <span />
        )}

        <TokenBalanceDisplay
          amount={Number(tokenBalance ?? 0)}
          isLoading={isInitialLoadingTokenBalance}
          type={type}
          decimals={currency?.decimals ?? 0}
          maxAmount={() => {
            if (type === 'output') return
            if (tokenBalance === '0') {
              setAmount('')
              return
            }
            setAmount(
              formatUnitsForInput(tokenBalance ?? '0', currency?.decimals ?? 0),
            )
          }}
        />
      </div>
      <div className="relative flex items-center gap-4 mt-1">
        <div className="w-full">
          <div
            data-state={isLoading ? 'active' : 'inactive'}
            className={classNames(
              'data-[state=inactive]:hidden data-[state=active]:flex',
              'gap-4 items-center justify-between flex-grow h-[40px]',
            )}
          >
            <SkeletonBox className="w-2/3 h-[28px] rounded-lg" />
            {currencyLoading ? (
              <SkeletonBox className="w-1/3 h-[28px] rounded-lg" />
            ) : null}
          </div>
          <div
            data-state={isLoading ? 'inactive' : 'active'}
            className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
          >
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
              className={classNames('p-0 py-1 !text-2xl font-medium')}
            />
          </div>

          <DollarAmountDisplay
            isLoading={amount !== '' && isUSDValueLoading}
            error={undefined}
            value={usdAmount}
          />
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
                {currency.symbol}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        ) : null}
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

      <div className="flex justify-between gap-2 items-center">


      </div>
    </div>
}*/
