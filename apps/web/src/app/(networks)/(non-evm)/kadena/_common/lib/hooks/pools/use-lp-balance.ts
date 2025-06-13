import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetLpBalanceTx } from '../../pact/pool'

type LPBalanceResponse = {
  chainId: number
  balance: number
}

export const useLpBalance = ({
  account,
  token0Address,
  token1Address,
}: {
  account: string
  token0Address?: string
  token1Address?: string
}) => {
  return useQuery({
    queryKey: ['kadena-lp-balance', account, token0Address, token1Address],
    queryFn: async (): Promise<LPBalanceResponse> => {
      if (!token0Address || !token1Address || !account) {
        return {
          chainId: KADENA_CHAIN_ID,
          balance: 0,
        }
      }

      const tx = buildGetLpBalanceTx(
        account,
        token0Address,
        token1Address,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })
      console.log(res)
      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balances')
      }
      const balance = res.result.data ?? 0

      return {
        chainId: KADENA_CHAIN_ID,
        balance: balance,
      }
    },
    enabled: !!account && !!token0Address && !!token1Address,
  })
}
