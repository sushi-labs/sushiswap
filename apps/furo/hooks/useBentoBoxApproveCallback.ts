import { splitSignature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import BENTOBOX_ABI from 'abis/bentobox.json'
import { Signature } from 'ethers'
import { ApprovalState } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useContractRead, useNetwork, useSignTypedData } from 'wagmi'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApproveCallback(
  watch: boolean,
  masterContractAddress?: string,
): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  const { data: isBentoBoxApproved, isLoading } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'masterContractApproved',
    {
      args: [masterContractAddress, account?.address],
      watch,
    },
  )
  const { error, refetch: getNonces } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'nonces',
    {
      args: [account?.address],
      enabled: false,
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
      console.error('approve was called unnecessarily')
      return
    }
    if (!masterContractAddress) {
      console.error('no address')
      return
    }

    const { data: nonces } = await getNonces()
    const data = await signTypedDataAsync({
      domain: {
        name: 'BentoBox V1',
        chainId: chainId,
        verifyingContract: activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
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
        user: account?.address,
        masterContract: masterContractAddress,
        approved: true,
        nonce: nonces,
      },
    })
    console.log('signed ', { data, error })
    // TODO: if loading, set pending status
    setSignature(splitSignature(data))
  }, [
    approvalState,
    masterContractAddress,
    getNonces,
    signTypedDataAsync,
    chainId,
    activeChain?.id,
    account?.address,
    error,
  ])

  return [approvalState, signature, approveBentoBox]
}
