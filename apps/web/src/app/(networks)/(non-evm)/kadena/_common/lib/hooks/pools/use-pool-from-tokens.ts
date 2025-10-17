import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { KvmTokenAddress } from 'sushi/kvm'
import { z } from 'zod'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  buildGetPoolAddress,
  buildGetPoolExists,
  buildGetTotalLpSupply,
} from '../../pact/pool'

const DecimalLike = z.union([z.number(), z.object({ decimal: z.string() })])

const TokenRef = z.object({
  refName: z.object({
    namespace: z.string().nullable(),
    name: z.string(),
  }),
})

const PoolDataSchema = z.object({
  account: z.string(),
  'mutex-locked': z.boolean(),
  leg0: z.object({
    reserve: DecimalLike,
    token: TokenRef,
  }),
  leg1: z.object({
    reserve: DecimalLike,
    token: TokenRef,
  }),
})

type PoolData = z.infer<typeof PoolDataSchema>

//@dev will use PactNumber once pactjs pkg is fixed
const normalizeReserve = (reserve: unknown): number => {
  const parsed = DecimalLike.parse(reserve)
  return typeof parsed === 'number' ? parsed : Number.parseFloat(parsed.decimal)
}

export const usePoolFromTokens = ({
  token0,
  token1,
}: {
  token0: KvmTokenAddress | undefined
  token1: KvmTokenAddress | undefined
}) => {
  return useQuery({
    queryKey: ['kadena-pool-from-tokens', token0, token1],
    queryFn: async (): Promise<PoolAddressResponse> => {
      if (!token0 || !token1) {
        return { exists: false }
      }

      //check pool existence
      const existsTx = buildGetPoolExists(token0, token1)
      const existsRes = await kadenaClient.local(existsTx, {
        preflight: false,
        signatureVerification: false,
      })
      if (existsRes.result.status !== 'success') {
        throw new Error(
          existsRes.result.error?.message || 'Failed to fetch exists',
        )
      }
      if (!existsRes.result.data) {
        return { exists: false }
      }

      // 2 + 3 in parallel
      const [poolRes, supplyRes] = await Promise.allSettled([
        kadenaClient.local(buildGetPoolAddress(token0, token1), {
          preflight: false,
          signatureVerification: false,
        }),
        kadenaClient.local(buildGetTotalLpSupply(token0, token1), {
          preflight: false,
          signatureVerification: false,
        }),
      ])

      if (poolRes.status === 'rejected') throw poolRes.reason
      if (supplyRes.status === 'rejected') throw supplyRes.reason

      if (poolRes.value.result.status !== 'success') {
        throw new Error(
          poolRes.value.result.error?.message || 'Failed to fetch pool address',
        )
      }
      if (supplyRes.value.result.status !== 'success') {
        throw new Error(
          supplyRes.value.result.error?.message || 'Failed to fetch lp supply',
        )
      }

      // Parse + transform
      const poolData = PoolDataSchema.parse(poolRes.value.result.data)
      const totalSupplyLp = normalizeReserve(supplyRes.value.result.data)

      const reserve0 = normalizeReserve(poolData.leg0.reserve)
      const reserve1 = normalizeReserve(poolData.leg1.reserve)

      const makeTokenId = (t: PoolData['leg0']['token']) => {
        const { namespace, name } = t.refName
        return `${namespace ? `${namespace}.` : ''}${name}`
      }

      const _token0 = makeTokenId(poolData.leg0.token)
      const _token1 = makeTokenId(poolData.leg1.token)

      // Rates
      const rate0to1 = reserve0 / reserve1
      const rate1to0 = reserve1 / reserve0

      // Align with input order
      let finalToken0 = _token0
      let finalToken1 = _token1
      let finalReserve0 = reserve0
      let finalReserve1 = reserve1
      let finalRate0to1 = rate0to1
      let finalRate1to0 = rate1to0

      if (token0 !== _token0 || token1 !== _token1) {
        if (token0 === _token1 && token1 === _token0) {
          finalToken0 = _token1
          finalToken1 = _token0
          finalReserve0 = reserve1
          finalReserve1 = reserve0
          finalRate0to1 = rate1to0
          finalRate1to0 = rate0to1
        } else {
          console.warn(
            'UI token order does not match contract token order and no inverse match found.',
          )
        }
      }

      return {
        exists: true,
        poolData: {
          poolAddress: poolData.account,
          token0: finalToken0 as KvmTokenAddress,
          token1: finalToken1 as KvmTokenAddress,
          reserve0: finalReserve0,
          reserve1: finalReserve1,
          mutexLocked: poolData['mutex-locked'],
          rateOfToken0ToToken1: finalRate0to1,
          rateOfToken1ToToken0: finalRate1to0,
          totalSupplyLp,
        },
      }
    },
    enabled: Boolean(token0 && token1),
    staleTime: ms('20s'),
  })
}

type PoolAddressResponse = {
  exists: boolean
  poolData?: {
    poolAddress: string
    token0: KvmTokenAddress
    token1: KvmTokenAddress
    reserve0: number
    reserve1: number
    mutexLocked: boolean
    rateOfToken0ToToken1: number
    rateOfToken1ToToken0: number
    totalSupplyLp: number
  }
}
