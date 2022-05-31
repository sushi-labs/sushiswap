import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import SubmittedModalContent from 'app/components/Modal/SubmittedModalContent'
import Typography from 'app/components/Typography'
import { KashiMarketDetailsView, useBorrowExecute, useKashiMarket } from 'app/features/kashi/KashiMarket'
import { KashiMarketBorrowButtonProps } from 'app/features/kashi/KashiMarket/KashiMarketBorrowView/KashiMarketBorrowButton'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import React, { FC, useCallback, useState } from 'react'

interface KashiMarketBorrowReviewModal
  extends Omit<KashiMarketBorrowButtonProps, 'nextMaxBorrowMinimum' | 'nextMaxBorrowSafe' | 'nextMaxBorrowPossible'> {
  open: boolean
  onDismiss(): void
  permit?: Signature
}

export const KashiMarketBorrowReviewModal: FC<KashiMarketBorrowReviewModal> = ({
  spendFromWallet,
  receiveInWallet,
  permit,
  leveraged,
  collateralAmount,
  borrowAmount,
  open,
  onDismiss,
  view,
  priceImpact,
}) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const execute = useBorrowExecute()
  const trade = useV2TradeExactIn(borrowAmount, collateralAmount?.currency, { maxHops: 3 }) ?? undefined

  const _execute = useCallback(async () => {
    setAttemptingTxn(true)

    try {
      const tx = await execute({
        spendFromWallet,
        receiveInWallet,
        permit,
        leveraged,
        trade,
        collateralAmount,
        borrowAmount,
      })

      if (tx?.hash) {
        setTxHash(tx.hash)
      }
    } finally {
      setAttemptingTxn(false)
    }
  }, [borrowAmount, collateralAmount, execute, leveraged, permit, receiveInWallet, spendFromWallet, trade])

  return (
    <HeadlessUiModal.Controlled
      isOpen={open}
      onDismiss={onDismiss}
      maxWidth="md"
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm Borrow`)} onClose={onDismiss} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40 !border-dark-700">
            <div className="flex flex-col gap-2">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`You will deposit collateral`)}
              </Typography>
              <div className="inline-flex gap-2">
                <CurrencyLogo currency={market.collateral.token} size={20} />
                <Typography weight={700} component="span" className="text-high-emphesis">
                  {collateralAmount?.toSignificant(6) || 0}{' '}
                  <Typography weight={700} className="text-low-emphesis" component="span">
                    {collateralAmount?.currency.symbol}
                  </Typography>
                </Typography>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`To borrow`)}{' '}
              </Typography>
              <div className="inline-flex gap-2">
                <CurrencyLogo currency={market.asset.token} size={20} />
                <Typography weight={700} component="span" className="text-high-emphesis">
                  {borrowAmount?.toSignificant(6) || 0}{' '}
                  <Typography weight={700} className="text-low-emphesis" component="span">
                    {borrowAmount?.currency.symbol}
                  </Typography>
                </Typography>
              </div>
            </div>
          </HeadlessUiModal.BorderedContent>
          <KashiMarketDetailsView
            priceImpact={priceImpact}
            trade={trade}
            view={view}
            collateralAmount={collateralAmount}
            borrowAmount={borrowAmount}
          />
          <Button loading={attemptingTxn} color="gradient" disabled={attemptingTxn} onClick={_execute}>
            {i18n._(t`Confirm Borrow`)}
          </Button>
        </div>
      ) : (
        <SubmittedModalContent
          header={i18n._(t`Success!`)}
          subheader={i18n._(t`Success! Borrow Submitted`)}
          txHash={txHash}
          onDismiss={onDismiss}
        />
      )}
    </HeadlessUiModal.Controlled>
  )
}
