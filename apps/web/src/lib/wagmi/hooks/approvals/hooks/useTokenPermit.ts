'use client'

import type { TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { Amount } from 'sushi'
import { type EvmChainId, type EvmCurrency, eip2612Abi_nonces } from 'sushi/evm'
import { type Address, hexToSignature } from 'viem'
import { useConnection, useReadContract, useSignTypedData } from 'wagmi'
import {
  useApprovedActions,
  useSignature,
} from '../../../systems/Checker/provider'
import { useTransactionDeadline } from '../../utils/hooks/useTransactionDeadline'
import { ApprovalState } from './useTokenApproval'

export enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

export interface PermitInfo {
  type: PermitType
  name: string
  // version is optional, and if omitted, will not be included in the domain
  version?: string
}

const EIP712_DOMAIN_TYPE = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
] as const

const EIP712_DOMAIN_TYPE_NO_VERSION = [
  { name: 'name', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const EIP2612_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

const PERMIT_ALLOWED_TYPE = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' },
]

interface UseTokenPermitParams {
  spender: Address | undefined
  amount: Amount<EvmCurrency> | undefined
  enabled?: boolean
  permitInfo: PermitInfo
  ttlStorageKey: TTLStorageKey
  tag: string
}

export const useTokenPermit = ({
  amount,
  spender,
  enabled = true,
  permitInfo,
  ttlStorageKey,
  tag,
}: UseTokenPermitParams) => {
  const { address, chainId } = useConnection()

  const [pending, setPending] = useState(false)

  const { signature } = useSignature(tag)

  const { setSignature } = useApprovedActions(tag)

  const { signTypedDataAsync } = useSignTypedData()

  const { data: transactionDeadline } = useTransactionDeadline({
    chainId: chainId as EvmChainId,
    storageKey: ttlStorageKey,
    enabled,
  })

  const { data: nonce, isLoading: isNonceLoading } = useReadContract({
    address: amount?.currency.wrap().address,
    abi: eip2612Abi_nonces,
    functionName: 'nonces',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(enabled && amount && address),
    },
  })

  const onPermit = useCallback(async () => {
    if (!amount || !transactionDeadline || !chainId) return

    setPending(true)

    const allowed = permitInfo.type === PermitType.ALLOWED
    const types = {
      EIP712Domain: permitInfo.version
        ? EIP712_DOMAIN_TYPE
        : EIP712_DOMAIN_TYPE_NO_VERSION,
      Permit: allowed ? PERMIT_ALLOWED_TYPE : EIP2612_TYPE,
    }
    const domain = permitInfo.version
      ? {
          name: permitInfo.name,
          version: permitInfo.version,
          chainId: chainId,
          verifyingContract: amount.currency.wrap().address,
        }
      : ({
          name: permitInfo.name,
          chainId: chainId,
          verifyingContract: amount.currency.wrap().address,
        } as any)
    const message = allowed
      ? {
          holder: address,
          spender,
          allowed,
          nonce,
          expiry: transactionDeadline,
        }
      : {
          owner: address,
          spender,
          value: amount.amount,
          nonce,
          deadline: transactionDeadline,
        }

    try {
      const signedData = await signTypedDataAsync({
        account: address,
        primaryType: 'Permit',
        types,
        domain,
        message,
      })

      setSignature({ ...hexToSignature(signedData), message, domain })
    } catch (e) {
      if (e instanceof Error) {
        if (!isUserRejectedError(e)) {
          createErrorToast(e.message, true)
        }
      }
    } finally {
      setPending(false)
    }
  }, [
    amount,
    transactionDeadline,
    permitInfo,
    chainId,
    spender,
    address,
    signTypedDataAsync,
    setSignature,
    nonce,
  ])

  const isSignatureDataValid =
    transactionDeadline &&
    amount &&
    signature?.domain?.verifyingContract === amount.currency.wrap().address &&
    signature?.message &&
    signature.message.owner === address &&
    signature.message.nonce === nonce &&
    signature.message.spender === spender &&
    ('allowed' in signature.message ||
      (signature.message.value as bigint) === amount.amount) &&
    (('deadline' in signature.message &&
      (signature.message.deadline as bigint) >=
        Math.floor(Date.now() / 1000)) ||
      ('expiry' in signature.message &&
        (signature.message.expiry as bigint) >= Math.floor(Date.now() / 1000)))

  return useMemo<[ApprovalState, { write: undefined | (() => void) }]>(() => {
    let state = ApprovalState.UNKNOWN
    if (isSignatureDataValid) state = ApprovalState.APPROVED
    else if (pending) state = ApprovalState.PENDING
    else if (isNonceLoading) state = ApprovalState.LOADING
    else state = ApprovalState.NOT_APPROVED

    return [state, { write: onPermit }]
  }, [pending, isNonceLoading, isSignatureDataValid, onPermit])
}
