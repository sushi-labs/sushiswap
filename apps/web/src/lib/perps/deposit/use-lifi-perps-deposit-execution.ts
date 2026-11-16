import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { AnyTokenAnyChainDepositChainId } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'

export interface SubmittedPerpsDeposit {
  hash: EvmTxHash
  chainId: AnyTokenAnyChainDepositChainId
  recipient: EvmAddress
  bridge: string
  amount: string
  minimumAmount: string
  sourceFailure?: 'reverted' | 'replaced'
}

export interface LifiPerpsDepositExecution {
  submitted: SubmittedPerpsDeposit | undefined
  setSubmitted: Dispatch<SetStateAction<SubmittedPerpsDeposit | undefined>>
  isSubmitting: boolean
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
}

export function useLifiPerpsDepositExecution(): LifiPerpsDepositExecution {
  const [submitted, setSubmitted] = useState<SubmittedPerpsDeposit>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  return useMemo(
    () => ({ submitted, setSubmitted, isSubmitting, setIsSubmitting }),
    [submitted, isSubmitting],
  )
}
