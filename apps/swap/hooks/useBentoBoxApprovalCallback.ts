import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import BENTOBOX_ABI from 'abis/bentobox.json'
import { BENTOBOX_ADDRESS } from 'config'
import { useCallback, useMemo, useState } from 'react'
import { useContractRead, useSignTypedData } from 'wagmi'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApprovalCallback(
  chainId?: number,
  user?: string,
  masterContract?: string,
): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { data: isBentoBoxApproved, isLoading } = useContractRead(
    {
      addressOrName: chainId ? BENTOBOX_ADDRESS[chainId] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'masterContractApproved',
    {
      args: [masterContract, user],
      watch: true,
    },
  )
  const { data: nonce } = useContractRead(
    {
      addressOrName: chainId ? BENTOBOX_ADDRESS[chainId] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'nonces',
    {
      args: [user],
      watch: true,
    },
  )

  const [signature, setSignature] = useState<Signature>()

  const { signTypedDataAsync } = useSignTypedData()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (isLoading || isBentoBoxApproved === undefined) return ApprovalState.UNKNOWN
    if (signature && !isBentoBoxApproved) return ApprovalState.PENDING
    return isBentoBoxApproved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [isBentoBoxApproved, signature, isLoading])

  const approveBentoBox = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('set master contract approval was called unnecessarily')
      return
    }
    if (!masterContract) {
      console.error('no master contract address')
      return
    }

    if (!nonce) {
      console.error('no nonce')
      return
    }

    console.log({
      domain: {
        name: 'BentoBox V1',
        chainId,
        verifyingContract: chainId ? BENTOBOX_ADDRESS[chainId] : undefined,
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
        user,
        masterContract,
        approved: true,
        nonce,
      },
    })

    // EIP712Domain: [
    //   { name: 'name', type: 'string' },
    //   { name: 'chainId', type: 'uint256' },
    //   { name: 'verifyingContract', type: 'address' },
    // ],
    // SetMasterContractApproval: [
    //   { name: 'warning', type: 'string' },
    //   { name: 'user', type: 'address' },
    //   { name: 'masterContract', type: 'address' },
    //   { name: 'approved', type: 'bool' },
    //   { name: 'nonce', type: 'uint256' },
    // ],

    const data = await signTypedDataAsync({
      domain: {
        name: 'BentoBox V1',
        chainId,
        verifyingContract: chainId ? BENTOBOX_ADDRESS[chainId] : undefined,
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
        user,
        masterContract,
        approved: true,
        nonce,
      },
    })
    console.log('signature ', { data })
    // TODO: if loading, set pending status
    const signature = splitSignature(data)
    console.log('signed ', { signature })
    setSignature(signature)
  }, [approvalState, masterContract, nonce, signTypedDataAsync, chainId, user])

  return [approvalState, signature, approveBentoBox]
}
