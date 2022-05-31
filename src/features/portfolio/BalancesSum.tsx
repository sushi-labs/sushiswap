import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
import Typography, { TypographyVariant } from 'app/components/Typography'
import { reduceBalances } from 'app/features/portfolio/AssetBalances/kashi/hooks'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { currencyFormatter } from 'app/functions'
import { useTridentLiquidityPositions } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalancesV2ForAccount } from 'app/state/bentobox/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useMemo } from 'react'

export const LiquidityPositionsBalancesSum = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const { data: positions } = useTridentLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const sum = positions?.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <div className="flex gap-14">
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          ${sum?.toFixed(2) || '0.00'}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Number of Assets`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {positions?.length}
        </Typography>
      </div>
    </div>
  )
}

const useWalletBalances = (account: string) => {
  const { chainId } = useActiveWeb3React()
  const [tokenBalances, loading] = useAllTokenBalancesWithLoadingIndicator(account)
  const ethBalance = useCurrencyBalance(account ?? undefined, chainId ? NATIVE[chainId] : undefined)
  return useMemo<{ data: CurrencyAmount<Currency>[]; loading: boolean }>(() => {
    const balances = Object.values(tokenBalances)
      .filter((tokenBalance): tokenBalance is CurrencyAmount<Token> => Boolean(tokenBalance))
      .filter((tokenBalance) => tokenBalance.greaterThan(ZERO))
    if (ethBalance) {
      return {
        data: [ethBalance, ...balances],
        loading,
      }
    }
    return {
      data: balances,
      loading,
    }
  }, [tokenBalances, ethBalance, loading])
}

export const BalancesSum: FC<{ account: string }> = ({ account }) => {
  const { i18n } = useLingui()
  const { data: walletBalances, loading: wLoading } = useWalletBalances(account)
  const { data: bentoBalances, loading: bLoading } = useBentoBalancesV2ForAccount(account)

  const allAssets = useMemo(() => {
    const combined = [...walletBalances, ...bentoBalances]
    return {
      total: combined.length,
      balances: reduceBalances(combined),
    }
  }, [bentoBalances, walletBalances])

  return (
    <div className="flex flex-col justify-between w-full gap-10 lg:flex-row lg:items-end">
      <div className="flex gap-10">
        <_BalancesSum
          assetAmounts={allAssets.balances}
          // liabilityAmounts={borrowed}
          label={i18n._(t`Net Worth`)}
          size="h3"
          loading={wLoading || bLoading}
        />
      </div>
      <div className="flex gap-10">
        <_BalancesSum assetAmounts={walletBalances} label={i18n._(t`Wallet`)} loading={wLoading} />
        <_BalancesSum assetAmounts={bentoBalances} label={i18n._(t`BentoBox`)} loading={bLoading} />
        <div className="flex flex-col gap-1">
          <Typography variant="sm">{i18n._(t`Assets`)}</Typography>
          <Typography variant="lg">{allAssets.total}</Typography>
        </div>
      </div>
    </div>
  )
}

interface BalancesSumProps {
  assetAmounts: (CurrencyAmount<Currency> | undefined)[]
  liabilityAmounts?: (CurrencyAmount<Currency> | undefined)[]
  label: string
  size?: TypographyVariant
  loading: boolean
}

const _BalancesSum: FC<BalancesSumProps> = ({ assetAmounts, liabilityAmounts = [], loading, label, size = 'lg' }) => {
  return (
    <SumUSDCValues amounts={assetAmounts}>
      {({ amount: assetAmount }) => (
        <SumUSDCValues amounts={liabilityAmounts}>
          {({ amount: liabilityAmount }) => {
            if (loading) {
              return (
                <div className="flex flex-col gap-1">
                  <Typography variant="sm">{label}</Typography>
                  <div className="animate-pulse rounded h-5 bg-dark-600 w-[100px]" />
                </div>
              )
            }
            return (
              <div className="flex flex-col gap-1">
                <Typography variant="sm">{label}</Typography>
                <Typography variant={size} weight={size === 'h3' ? 700 : 400} className="text-high-emphesis">
                  {assetAmount && liabilityAmount
                    ? currencyFormatter.format(Number(assetAmount.subtract(liabilityAmount).toExact()))
                    : assetAmount
                    ? currencyFormatter.format(Number(assetAmount.toExact()))
                    : '$0.00'}
                </Typography>
              </div>
            )
          }}
        </SumUSDCValues>
      )}
    </SumUSDCValues>
  )
}
