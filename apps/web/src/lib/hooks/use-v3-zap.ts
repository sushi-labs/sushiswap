import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { isZapSupportedChainId } from 'src/config'
import { type Amount, Fraction, type Percent, sz } from 'sushi'
import {
  type EvmCurrency,
  Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
  type SushiSwapV3Pool,
} from 'sushi/evm'
import { type Address, stringify } from 'viem'
import * as z from 'zod'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { NativeAddress } from '../constants'

const txSchema = z.object({
  data: sz.hex(),
  to: sz.evm.address(),
  from: sz.evm.address(),
  value: z.string().transform((value) => BigInt(value)),
})

const outputOfCallSchema = z.object({
  useOutputOfCallAt: z.coerce.number(),
  index: z.coerce.number().optional(),
})

const bundleSchema = z.discriminatedUnion('action', [
  z.object({
    protocol: z.literal('enso'),
    action: z.literal('fee'),
    args: z.object({
      token: sz.evm.address(),
      amount: z.string(),
      bps: z.coerce.number(),
      receiver: sz.evm.address(),
    }),
  }),
  z.object({
    protocol: z.literal('enso'),
    action: z.literal('split'),
    args: z.object({
      tokenIn: z.array(sz.evm.address()),
      tokenOut: z.array(sz.evm.address()),
      amountIn: z.union([z.string(), outputOfCallSchema]),
    }),
  }),
  z.object({
    protocol: z.literal('enso'),
    action: z.literal('slippage'),
    args: z.object({
      bps: z.coerce.number(),
      amountOut: z.union([z.string(), outputOfCallSchema]),
    }),
  }),
  z.object({
    protocol: z.literal('sushiswap-v3'),
    action: z.literal('depositclmm'),
    args: z.object({
      tokenOut: z.array(sz.evm.address()),
      ticks: z.tuple([z.coerce.number().int(), z.coerce.number().int()]),
      tokenIn: z.array(sz.evm.address()),
      poolFee: z.coerce.number().int(),
      amountIn: z.array(z.union([z.string(), outputOfCallSchema])),
    }),
  }),
])

const zapResponseSchema = z.object({
  createdAt: z.number(),
  tx: txSchema,
  amountsOut: z.record(
    sz.evm.address(),
    z.string().transform((value) => BigInt(value)),
  ),
  gas: z.string().transform((value) => BigInt(value)),
  bundle: z.array(bundleSchema),
})

export type V3ZapResponse = z.infer<typeof zapResponseSchema> & {
  priceImpact: number
}

type UseV3ZapParams = {
  chainId: SushiSwapV3ChainId
  sender: Address | undefined
  receiver?: Address
  pool: SushiSwapV3Pool | undefined
  amountIn: Amount<EvmCurrency>
  slippage: Percent
  ticks: [number, number] | undefined
  query?: Omit<UseQueryOptions<V3ZapResponse>, 'queryKey' | 'queryFn'>
}

export const useV3Zap = ({ query, ...params }: UseV3ZapParams) => {
  const { data: prices } = usePrices({ chainId: params.chainId })

  return useQuery<V3ZapResponse>({
    queryKey: ['v3-zap', params, prices],
    queryKeyHashFn: stringify,
    queryFn: async () => {
      const url = new URL('/api/zap/v3', window.location.origin)

      const { chainId, sender, receiver, amountIn, slippage, ticks, pool } =
        params

      if (!sender || !pool || !ticks || !prices) throw new Error(null as never)

      url.searchParams.set('chainId', `${chainId}`)
      url.searchParams.set('sender', `${sender}`)
      url.searchParams.set(
        'tokenIn',
        amountIn.currency.isNative ? NativeAddress : amountIn.currency.address,
      )
      url.searchParams.set('tokenOut', SUSHISWAP_V3_POSITION_MANAGER[chainId])
      url.searchParams.set('amountIn', amountIn.amount.toString())
      url.searchParams.set(
        'slippage',
        slippage.mul(100n).toString({ fixed: 0 }),
      )
      url.searchParams.set('poolToken0', pool.token0.address)
      url.searchParams.set('poolToken1', pool.token1.address)
      url.searchParams.set('poolFeeTier', `${pool.fee}`)

      ticks.forEach((tick) => url.searchParams.append('ticks', `${tick}`))
      if (receiver) url.searchParams.set('receiver', `${receiver}`)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const json = await response.json()
        throw new Error(json.error)
      }

      const parsed = zapResponseSchema.parse(await response.json())

      const liquidity =
        parsed.amountsOut[
          SUSHISWAP_V3_POSITION_MANAGER[params.chainId].toLowerCase()
        ]

      if (!liquidity || liquidity === 0n)
        throw new Error('Liquidity is zero or missing')

      const inputCurrencyPrice = prices.getFraction(
        amountIn.currency.wrap().address,
      )
      const token0Price = prices.getFraction(pool.token0.address)
      const token1Price = prices.getFraction(pool.token1.address)

      const position = new Position({
        pool,
        liquidity,
        tickLower: ticks[0],
        tickUpper: ticks[1],
      })

      const amount0USD = token0Price
        ? +position.amount0.mul(token0Price).toString()
        : undefined
      const amount1USD = token1Price
        ? +position.amount1.mul(token1Price).toString()
        : undefined

      const amountOutUSD =
        typeof amount0USD !== 'undefined' && typeof amount1USD !== 'undefined'
          ? amount0USD + amount1USD
          : undefined

      let priceImpact: number | null = null // BIPS

      if (
        typeof amountOutUSD !== 'undefined' &&
        typeof inputCurrencyPrice !== 'undefined'
      ) {
        const inputUSD = +amountIn
          .mul(new Fraction({ numerator: 10_000 - 25, denominator: 10_000 }))
          .mul(inputCurrencyPrice)
          .toString()

        if (inputUSD > 0) {
          priceImpact = Math.round(
            ((inputUSD - amountOutUSD) / inputUSD) * 10_000,
          )
        }
      }

      if (priceImpact === null) throw new Error('priceImpact is NULL')

      return { ...parsed, priceImpact }
    },
    staleTime: query?.staleTime ?? 1000 * 60 * 1, // 1 minutes
    enabled:
      query?.enabled !== false &&
      Boolean(
        isZapSupportedChainId(params.chainId) &&
          params.sender &&
          params.pool &&
          params.ticks &&
          prices &&
          params.amountIn.gt(0n),
      ),
    ...query,
  })
}
