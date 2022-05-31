import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Price, ZERO } from '@sushiswap/core-sdk'
import { PoolState } from '@sushiswap/trident-sdk'
import { selectBalancesCurrency } from 'app/features/portfolio/portfolioSlice'
import {
  selectSelectedAssetIndex,
  selectTridentCreate,
  setCreateSelectedAsset,
} from 'app/features/trident/create/createSlice'
import { SelectedAsset, SpendSource } from 'app/features/trident/create/SelectedAsset'
import { getPriceOfNewPool } from 'app/features/trident/utils'
import { useConstantProductPoolFactory, useMasterDeployerContract, useTridentRouterContract } from 'app/hooks'
import { useCurrency } from 'app/hooks/Tokens'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoMasterContractAllowed } from 'app/state/bentobox/hooks'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

type UseBalancesSelectedCurrency = () => Currency | undefined
export const useBalancesSelectedCurrency: UseBalancesSelectedCurrency = () => {
  const currency = useSelector(selectBalancesCurrency)
  return useCurrency(currency) ?? undefined
}

type UseCreatePoolDerivedCurrencyAmounts = () => (CurrencyAmount<Currency> | undefined)[]
export const useCreatePoolDerivedCurrencyAmounts: UseCreatePoolDerivedCurrencyAmounts = () => {
  const { selectedAssets } = useAppSelector(selectTridentCreate)
  return useMemo(() => {
    if (selectedAssets.length > 1) {
      return selectedAssets.map((el) => el.parsedAmount)
    }

    return new Array(selectedAssets.length).fill(undefined)
  }, [selectedAssets])
}

type UseCreatePoolDerivedPrice = () => Price<Currency, Currency> | undefined
export const useCreatePoolDerivedPrice: UseCreatePoolDerivedPrice = () => {
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  return useMemo(() => getPriceOfNewPool(parsedAmounts), [parsedAmounts])
}

type UseCreatePoolDerivedAssetError = (index: number) => string
export const useCreatePoolDerivedAssetError: UseCreatePoolDerivedAssetError = (index) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  const asset = useAppSelector((state) => selectSelectedAssetIndex(state, index))

  const balance = useBentoOrWalletBalance(
    account ?? undefined,
    asset.currency,
    asset.spendFromSource === SpendSource.WALLET
  )

  const insufficientBalance = useMemo(() => {
    return balance && asset.parsedAmount ? balance.lessThan(asset.parsedAmount) : false
  }, [asset.parsedAmount, balance])

  return !account
    ? i18n._(t`Connect Wallet`)
    : !parsedAmounts[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : insufficientBalance
    ? i18n._(t`Insufficient Balance`)
    : ''
}

type UseCreatePoolDerivedInputError = () => string
export const useCreatePoolDerivedInputError: UseCreatePoolDerivedInputError = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { selectedFeeTier, createAnOracle, selectedAssets } = useAppSelector(selectTridentCreate)

  const { state } = useConstantProductPool(
    selectedAssets?.[0]?.currency,
    selectedAssets?.[1]?.currency,
    selectedFeeTier,
    createAnOracle
  )

  return !account
    ? i18n._(t`Connect Wallet`)
    : !selectedAssets?.[0]?.currency || !selectedAssets?.[1]?.currency
    ? i18n._(t`Select tokens`)
    : !selectedAssets?.[0].amount || !selectedAssets?.[1].amount
    ? i18n._(t`No amount selected`)
    : selectedAssets?.[0].error || selectedAssets?.[1].error
    ? i18n._(t`Error in asset selection`)
    : !selectedFeeTier
    ? i18n._(t`Select fee tier`)
    : state === PoolState.EXISTS
    ? i18n._(t`Pool already exists`)
    : ''
}

type UseCreatePoolDerivedDependencyError = () => string
export const useCreatePoolDerivedDependencyError: UseCreatePoolDerivedDependencyError = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const router = useTridentRouterContract()
  const { selectedAssets: assets, selectedFeeTier: feeTier, bentoPermit } = useAppSelector(selectTridentCreate)
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  const bentoApproved = useBentoMasterContractAllowed(router?.address, account ?? undefined)
  const { rebases } = useBentoRebases(assets.map((asset) => asset.currency))

  if (!account) {
    return i18n._(t`No account connected`)
  } else if (!masterDeployer) {
    return i18n._(t`No MasterDeployerContract`)
  } else if (!constantProductPoolFactory) {
    return i18n._(t`No ConstantProductPoolFactory`)
  } else if (!router) {
    return i18n._(t`No TridentRouterContract`)
  } else if (!assets[0].currency || !assets[1].currency) {
    return i18n._(t`No all currencies are selected`)
  } else if (!parsedAmounts[0] || !parsedAmounts[1]) {
    return i18n._(t`Could not parse amount of asset`)
  } else if (!parsedAmounts.every((el) => el?.greaterThan(0))) {
    return i18n._(t`Amount selected is not greater than zero`)
  } else if (!feeTier) {
    return i18n._(t`Fee tier not selected`)
  } else if (
    !rebases?.[parsedAmounts[0].currency.wrapped.address] ||
    !rebases?.[parsedAmounts[1].currency.wrapped.address]
  ) {
    return i18n._(t`Rebases still loading`)
  } else if (!bentoApproved && !bentoPermit) {
    return i18n._(t`Missing bento permit`)
  }

  return ''
}

type UseCreatePoolDerivedAsset = (index: number) => {
  asset: SelectedAsset
  setError(x?: string): void
  setCurrency(x: Currency): void
  setAmount(x?: string): void
  setWalletSource(x: SpendSource): void
}

export const useCreatePoolDerivedAsset: UseCreatePoolDerivedAsset = (index) => {
  const dispatch = useAppDispatch()
  const asset = useAppSelector((state) => selectSelectedAssetIndex(state, index))
  const error = useCreatePoolDerivedAssetError(index)

  const setError = useCallback(
    (error?: string) => {
      if (asset.error !== error) {
        dispatch(setCreateSelectedAsset({ asset: new SelectedAsset({ ...asset, error }), index }))
      }
    },
    [asset, dispatch, index]
  )

  const setCurrency = useCallback(
    (currency: Currency) => {
      dispatch(setCreateSelectedAsset({ asset: new SelectedAsset({ ...asset, currency }), index }))
    },
    [asset, dispatch, index]
  )

  const setAmount = useCallback(
    (amount?: string) => {
      dispatch(setCreateSelectedAsset({ asset: new SelectedAsset({ ...asset, amount }), index }))
    },
    [asset, dispatch, index]
  )

  const setWalletSource = useCallback(
    (spendFromSource: SpendSource) => {
      dispatch(setCreateSelectedAsset({ asset: new SelectedAsset({ ...asset, spendFromSource }), index }))
    },
    [asset, dispatch, index]
  )

  useEffect(() => {
    setError(error)
  }, [error, setError])

  return useMemo(
    () => ({
      asset,
      setError,
      setCurrency,
      setAmount,
      setWalletSource,
    }),
    [asset, setError, setCurrency, setAmount, setWalletSource]
  )
}
