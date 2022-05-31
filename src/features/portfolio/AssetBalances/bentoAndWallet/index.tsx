import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { setBalancesState } from 'app/features/portfolio/portfolioSlice'
import { ActiveModal } from 'app/features/trident/types'
import { useBentoStrategies } from 'app/services/graph'
import { useBentoBalancesV2ForAccount } from 'app/state/bentobox/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useCallback, useMemo } from 'react'

import { useBasicTableConfig } from '../useBasicTableConfig'
import { useBentoBoxTableConfig } from '../useBentoBoxTableConfig'

interface Balances {
  account: string
  chainId: number | undefined
}

export const BentoBalances = ({ account, chainId }: Balances) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()

  const { data: balances, loading } = useBentoBalancesV2ForAccount(account)

  const tokens = useMemo(() => balances.map((balance) => balance.currency.address.toLowerCase()), [balances])

  const strategies = useBentoStrategies({
    chainId,
    shouldFetch: !!chainId && !loading && balances.length > 0,
    variables: { where: { token_in: tokens } },
  })

  const assets = useMemo(
    () =>
      balances.reduce<Assets[]>((previousValue, currentValue) => {
        const strategy = strategies?.find((strategy) => strategy.token === currentValue.currency.address.toLowerCase())
        return [...previousValue, { asset: currentValue, strategy }]
      }, []),
    [balances, strategies]
  )

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency.isNative ? 'ETH' : row.values.asset.currency.address,
          activeModal: ActiveModal.BENTOBOX_MENU,
        })
      )
    },
    [dispatch]
  )

  const { config } = useBentoBoxTableConfig(assets, loading)

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`BentoBox Balances`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances = ({ account, chainId }: Balances) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const [tokenBalances, loading] = useAllTokenBalancesWithLoadingIndicator(account)

  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    return Object.values(tokenBalances).reduce<Assets[]>(
      (previousValue, currentValue) => {
        if (currentValue && currentValue.greaterThan(ZERO)) {
          return [...previousValue, { asset: currentValue }]
        }

        return previousValue
      },
      ethBalance ? [{ asset: ethBalance }] : []
    )
  }, [tokenBalances, ethBalance])

  const { config } = useBasicTableConfig(balances, loading)

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency.isNative ? 'ETH' : row.values.asset.currency.address,
          activeModal: ActiveModal.WALLET_MENU,
        })
      )
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Wallet Balances`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}
