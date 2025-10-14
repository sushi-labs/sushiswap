import { PactNumber } from '@kadena/pactjs'
import { useQuery } from '@tanstack/react-query'
import type { KvmTokenAddress } from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import { buildGetTokenPrecision } from '~kadena/_common/lib/pact/builders'

export const useTokenPrecision = ({
  tokenContract,
}: { tokenContract: KvmTokenAddress | undefined }) => {
  return useQuery({
    queryKey: ['kadena-token-info', tokenContract],
    queryFn: async (): Promise<number> => {
      if (!tokenContract) {
        throw new Error('Token contract is required')
      }

      const tx = buildGetTokenPrecision(tokenContract)

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(
          res.result.error?.message || 'Failed to fetch token info',
        )
      }

      const decimals = new PactNumber(
        res?.result?.data as { int: string },
      ).toNumber()

      return decimals
    },
    enabled: Boolean(tokenContract),
  })
}
