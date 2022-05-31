import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import { HeadlessUiModal } from 'app/components/Modal'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { useFarmListItemDetailsModal } from 'app/features/onsen/FarmListItemDetails'
import { setOnsenModalOpen } from 'app/features/onsen/onsenSlice'
import { useAppDispatch } from 'app/state/hooks'
import { Field } from 'app/state/mint/actions'
import React, { FC } from 'react'

interface PoolAddLiquidityReviewContentProps {
  noLiquidity?: boolean
  liquidityMinted?: CurrencyAmount<Token>
  poolShare?: Percent
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  execute(): void
  txHash?: string
}

const PoolAddLiquidityReviewContent: FC<PoolAddLiquidityReviewContentProps> = ({
  noLiquidity,
  liquidityMinted,
  poolShare,
  parsedAmounts,
  execute,
  txHash,
}) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { setContent } = useFarmListItemDetailsModal()

  return !txHash ? (
    <div className="flex flex-col gap-4">
      <HeadlessUIModal.Header
        header={noLiquidity ? i18n._(t`Confirm create pool`) : i18n._(t`Confirm add liquidity`)}
        onBack={() => setContent(undefined)}
        onClose={() => dispatch(setOnsenModalOpen(false))}
      />
      <Typography variant="sm">
        {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
      </Typography>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`You are depositing:`)}
        </Typography>
        <ListPanel
          items={Object.values(parsedAmounts).map((cur, index) => (
            <ListPanel.CurrencyAmountItem amount={cur} key={index} />
          ))}
        />
      </HeadlessUIModal.BorderedContent>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`You'll receive (at least):`)}
        </Typography>
        <Typography weight={700} variant="lg" className="text-high-emphesis">
          {liquidityMinted?.toSignificant(6)} SLP
        </Typography>
      </HeadlessUIModal.BorderedContent>
      <div className="flex justify-between px-2 py-1">
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Share of Pool`)}
        </Typography>
        <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
          {poolShare?.greaterThan(0) ? poolShare?.toSignificant(6) : '0.000'}%
        </Typography>
      </div>
      <div className="flex flex-grow" />
      <Button id={`btn-modal-confirm-deposit`} color="blue" onClick={execute}>
        {i18n._(t`Confirm Deposit`)}
      </Button>
    </div>
  ) : (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Deposit Submitted`)}
      onDismiss={() => dispatch(setOnsenModalOpen(false))}
    />
  )
}

export default PoolAddLiquidityReviewContent
