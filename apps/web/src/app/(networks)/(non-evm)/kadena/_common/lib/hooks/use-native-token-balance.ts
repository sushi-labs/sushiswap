import { Pact, createClient } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'

type NativeTokenBalanceResponse = {
  chainId: number
  balance: number
}

export const useNativeTokenBalance = ({
  account,
  enabled = true,
}: {
  account: string
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-native-balance-chain1', account],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      const networkId = 'mainnet01'
      const chainId = 1

      const client = createClient(
        `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      )

      const tx = Pact.builder
        // @ts-expect-error
        .execution(Pact.modules.coin['get-balance'](account))
        .setMeta({ chainId: String(chainId) })
        .setNetworkId(networkId)
        .createTransaction()

      const res = await client.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balance')
      }

      return {
        chainId,
        balance: Number(res.result.data),
      }
    },
    enabled: !!account && enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
