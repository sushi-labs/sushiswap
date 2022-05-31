import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import { resetMigrationState, selectMigrationTx } from 'app/features/trident/migrate/context/migrateSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React from 'react'

export const MigrationTransactionModal = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const tx = useAppSelector(selectMigrationTx)

  const resetAndRedirect = () => {
    dispatch(resetMigrationState())
    router.replace('/trident/migrate')
  }

  return (
    <HeadlessUIModal.Controlled
      isOpen={Boolean(tx)}
      onDismiss={() => undefined} // To discourage quick dismissals
    >
      <HeadlessUIModal.SubmittedModalContent
        onDismiss={resetAndRedirect}
        header={i18n._(t`Migration Transaction`)}
        txHash={tx}
      />
    </HeadlessUIModal.Controlled>
  )
}
