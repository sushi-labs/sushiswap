import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import { HeadlessUiModal } from 'app/components/Modal'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { useFarmListItemDetailsModal } from 'app/features/onsen/FarmListItemDetails'
import { setOnsenModalOpen } from 'app/features/onsen/onsenSlice'
import { useAppDispatch } from 'app/state/hooks'
import React, { FC } from 'react'

interface PoolRemoveLiquidityReviewContentProps {
  liquidityAmount?: CurrencyAmount<Token>
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[]
  execute(): void
  txHash?: string
}

const PoolRemoveLiquidityReviewContent: FC<PoolRemoveLiquidityReviewContentProps> = ({
  liquidityAmount,
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
        header={i18n._(t`Confirm remove liquidity`)}
        onBack={() => setContent(undefined)}
        onClose={() => dispatch(setOnsenModalOpen(false))}
      />
      <Typography variant="sm">
        {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
      </Typography>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`You are removing:`)}
        </Typography>
        <ListPanel
          items={[
            <ListPanel.CurrencyAmountItem hideCurrencyLogo={true} hideUSDC={true} amount={liquidityAmount} key={0} />,
          ]}
        />
      </HeadlessUIModal.BorderedContent>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`You'll receive (at least):`)}
        </Typography>
        <ListPanel
          items={parsedAmounts.map((parsedInputAmount, index) => (
            <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
          ))}
        />
      </HeadlessUIModal.BorderedContent>
      <Button id="btn-modal-confirm-withdrawal" color="blue" onClick={execute}>
        {i18n._(t`Confirm Withdrawal`)}
      </Button>
    </div>
  ) : (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Withdrawal Submitted`)}
      onDismiss={() => dispatch(setOnsenModalOpen(false))}
    />
  )
}

export default PoolRemoveLiquidityReviewContent
