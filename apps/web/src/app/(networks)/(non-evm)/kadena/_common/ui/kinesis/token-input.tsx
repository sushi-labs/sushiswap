import {
  Badge,
  Button,
  SelectIcon,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  EvmChainId,
  type EvmToken,
  WETH9_ADDRESS,
  getEvmChainById,
  isEvmChainId,
} from 'sushi/evm'
import {
  type KvmToken,
  type KvmTokenAddress,
  getKvmChainById,
  isKvmChainId,
} from 'sushi/kvm'
import { formatUnits } from 'viem'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { KINESIS_BRIDGE_EVM_ETH } from '~kadena/_common/constants/token-list'
import { useKinesisWrappedToken } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-wrapped-token'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import type {
  KinesisChainId,
  KinesisToken,
} from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { Icon } from '../General/Icon'
import { DollarAmountDisplay } from '../Shared/DollarAmountDisplay'
import { TokenBalanceDisplay } from '../Shared/TokenBalanceDisplay'
import { KinesisTokenSelector } from './token-selector'

const themes = {
  default: 'bg-white dark:bg-slate-800',
  outline: 'border border-accent',
} as const

type TokenInputProps = {
  id?: string
  type: 'input' | 'output'
  currency: KinesisToken | undefined
  setToken?: (token: KinesisToken) => void
  amount: string
  setAmount: (amount: string) => void
  className?: string
  hideIcon?: boolean
  label?: string
  theme?: keyof typeof themes
  isLoadingAmount?: boolean
  isTxnPending?: boolean
  networks?: KinesisChainId[]
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

  const { data: wrappedToken, isLoading: isLoadingWrappedToken } =
    useKinesisWrappedToken({
      token: currency as EvmToken | undefined,
      enabled: Boolean(currency && isEvm),
    })

  const tokenToGetPriceFor = useMemo(() => {
    if (
      evmAddress?.toLowerCase() === KINESIS_BRIDGE_EVM_ETH.address.toLowerCase()
    ) {
      return WETH9_ADDRESS[EvmChainId.ETHEREUM]
    }
    return wrappedToken ? wrappedToken : evmAddress
  }, [wrappedToken, evmAddress])

  const evmPrice = usePrice({
    chainId: evmChainId,
    address: tokenToGetPriceFor,
    enabled: Boolean(
      evmChainId && !isLoadingWrappedToken && tokenToGetPriceFor,
    ),
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

  const networkName = useMemo(() => {
    if (!currency) return ''
    if (isEvmChainId(currency.chainId)) {
      return getEvmChainById(currency.chainId).name
    }
    if (isKvmChainId(currency.chainId)) {
      return getKvmChainById(currency.chainId).name
    }
  }, [currency])

  const selector = useMemo(() => {
    if (!setToken) return null

    return (
      <KinesisTokenSelector
        selected={currency}
        onSelect={setToken}
        networks={networks}
      >
        <Button
          size="lg"
          variant={currency ? 'secondary' : 'default'}
          id={id}
          type="button"
          className={classNames(
            currency ? 'pl-2 pr-3 text-xl' : '',
            '!rounded-full flex',
          )}
        >
          {currency ? (
            <>
              <div className="mr-1">
                <Badge
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      chainId={currency.chainId}
                      width={16}
                      height={16}
                      className="border border-slate-900 rounded-full"
                    />
                  }
                >
                  <Icon currency={currency} width={28} height={28} />
                </Badge>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl leading-5">{currency.symbol}</span>
                <span className="text-xs leading-3 text-muted-foreground">
                  {networkName}
                </span>
              </div>
              <SelectIcon />
            </>
          ) : (
            'Select Token'
          )}
        </Button>
      </KinesisTokenSelector>
    )
  }, [currency, id, setToken, networks, networkName])

  return (
    <div
      className={classNames(
        _error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative space-y-2 overflow-hidden pb-2 p-3 rounded-xl',
        themes[theme],
        className,
      )}
    >
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative flex items-center gap-4">
        <div className="flex flex-1 items-center">
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
              data-state={'active'}
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
                  <div className="mr-2">
                    <Badge
                      position="bottom-right"
                      badgeContent={
                        <NetworkIcon
                          chainId={currency.chainId}
                          width={16}
                          height={16}
                          className="border border-slate-900 rounded-full"
                        />
                      }
                    >
                      <Icon currency={currency} width={28} height={28} />
                    </Badge>
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-xl leading-5">{currency.symbol}</span>
                  <span className="text-xs leading-3 text-muted-foreground">
                    {networkName}
                  </span>
                </div>
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
          isLoading={Boolean(
            (amount !== '' && isLoadingPrice) || isLoadingAmount,
          )}
          error={_error}
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
