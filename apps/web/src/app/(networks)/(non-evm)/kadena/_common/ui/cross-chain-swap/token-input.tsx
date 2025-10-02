import {
  Button,
  SelectIcon,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import {
  type KvmChainId,
  type KvmToken,
  type KvmTokenAddress,
  isKvmChainId,
} from 'sushi/kvm'
import { formatUnits } from 'viem'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import type { XSwapToken } from '~kadena/_common/lib/hooks/x-chain-swap/use-x-chain-token-info'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { Icon } from '../General/Icon'
import {
  type EthereumChainId,
  XChainTokenSelector,
} from '../General/x-chain-token-selector'
import { DollarAmountDisplay } from '../Shared/DollarAmountDisplay'
import { TokenBalanceDisplay } from '../Shared/TokenBalanceDisplay'

const themes = {
  default: 'bg-white dark:bg-slate-800',
  outline: 'border border-accent',
} as const

type TokenInputProps = {
  id?: string
  type: 'input' | 'output'
  currency: XSwapToken | undefined
  setToken?: (token: XSwapToken) => void
  amount: string
  setAmount: (amount: string) => void
  className?: string
  hideIcon?: boolean
  label?: string
  theme?: keyof typeof themes
  isLoadingAmount?: boolean
  isTxnPending?: boolean
  networks?: (KvmChainId | EthereumChainId)[]
  onNetworkSelect?: (network: number) => void
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
  isTxnPending = false,
  networks,
}: TokenInputProps) => {
  const [localValue, setLocalValue] = useState<string>('')

  const [pending, startTransition] = useTransition()
  const { activeAccount } = useKadena()

  const isKadena = currency?.chainId && isKvmChainId(currency.chainId)
  const kadenaTokenAddress = isKadena
    ? (currency!.address as KvmTokenAddress)
    : undefined
  const kadenaToken = isKadena ? (currency as KvmToken) : undefined
  const tokenAddresses = useMemo(
    () => (kadenaTokenAddress ? [kadenaTokenAddress] : []),
    [kadenaTokenAddress],
  )

  const kadenaBalances = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses,
  })
  const kadenaPrice = useTokenPrice({
    token: kadenaToken,
    enabled: Boolean(isKadena && amount),
  })

  const isEvm = isEvmChainId(currency?.chainId ?? EvmChainId.ETHEREUM)
  const evmChainId = isEvm ? (currency?.chainId as EvmChainId) : undefined
  const evmAddress = isEvm ? (currency?.address as `0x${string}`) : undefined

  const evmBalance = useBalance(evmChainId, evmAddress)

  const evmPrice = usePrice({
    chainId: evmChainId,
    address: evmAddress,
    enabled: Boolean(evmChainId && evmAddress),
  })

  const priceUsd =
    currency?.chainId && isEvmChainId(currency?.chainId)
      ? evmPrice.data
      : kadenaPrice.data

  const tokenBalance = useMemo(() => {
    if (!currency) return '0'

    if (isEvmChainId(currency.chainId)) {
      const raw = evmBalance.data ?? 0n
      return formatUnits(raw, currency.decimals ?? 18).toString()
    }

    if (isKvmChainId(currency.chainId)) {
      const raw = kadenaBalances.data?.balanceMap[currency.address ?? ''] ?? '0'
      return formatUnits(BigInt(raw), currency.decimals ?? 12).toString()
    }

    return '0'
  }, [currency, evmBalance.data, kadenaBalances.data])

  const usdValue = priceUsd ?? 0

  const usdAmount = amount
    ? (Number(amount) * (usdValue ? Number(usdValue) : 0)).toString(10)
    : '0.00'

  const isLoadingPrice = evmPrice.isLoading || kadenaPrice.isLoading
  const isLoadingTokenBalance = kadenaBalances.isLoading || evmBalance.isLoading
  const currencyLoading = false
  const fetching = false

  const insufficientBalance =
    type === 'input' && Number(amount) > Number.parseFloat(tokenBalance ?? '0')
  const _error = insufficientBalance ? 'Exceeds Balance' : undefined

  const _onChange = useCallback(
    (_amount: string) => {
      setLocalValue(_amount)
      startTransition(() => {
        setAmount?.(_amount)
      })
    },
    [setAmount],
  )

  useEffect(() => {
    if (currency && setAmount && amount && amount.includes('.')) {
      const [, decimals] = amount.split('.')
      if (decimals.length > currency.decimals) {
        setAmount(Number(amount).toFixed(currency.decimals))
      }
    }
  }, [setAmount, currency, amount])

  const selector = useMemo(() => {
    if (!setToken) return null

    return (
      <XChainTokenSelector
        selected={currency}
        onSelect={setToken}
        networks={networks}
      >
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
      </XChainTokenSelector>
    )
  }, [currency, id, setToken, networks])

  const isLoading = false
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
              maxDecimals={currency?.decimals}
              testdata-id={`${id}-input`}
              type="number"
              variant="naked"
              disabled={type === 'output' || isTxnPending}
              onValueChange={_onChange}
              value={pending ? localValue : amount}
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
      <div className="flex flex-row items-center justify-between h-[36px]">
        <DollarAmountDisplay
          isLoading={!amount && isLoadingPrice}
          error={undefined}
          value={usdAmount}
        />
        <TokenBalanceDisplay
          amount={Number.parseFloat(tokenBalance ?? '0')}
          isLoading={isLoadingTokenBalance}
          type={type}
          maxAmount={() => {
            if (type === 'output') return
            if (tokenBalance === '0') {
              setAmount('')
              return
            }
            setAmount(tokenBalance)
          }}
        />
      </div>
    </div>
  )
}
