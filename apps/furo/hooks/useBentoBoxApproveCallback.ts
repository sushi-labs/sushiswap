import { splitSignature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import BENTOBOX_ABI from 'abis/bentobox.json'
import { ApprovalState } from 'types/approval-state'
import { Signature } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useContractRead, useNetwork, useSignTypedData } from 'wagmi'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApproveCallback(
  watch: boolean,
  masterContractAddress?: string,
): [ApprovalState, Signature, () => Promise<void>] {
  const [{ data: account }] = useAccount()
  const [{ data: network }, switchNetwork] = useNetwork()
  const chainId = network?.chain?.id
  const [{ data: isBentoBoxApproved, loading }] = useContractRead(
    {
      addressOrName: BENTOBOX_ADDRESS[chainId] ?? AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'masterContractApproved',
    {
      args: [masterContractAddress, account?.address],
      watch,
    },
  )
  const [{ data, error }, getNonces] = useContractRead(
    {
      addressOrName: BENTOBOX_ADDRESS[chainId] ?? AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'nonces',
    {
      args: [account?.address],
      skip: true,
    },
  )

  const [signature, setSignature] = useState<Signature>()

  const [, signTypedData] = useSignTypedData()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (loading || isBentoBoxApproved === undefined) return ApprovalState.UNKNOWN
    if (signature && !isBentoBoxApproved) return ApprovalState.PENDING
    return isBentoBoxApproved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [isBentoBoxApproved, signature, loading])

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
    const { data, error } = await signTypedData({
      domain: {
        name: 'BentoBox V1',
        chainId: chainId,
        verifyingContract: BENTOBOX_ADDRESS[chainId],
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
        user: account.address,
        masterContract: masterContractAddress,
        approved: true,
        nonce: nonces,
      },
    })
    console.log('signed ', { data, error })
    // TODO: if loading, set pending status
    setSignature(splitSignature(data))
  }, [account?.address, approvalState, getNonces, chainId, masterContractAddress, signTypedData])

  return [approvalState, signature, approveBentoBox]
}
