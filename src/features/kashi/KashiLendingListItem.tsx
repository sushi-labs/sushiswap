import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Percent, ZERO } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import GradientDot from 'app/components/GradientDot'
import Typography from 'app/components/Typography'
import KashiMediumRiskLendingPair from 'app/features/kashi/KashiMediumRiskLendingPair'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames, currencyFormatter, formatNumber, formatPercent } from 'app/functions'
import { useUSDCSubgraphValueWithLoadingIndicator } from 'app/hooks/useUSDCSubgraph'
import { useRouter } from 'next/router'
import React, { FC, memo, useMemo } from 'react'

interface KashiLendingListItem {
  market: KashiMediumRiskLendingPair
}
const KashiLendingListItem: FC<KashiLendingListItem> = ({ market }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const asset = market.asset.token
  const collateral = market.collateral.token

  const currentAllAssets = useMemo(() => CurrencyAmount.fromRawAmount(asset, market.currentAllAssets), [asset, market])

  // @ts-ignore
  const { value: currentAllAssetsUSD, loading: currentAllAssetsUSDLoading } =
    useUSDCSubgraphValueWithLoadingIndicator(currentAllAssets)

  // @ts-ignore
  const currentBorrowAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(asset, market.currentBorrowAmount),
    [asset, market]
  )
  const { value: currentBorrowAmountUSD, loading: currentBorrowAmountUSDLoading } =
    useUSDCSubgraphValueWithLoadingIndicator(currentBorrowAmount)

  // @ts-ignore
  const currentUserAssetAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(asset, market.currentUserAssetAmount),
    [asset, market]
  )

  const { value: currentUserAssetAmountUSD, loading: currentUserAssetAmountUSDLoading } =
    useUSDCSubgraphValueWithLoadingIndicator(currentUserAssetAmount)

  const currentSupplyAPR = new Percent(market.currentSupplyAPR, 1e18)

  const utilization = new Percent(market.utilization, 1e18)

  return (
    <div
      className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-6')}
      onClick={() => router.push(`/kashi/${market.address}`)}
    >
      <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 6))}>
        {asset && collateral && <CurrencyLogoArray currencies={[asset, collateral]} dense size={32} />}
        <div className="flex flex-col items-start">
          <Typography weight={700} className="flex gap-1 text-high-emphesis">
            {market.asset.token.symbol}
            <span className="text-low-emphesis">/</span>
            {market.collateral.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(1, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(currentUserAssetAmount.toSignificant(6))} {market.asset.token.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currentUserAssetAmountUSD && !currentUserAssetAmountUSDLoading
            ? currencyFormatter.format(Number(currentUserAssetAmountUSD?.toExact()))
            : '-'}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(2, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(currentBorrowAmount.toSignificant(6))} {market.asset.token.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currentBorrowAmountUSD && !currentBorrowAmountUSDLoading
            ? currencyFormatter.format(Number(currentBorrowAmountUSD?.toExact()))
            : '-'}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(currentAllAssets.toSignificant(6))} {market.asset.token.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currentAllAssetsUSD && !currentAllAssetsUSDLoading
            ? currencyFormatter.format(Number(currentAllAssetsUSD?.toExact()))
            : '-'}
        </Typography>
      </div>

      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(4, 6))}>
        <Typography weight={700} className="flex items-center text-high-emphesis">
          {formatPercent(utilization.toFixed(2))}{' '}
          {JSBI.greaterThan(utilization.numerator, ZERO) ? (
            <GradientDot percent={utilization.invert().toFixed(2)} />
          ) : null}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`utilized`)}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(5, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatPercent(currentSupplyAPR.toFixed(2))}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
    </div>
  )
}

export default memo(KashiLendingListItem)
