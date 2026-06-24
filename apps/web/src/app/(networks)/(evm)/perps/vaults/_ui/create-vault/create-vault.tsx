'use client'
import { useState } from 'react'
import { CreateSuccessDialog } from './create-success-dialog'
import { CreateVaultDialog } from './create-vault-dialog'

export const CreateVault = () => {
  const [isCreated, setIsCreated] = useState(false)

  return (
    <>
      <CreateVaultDialog
        onSuccess={() => {
          setIsCreated(true)
        }}
      />
      {isCreated ? <CreateSuccessDialog /> : null}
    </>
  )
}
