import { approveAgent } from '@nktkas/hyperliquid/api/exchange'
import { useSessionStorage } from '@sushiswap/hooks'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { AbstractWalletError } from 'node_modules/@nktkas/hyperliquid/script/src/signing/mod'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { useWalletClient } from 'wagmi'
import { useAccount } from '../wallet'
import { useExtraAgents } from './info/use-extra-agents'
import { hlHttpTransport } from './transports'

const SUSHI_AGENT_NAME = 'sushi.agent'

export const useAgent = () => {
  const address = useAccount('evm')
  const { data: walletClient } = useWalletClient()
  const {
    data: extraAgents,
    isLoading,
    error,
    refetch,
  } = useExtraAgents({ address })

  const sushiAgent = useMemo(() => {
    return extraAgents?.find((agent) => agent.name === SUSHI_AGENT_NAME)
  }, [extraAgents])

  const [storedValue, setValue, removeValue] = useSessionStorage<
    | {
        privateKey: `0x${string}`
        publicKey: `0x${string}`
        userAddress: `0x${string}`
      }
    | undefined
  >(`sushi.perps.agent.${address}`, undefined)

  const agentAccount = useMemo(() => {
    if (!storedValue || !address) return undefined
    return privateKeyToAccount(storedValue.privateKey)
  }, [storedValue, address])

  const mutation = useMutation({
    mutationFn: async ({ type }: { type: 'create' | 'remove' }) => {
      if (!walletClient || !address) {
        return
      }
      const pk = generatePrivateKey()
      const pubk = privateKeyToAddress(pk)
      const agent = pubk

      await approveAgent(
        {
          wallet: walletClient,
          transport: hlHttpTransport,
        },
        {
          agentAddress: type === 'create' ? agent : zeroAddress,
          agentName: SUSHI_AGENT_NAME,
        },
      )

      return { pk, pubk, agent, type }
    },

    onMutate: ({ type }) => {
      if (!walletClient) return
      const ts = Date.now()

      createInfoToast({
        summary: `${type === 'create' ? 'Approving' : 'Removing'} Agent`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts, type }
    },

    onSuccess: (res, _vars, ctx) => {
      if (!walletClient || !ctx || !res) return
      removeValue() //clear any existing stored agent info

      if (res.type === 'create') {
        setValue({
          privateKey: res.pk,
          publicKey: res.pubk,
          userAddress: address!,
        })
      }

      createSuccessToast({
        summary: `${ctx.type === 'create' ? 'Approved' : 'Removed'} Agent`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError) {
        message = error.message
      }
      removeValue()
      createFailedToast({
        summary:
          message ||
          `Failed to ${ctx?.type === 'create' ? 'Approve' : 'Remove'} Agent`,
        account: walletClient?.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
      })
    },
  })

  return {
    agentAccount,
    agentAddress: storedValue?.publicKey,
    createOrRemoveAgent: mutation.mutateAsync,
    sushiAgent,
    isLoadingSushiAgent: isLoading,
    sushiAgentError: error,
    refetchSushiAgent: refetch,
  }
}
