import { ChevronRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { RestrictedIcon } from 'app/components/Icon'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import CommitSubmittedModalContent from 'app/features/miso/CommitSubmittedModalContent'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { AuctionTitleByTemplateId, MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import React, { FC, useCallback, useState } from 'react'

import { Auction } from './context/Auction'

interface CommitReviewStandardModalProps {
  auction: Auction
  open: boolean
  onDismiss(): void
  amount?: CurrencyAmount<Currency>
}

const CommitReviewStandardModal: FC<CommitReviewStandardModalProps> = ({
  auction,
  open,
  onDismiss: _onDismiss,
  amount,
}) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const addTransaction = useTransactionAdder()
  const contract = useContract(
    auction?.auctionInfo.addr,
    chainId && auction ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )

  const reset = useCallback(() => {
    if (!attemptingTxn) {
      setTxHash(undefined)
      setError(undefined)
    }
  }, [attemptingTxn])

  const onDismiss = useCallback(() => {
    reset()
    _onDismiss()
  }, [_onDismiss, reset])

  const execute = useCallback(async () => {
    if (!contract || !amount || !amount.greaterThan(ZERO)) return

    setAttemptingTxn(true)

    try {
      let tx
      if (auction.paymentToken.isNative) {
        tx = await contract.commitEth(account, true, { value: amount.quotient.toString() })
      } else {
        tx = await contract.commitTokens(amount.quotient.toString(), true)
      }

      setTxHash(tx.hash)
      await tx.wait()

      addTransaction(tx, {
        summary: i18n._(t`Committed ${amount?.toSignificant(6)} ${amount.currency.symbol}`),
      })
    } catch (e) {
      // @ts-ignore TYPE NEEDS FIXING
      setError(e.error?.message)
    } finally {
      setAttemptingTxn(false)
    }
  }, [account, addTransaction, amount, auction.paymentToken.isNative, contract, i18n])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <>
          <HeadlessUIModal.Body>
            <HeadlessUIModal.Header
              header={i18n._(t`Participate`)}
              subheader={
                auction.template === AuctionTemplate.DUTCH_AUCTION
                  ? i18n._(t`Your commitment is for the minimum amount of tokens. As the auction price drops, your commitment
                    will entitle you to claim even more tokens at the end. Final price per token is determined at the end
                    of the auction. Everyone who commits before the end of a successful auction, claims tokens at same
                    final price.`)
                  : undefined
              }
            />
            <HeadlessUIModal.Content>
              <div className="flex flex-col gap-6 mb-6">
                <div className="flex gap-4 items-center mt-2">
                  {auction.auctionDocuments.category && <Chip label={auction.auctionDocuments.category} color="blue" />}
                  {auction && (
                    <div className="flex gap-1.5">
                      <AuctionIcon auctionTemplate={auction.template} width={18} />
                      <Typography variant="sm" className="text-secondary">
                        {/*@ts-ignore TYPE NEEDS FIXING*/}
                        {AuctionTitleByTemplateId(i18n)[auction.template]}
                      </Typography>
                    </div>
                  )}

                  <div className="flex gap-1.5">
                    <RestrictedIcon width={18} />
                    <Typography variant="sm" className="text-secondary">
                      {i18n._(t`Restricted`)}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col gap-3 bg-dark-900 border border-dark-700 rounded p-5">
                  <Typography className="text-low-emphesis">{i18n._(t`You are committing`)}</Typography>
                  <div className="flex items-center gap-3 border-dark-700">
                    <CurrencyLogo currency={amount?.currency} size={32} className="!rounded-full overflow-hidden" />
                    <div className="flex gap-2 items-baseline">
                      <Typography variant="lg" className="text-right text-high-emphesis" weight={700}>
                        {amount?.toSignificant(6)}
                      </Typography>
                      <Typography className="text-secondary" weight={700}>
                        {amount?.currency.symbol}
                      </Typography>
                    </div>
                    {auction.template !== AuctionTemplate.BATCH_AUCTION && (
                      <>
                        <ChevronRightIcon width={20} className="text-secondary" />
                        {amount?.greaterThan(ZERO) && (
                          <div className="flex gap-2 items-baseline">
                            <Typography variant="lg" className="text-right text-high-emphesis" weight={700}>
                              {auction.tokenAmount(amount)?.toSignificant(6)}
                            </Typography>
                            <Typography className="text-secondary" weight={700}>
                              {auction.tokenAmount(amount)?.currency.symbol}
                            </Typography>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </HeadlessUIModal.Content>
            <HeadlessUIModal.Actions>
              <HeadlessUIModal.Action onClick={onDismiss}>{i18n._(t`Cancel`)}</HeadlessUIModal.Action>
              <HeadlessUIModal.Action main={true} disabled={attemptingTxn} onClick={execute}>
                {i18n._(t`Confirm Commit`)}
              </HeadlessUIModal.Action>
            </HeadlessUIModal.Actions>
            <HeadlessUIModal.Error>{error}</HeadlessUIModal.Error>
          </HeadlessUIModal.Body>
        </>
      ) : (
        <CommitSubmittedModalContent txHash={txHash} onDismiss={onDismiss} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default CommitReviewStandardModal
