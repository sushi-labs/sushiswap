import type { ChainId } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'
import { Amount } from 'sushi'
import type { KvmToken, KvmTokenAddress } from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import { KADENA_CHAIN_ID } from '~kadena/_common/constants/network'
import { KVM_PAIR_TOKEN } from '~kadena/_common/constants/pair'
import { buildGetLpBalanceTx } from '../../pact/pool'
import type { PactNumberReturnType } from '../../pact/type'

type LPBalanceResponse = {
  chainId: ChainId
  balance: Amount<KvmToken>
}

export const useLpBalance = ({
  account,
  token0Address,
  token1Address,
}: {
  account: string
  token0Address: KvmTokenAddress | undefined
  token1Address: KvmTokenAddress | undefined
}) => {
  return useQuery({
    queryKey: ['kadena-lp-balance', account, token0Address, token1Address],
    queryFn: async (): Promise<LPBalanceResponse> => {
      if (!token0Address || !token1Address || !account) {
        return {
          chainId: KADENA_CHAIN_ID,
          balance: new Amount(KVM_PAIR_TOKEN, 0),
        }
      }

      const tx = buildGetLpBalanceTx(account, token0Address, token1Address)
      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balances')
      }

      const amount = res.result.data as PactNumberReturnType
      const balance =
        typeof amount === 'number' ? amount : Number.parseFloat(amount?.decimal)
      const parsedBalance = Amount.fromHuman(KVM_PAIR_TOKEN, balance)

      return {
        chainId: KADENA_CHAIN_ID,
        balance: parsedBalance,
      }
    },
    enabled: Boolean(account && token0Address && token1Address),
  })
}
