import { splitSignature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import bentoBoxArtifact from '@sushiswap/bentobox/artifacts/contracts/BentoBox.sol/BentoBox.json'
import { Signature } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useContractRead, useNetwork, useSignTypedData } from 'wagmi'

import { ApprovalState } from './useApproveCallback'
import { BENTOBOX_ADDRESS } from './useBentoBoxContract'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useBentoBoxApproveCallback({
  masterContract,
  watch,
}: {
  masterContract?: string
  watch: boolean
}): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  const { data: isBentoBoxApproved, isLoading } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : AddressZero,
      contractInterface: bentoBoxArtifact.abi,
    },
    'masterContractApproved',
    {
      args: [masterContract, account ? account.address : AddressZero],
      // This should probably always be true anyway...
      watch,
      enabled: Boolean(account),
    }
  )
  const { error, refetch: getNonces } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain?.id] : AddressZero,
      contractInterface: bentoBoxArtifact.abi,
    },
    'nonces',
    {
      args: [account ? account.address : AddressZero],
      enabled: false,
    }
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
    if (!activeChain) {
      console.error('no active chain')
      return
    }

    if (!(activeChain.id in BENTOBOX_ADDRESS)) {
      console.error('no bentobox for active chain ' + activeChain.id)
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

    const data = await signTypedDataAsync({
      domain: {
        name: 'BentoBox V1',
        chainId: activeChain.id,
        verifyingContract: BENTOBOX_ADDRESS[activeChain.id],
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
        masterContract,
        approved: true,
        nonce: nonces,
      },
    })
    console.log('signed ', { data, error })
    // TODO: if loading, set pending status
    setSignature(splitSignature(data))
  }, [approvalState, masterContract, activeChain, getNonces, signTypedDataAsync, account?.address, error])

  return [approvalState, signature, approveBentoBox]
}
