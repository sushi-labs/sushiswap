import { useQuery } from '@tanstack/react-query'
import { sz } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { type SvmAddress, isSvmAddress } from 'sushi/svm'
import { z } from 'zod'
import { HYPERUNIT_BASE_URL } from './hyper-unit-base-url'

const genResponseSchema = z.object({
  address: z.union([
    sz.evm.address(),
    z.custom<SvmAddress>((val) => typeof val === 'string' && isSvmAddress(val)),
  ]),
  status: z.string(),
  signatures: z.object({
    'field-node': z.string(),
    'hl-node': z.string(),
    'unit-node': z.string(),
  }),
})

export const useDepositAddress = ({
  address,
  chainName,
  token,
}: { address: EvmAddress | undefined; chainName: string; token: string }) => {
  return useQuery({
    queryKey: ['useDepositAddress', address, chainName, token],
    queryFn: async () => {
      const res = await fetch(
        `${HYPERUNIT_BASE_URL}/gen/${chainName}/hyperliquid/${token}/${address}`,
      )
      const data = await res.json()

      const parsed = genResponseSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error('Unable to fetch deposit address')
      }
      return parsed.data
    },

    enabled: Boolean(address && chainName && token),
  })
}
