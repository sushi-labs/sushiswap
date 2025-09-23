import type { ChainId } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { Amount } from 'sushi'
import type { KvmToken } from 'sushi/kvm'
import { parseUnits } from 'viem'
import { kadenaClient } from '~kadena/_common/constants/client'
import { KADENA_CHAIN_ID } from '~kadena/_common/constants/network'
import { KADENA } from '~kadena/_common/constants/token-list'
import { buildGetBalanceTx } from '../pact/builders'
import type { PactNumberReturnType } from '../pact/type'

type NativeTokenBalanceResponse = {
  chainId: ChainId
  balance: Amount<KvmToken>
}

export const useNativeTokenBalance = ({
  account,
  enabled = true,
}: { account: string; enabled: boolean }) => {
  return useQuery({
    queryKey: ['kadena-native-balance', account],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      const tx = buildGetBalanceTx(account)
      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(
          res.result.error?.message || 'Failed to fetch KDA balance',
        )
      }

      const amount = res.result.data as PactNumberReturnType

      const balance =
        typeof amount === 'object' ? Number.parseFloat(amount.decimal) : amount

      const parsedAmount = parseUnits(balance.toString(), KADENA.decimals)

      return {
        chainId: KADENA_CHAIN_ID,
        balance: new Amount(KADENA, parsedAmount),
      }
    },
    enabled: !!account && enabled,
    staleTime: ms('10s'),
    gcTime: ms('1m'),
  })
}
