import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useSignTypedData,
} from 'wagmi'
import { HashZero } from '@ethersproject/constants'
import { useCallback, useMemo, useState } from 'react'
import { SendTransactionResult } from 'wagmi/actions'
import { createErrorToast, createFailedToast, createToast } from '@sushiswap/ui/components/toast'
import { useQuery } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'
import { getBentoBoxContractConfig } from '../../../../hooks'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { splitSignature } from '@ethersproject/bytes'
import { useSignature } from '../../../systems/Checker/Provider'
import { ApprovalState } from '../../approvals'

interface UseBentoboxApprovalParams {
  enabled?: boolean
  chainId: BentoBoxV1ChainId
  masterContract?: Address
  tag: string
}

export const useBentoboxApproval = ({
  enabled = true,
  chainId,
  masterContract,
  tag,
}: UseBentoboxApprovalParams): [ApprovalState, undefined | (() => void)] => {
  const { address } = useAccount()
  const [fallback, setFallback] = useState(false)
  const [pending, setPending] = useState(false)
  const { signature, setSignature } = useSignature(tag)
  const { signTypedDataAsync } = useSignTypedData()

  const { data, refetch, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      if (masterContract && address) {
        const isApproved = await readContract({
          ...getBentoBoxContractConfig(chainId),
          chainId,
          functionName: 'masterContractApproved',
          args: [masterContract, address],
        })

        if (!isApproved) {
          const nonces = await readContract({
            ...getBentoBoxContractConfig(chainId),
            chainId,
            functionName: 'nonces',
            args: [address],
          })

          return { isApproved, nonces }
        }
        return { isApproved, nonces: undefined }
      }

      return null
    },
    enabled,
  })

  const { config } = usePrepareContractWrite({
    ...getBentoBoxContractConfig(chainId),
    chainId,
    functionName: 'setMasterContractApproval',
    args: masterContract && address ? [address, masterContract, true, 0, HashZero, HashZero] : undefined,
    enabled: Boolean(enabled && masterContract && address && chainId && fallback),
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, e: Error | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          createErrorToast(e.message, true)
        }
      }

      if (data) {
        setPending(true)

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
      }
    },
    [address, chainId]
  )

  const execute = useContractWrite({
    ...config,
    onSettled,
    onSuccess: (data) => {
      data
        .wait()
        .then(() => {
          refetch().then(() => {
            setPending(false)
          })
        })
        .catch(() => setPending(false))
    },
  })

  const _execute = useCallback(() => {
    if (address && data?.nonces) {
      signTypedDataAsync({
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
          nonce: data.nonces,
        },
      })
        .then((data) => {
          const signature = splitSignature(data)
          setSignature(signature)
        })

        .catch(() => {
          const ts = new Date().getTime()
          void createFailedToast({
            account: address,
            type: 'approval',
            chainId,
            summary: 'Failed to approve using a permit, please try again using a regular approval.',
            groupTimestamp: ts,
            timestamp: ts,
          })

          setFallback(true)
        })
    }
  }, [address, chainId, data?.nonces, masterContract, setSignature, signTypedDataAsync])

  return useMemo(() => {
    let state = ApprovalState.UNKNOWN
    if (signature) state = ApprovalState.APPROVED
    else if (data && data.isApproved) state = ApprovalState.APPROVED
    else if (pending) state = ApprovalState.PENDING
    else if (isLoading) state = ApprovalState.LOADING

    return [state, fallback ? execute.write : _execute]
  }, [_execute, data, execute.write, fallback, isLoading, pending, signature])
}
