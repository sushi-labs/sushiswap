import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { getBentoBoxContractConfig } from './useBentoBoxContract'
import { useCallback, useMemo, useState } from 'react'
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useSignTypedData,
  useWaitForTransaction,
} from 'wagmi'

import { ApprovalState } from './useERC20ApproveCallback'
import { isAddress } from '@ethersproject/address'
import { bentoBoxV1Address, BentoBoxV1ChainId, isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { createToast } from '@sushiswap/ui/future/components/toast'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApproveCallback({
  chainId,
  masterContract,
  watch = true,
  onSignature,
  enabled = true,
}: {
  chainId: BentoBoxV1ChainId | undefined
  masterContract?: Address
  watch?: boolean
  onSignature?(payload: Signature): void
  enabled?: boolean
}): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { address, connector } = useAccount()
  const [signature, setSignature] = useState<Signature>()

  const { config } = usePrepareContractWrite({
    ...(chainId ? getBentoBoxContractConfig(chainId) : {}),
    chainId,
    functionName: 'setMasterContractApproval',
    args: !!masterContract && !!address ? [address, masterContract, true, 0, HashZero, HashZero] : undefined,
    enabled: Boolean(enabled && !!masterContract && !!address && chainId),
  })

  const { writeAsync, data, isLoading: isWritePending } = useContractWrite(config)
  const { isLoading: isWaitPending } = useWaitForTransaction({
    hash: data?.hash,
  })

  const { data: isBentoBoxApproved, isLoading } = useContractRead({
    ...(chainId ? getBentoBoxContractConfig(chainId) : {}),
    chainId,
    functionName: 'masterContractApproved',
    args: !!masterContract && !!address ? [masterContract, address] : undefined,
    // This should probably always be true anyway...
    watch,
    enabled: enabled && !!masterContract && !!address && masterContract !== AddressZero && !!chainId,
  })

  const { refetch: getNonces } = useContractRead({
    ...(chainId ? getBentoBoxContractConfig(chainId) : {}),
    chainId,
    functionName: 'nonces',
    args: address ? [address] : undefined,
    enabled: isAddress(address as string) && !!chainId,
  })

  const { signTypedDataAsync } = useSignTypedData()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (isLoading) return ApprovalState.LOADING
    if (isBentoBoxApproved === undefined) return ApprovalState.UNKNOWN
    if ((signature && !isBentoBoxApproved) || isWritePending || isWaitPending) return ApprovalState.PENDING
    return isBentoBoxApproved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [isLoading, isBentoBoxApproved, signature, isWritePending, isWaitPending])

  const legacyApproval = useCallback(async () => {
    if (
      !address ||
      !(chainId && isBentoBoxV1ChainId(chainId)) ||
      !masterContract ||
      approvalState !== ApprovalState.NOT_APPROVED ||
      !writeAsync
    ) {
      return
    }

    const data = await writeAsync()
    const ts = new Date().getTime()
    void createToast({
      account: address,
      type: 'approval',
      chainId,
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
  }, [address, approvalState, chainId, masterContract, writeAsync])

  const approveBentoBox = useCallback(async (): Promise<void> => {
    if (
      !address ||
      !(chainId && isBentoBoxV1ChainId(chainId)) ||
      !masterContract ||
      approvalState !== ApprovalState.NOT_APPROVED
    ) {
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

    // Use regular approvals for safe apps
    if (connector && connector.id === 'safe') {
      return await legacyApproval()
    }

    const { data: nonces } = await getNonces()

    if (!nonces) {
      console.error('nonces could not be fetched')
      return
    }

    try {
      const data = await signTypedDataAsync({
        domain: {
          name: 'BentoBox V1',
          chainId,
          verifyingContract: bentoBoxV1Address[chainId],
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
          masterContract: masterContract as Address,
          approved: true,
          nonce: nonces,
        },
      })
      setSignature(splitSignature(data))
      onSignature && onSignature(splitSignature(data))
    } catch (e: unknown) {
      if (e instanceof UserRejectedRequestError) return
      console.error('Error approving BentoBox, attempting regular approval instead', e)
      await legacyApproval()
    }
  }, [
    address,
    chainId,
    masterContract,
    approvalState,
    connector,
    getNonces,
    legacyApproval,
    signTypedDataAsync,
    onSignature,
  ])

  return useMemo(() => [approvalState, signature, approveBentoBox], [approvalState, approveBentoBox, signature])
}
