import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { signMasterContractApproval } from 'app/entities/KashiCooker'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useBentoMasterContractAllowed } from 'app/state/bentobox/hooks'
import { useAllTransactions, useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback, useMemo, useState } from 'react'

import { useBentoBoxContract } from './useContract'

export enum BentoApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export enum BentoApproveOutcome {
  SUCCESS,
  REJECTED,
  FAILED,
  NOT_READY,
}

const useBentoHasPendingApproval = (masterContract?: string, account?: string, contractName?: string) => {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof masterContract === 'string' &&
      typeof account === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const summary = tx.summary
          if (!summary) return false
          return summary === `Approving ${contractName} Master Contract`
        }
      }),
    [allTransactions, account, masterContract, contractName]
  )
}

export interface BentoPermit {
  outcome: BentoApproveOutcome
  signature?: Signature
  data?: string
}

export interface BentoMasterApproveCallback {
  approvalState: BentoApprovalState
  approve: () => Promise<void>
  getPermit: () => Promise<BentoPermit | undefined>
  permit: BentoPermit | undefined
}

export interface BentoMasterApproveCallbackOptions {
  otherBentoBoxContract?: Contract | null
  contractName?: string
  functionFragment?: string
}

const useBentoMasterApproveCallback = (
  masterContract: string | undefined,
  { otherBentoBoxContract, contractName, functionFragment }: BentoMasterApproveCallbackOptions
): BentoMasterApproveCallback => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()
  const addTransaction = useTransactionAdder()
  const currentAllowed = useBentoMasterContractAllowed(masterContract, account || AddressZero)
  const pendingApproval = useBentoHasPendingApproval(masterContract, account ? account : undefined, contractName)
  const [permit, setPermit] = useState<BentoPermit | undefined>()

  const approvalState: BentoApprovalState = useMemo(() => {
    if (permit) return BentoApprovalState.APPROVED
    if (pendingApproval) return BentoApprovalState.PENDING

    // We might not have enough data to know whether or not we need to approve
    if (currentAllowed === undefined) return BentoApprovalState.UNKNOWN
    if (!masterContract || !account) return BentoApprovalState.UNKNOWN
    if (!currentAllowed) return BentoApprovalState.NOT_APPROVED

    return BentoApprovalState.APPROVED
  }, [account, currentAllowed, masterContract, pendingApproval, permit])

  const getPermit = useCallback(async () => {
    if (approvalState !== BentoApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!masterContract) {
      console.error('masterContract is null')
      return
    }

    if (!account) {
      console.error('no account')
      return
    }

    try {
      const signatureString = await signMasterContractApproval(
        bentoBoxContract,
        masterContract,
        account,
        library,
        true,
        chainId
      )

      const signature = splitSignature(signatureString)
      const permit = {
        outcome: BentoApproveOutcome.SUCCESS,
        signature: splitSignature(signature),
        data: (otherBentoBoxContract || bentoBoxContract)?.interface?.encodeFunctionData(
          functionFragment || 'setMasterContractApproval',
          [account, masterContract, true, signature.v, signature.r, signature.s]
        ),
      }

      setPermit(permit)
      return permit
    } catch (e) {
      return {
        // @ts-ignore TYPE NEEDS FIXING
        outcome: e.code === USER_REJECTED_TX ? BentoApproveOutcome.REJECTED : BentoApproveOutcome.FAILED,
        signature: undefined,
        data: undefined,
      }
    }
  }, [
    account,
    approvalState,
    bentoBoxContract,
    chainId,
    functionFragment,
    library,
    masterContract,
    otherBentoBoxContract,
  ])

  const approve = useCallback(async () => {
    try {
      const tx = await (otherBentoBoxContract || bentoBoxContract)?.setMasterContractApproval(
        account,
        masterContract,
        true,
        0,
        HashZero,
        HashZero
      )

      return addTransaction(tx, {
        summary: contractName
          ? i18n._(t`Approving ${contractName} Master Contract`)
          : i18n._(t`Approving Master Contract`),
      })
    } catch (e) {}
  }, [account, addTransaction, bentoBoxContract, contractName, i18n, masterContract, otherBentoBoxContract])

  return {
    approvalState,
    approve,
    getPermit,
    permit,
  }
}

export default useBentoMasterApproveCallback
