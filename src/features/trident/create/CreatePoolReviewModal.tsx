import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import TradePrice from 'app/features/legacy/swap/TradePrice'
import { selectTridentCreate, setCreateShowReview, setCreateTxHash } from 'app/features/trident/create/createSlice'
import { PoolCreationSubmittedModalContent } from 'app/features/trident/create/PoolCreationSubmittedModalContent'
import {
  useCreatePoolDerivedCurrencyAmounts,
  useCreatePoolDerivedPrice,
} from 'app/features/trident/create/useCreateDerivedState'
import { useCreatePoolExecute } from 'app/features/trident/create/useCreatePoolExecute'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback, useState } from 'react'

export const CreatePoolReviewModal: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { showReview, attemptingTxn, txHash, bentoPermit } = useAppSelector(selectTridentCreate)
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  const price = useCreatePoolDerivedPrice()
  const execute = useCreatePoolExecute()
  const [inverted, setInverted] = useState<boolean>(false)

  const _execute = useCallback(async () => {
    const tx = await execute({ parsedAmounts, bentoPermit })
    if (tx && tx.hash) {
      dispatch(setCreateTxHash(tx.hash))
    }
  }, [execute, parsedAmounts, bentoPermit, dispatch])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => dispatch(setCreateShowReview(false))}
      afterLeave={() => dispatch(setCreateTxHash(undefined))}
      unmount={false}
      maxWidth="sm"
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header
            header={i18n._(t`Confirm details`)}
            onClose={() => () => dispatch(setCreateShowReview(false))}
          />
          <Typography variant="sm">
            {i18n._(
              t`When creating a pool you are the first liquidity provider. The ratio of tokens you add will set the price of this pool.`
            )}{' '}
          </Typography>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You are creating a pool with:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((cur, index) => (
                <ListPanel.CurrencyAmountItem amount={cur} key={index} hideIfZero={true} />
              ))}
            />
          </HeadlessUIModal.BorderedContent>

          <TradePrice price={price} showInverted={inverted} setShowInverted={setInverted} className="justify-center" />
          <Button id="btn-confirm-pool-creation" color="blue" onClick={_execute} disabled={attemptingTxn}>
            {attemptingTxn ? <Dots>{i18n._(t`Transaction pending`)}</Dots> : i18n._(t`Confirm Pool Creation`)}
          </Button>
        </div>
      ) : (
        <PoolCreationSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setCreateTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}
