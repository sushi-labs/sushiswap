import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { NotificationData } from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useDeprecatedContractWrite,
  useNetwork,
  UserRejectedRequestError,
  useSignTypedData,
} from 'wagmi'

import { BENTOBOX_ADDRESS, getBentoBoxContractConfig } from './useBentoBoxContract'
import { ApprovalState } from './useERC20ApproveCallback'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApproveCallback({
  masterContract,
  watch,
  onSignature,
  onSuccess,
}: {
  masterContract?: string
  watch: boolean
  onSignature?(payload: Signature): void
  onSuccess?(data: NotificationData): void
}): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { writeAsync } = useDeprecatedContractWrite({
    ...getBentoBoxContractConfig(chain?.id),
    functionName: 'setMasterContractApproval',
    args: [address || AddressZero, masterContract, true, 0, HashZero, HashZero],
  })

  const { data: isBentoBoxApproved, isLoading } = useContractRead({
    ...getBentoBoxContractConfig(chain?.id),
    functionName: 'masterContractApproved',
    args: [masterContract, address ? address : AddressZero],
    // This should probably always be true anyway...
    watch,
    enabled: Boolean(address && masterContract !== AddressZero),
  })

  const { refetch: getNonces } = useContractRead({
    ...getBentoBoxContractConfig(chain?.id),
    functionName: 'nonces',
    args: [address ? address : AddressZero],
    enabled: false,
  })

  const [signature, setSignature] = useState<Signature>()

  const { signTypedDataAsync } = useSignTypedData()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (isLoading || isBentoBoxApproved === undefined) return ApprovalState.UNKNOWN
    if (signature && !isBentoBoxApproved) return ApprovalState.PENDING
    return isBentoBoxApproved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [isBentoBoxApproved, signature, isLoading])

  const approveBentoBox = useCallback(async (): Promise<void> => {
    if (!address) {
      console.error('no account connected')
      return
    }

    if (!chain) {
      console.error('no active chain')
      return
    }

    if (!(chain.id in BENTOBOX_ADDRESS)) {
      console.error(`no bentobox for active chain ${chain.id}`)
      return
    }

    if (!masterContract) {
      console.error('no master contract')
      return
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    const { data: nonces } = await getNonces()

    try {
      const data = await signTypedDataAsync({
        domain: {
          name: 'BentoBox V1',
          chainId: chain.id,
          verifyingContract: BENTOBOX_ADDRESS[chain.id],
        },
        types: {
          SetMasterContractApproval: [
            { name: 'warning', type: 'string' },
            { name: 'user', type: 'address' },
            { name: 'masterContract', type: 'address' },
            { name: 'approved', type: 'bool' },
            { name: 'nonce', type: 'uint256' },
          ],
        },
        value: {
          warning: 'Give FULL access to funds in (and approved to) BentoBox?',
          user: address,
          masterContract,
          approved: true,
          nonce: nonces,
        },
      })

      setSignature(splitSignature(data))
      onSignature && onSignature(splitSignature(data))
    } catch (e: unknown) {
      // Regular approval as fallback
      if (!(e instanceof UserRejectedRequestError)) {
        const data = await writeAsync()
        if (onSuccess) {
          const ts = new Date().getTime()
          onSuccess({
            type: 'approval',
            chainId: chain?.id,
            txHash: data.hash,
            promise: data.wait(),
            summary: {
              pending: `Approving BentoBox Master Contract`,
              completed: `Successfully approved the master contract`,
              failed: 'Something went wrong approving the master contract',
            },
            groupTimestamp: ts,
            timestamp: ts,
          })
        }
      }
    }
  }, [address, chain, masterContract, approvalState, getNonces, signTypedDataAsync, onSignature, writeAsync, onSuccess])

  return useMemo(() => [approvalState, signature, approveBentoBox], [approvalState, approveBentoBox, signature])
}
