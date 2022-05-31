import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { selectTridentCreate, setCreateBentoPermit, setCreateShowReview } from 'app/features/trident/create/createSlice'
import {
  useCreatePoolDerivedCurrencyAmounts,
  useCreatePoolDerivedInputError,
} from 'app/features/trident/create/useCreateDerivedState'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

export const SelectionContinueButton: FC = () => {
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()
  const dispatch = useAppDispatch()
  const { attemptingTxn, bentoPermit } = useAppSelector(selectTridentCreate)
  const parsedAmounts = useCreatePoolDerivedCurrencyAmounts()
  const error = useCreatePoolDerivedInputError()

  return (
    <div className="w-72">
      <TridentApproveGate
        inputAmounts={parsedAmounts}
        tokenApproveOn={bentoBox?.address}
        masterContractAddress={router?.address}
        withPermit={true}
        permit={bentoPermit}
        onPermit={(permit) => dispatch(setCreateBentoPermit(permit))}
      >
        {({ loading, approved }) => (
          <Button
            id="btn-review-confirm"
            disabled={Boolean(error) || loading || !approved}
            color="blue"
            variant="filled"
            onClick={() => !error && dispatch(setCreateShowReview(true))}
            loading={loading}
          >
            {error ? (
              error
            ) : attemptingTxn ? (
              <Dots>{i18n._(t`Transaction pending`)}</Dots>
            ) : loading ? (
              <Dots>{i18n._(t`Loading`)}</Dots>
            ) : !approved ? (
              i18n._(t`Approve to continue`)
            ) : (
              i18n._(t`Review & Confirm`)
            )}
          </Button>
        )}
      </TridentApproveGate>
    </div>
  )
}
