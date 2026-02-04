import type { NextRequest } from 'next/server'
import {
  UI_FEE_BIPS,
  type ZapSupportedChainId,
  isZapSupportedChainId,
} from 'src/config'
import { sz } from 'sushi'
import {
  SushiSwapV3FeeAmount,
  TickMath,
  UI_FEE_COLLECTOR_ADDRESS,
} from 'sushi/evm'
import * as z from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine((chainId) => isZapSupportedChainId(chainId), {
      message: 'chainId must exist in EnsoSupportedChainId',
    })
    .transform((chainId) => chainId as ZapSupportedChainId),
  routingStrategy: z
    .enum(['ensowallet', 'router', 'delegate'])
    .default('router'),
  sender: sz.evm.address(),
  receiver: sz.evm.address().optional(),
  tokenIn: sz.evm.address(),
  tokenOut: sz.evm.address(),
  amountIn: z.string(),
  slippage: z.string(), // BIPS
  ticks: z
    .tuple([
      z.coerce.number().int().gte(TickMath.MIN_TICK).lte(TickMath.MAX_TICK),
      z.coerce.number().int().gte(TickMath.MIN_TICK).lte(TickMath.MAX_TICK),
    ])
    .refine(([tickLower, tickUpper]) => tickLower < tickUpper, {
      message: 'invalid tick range',
    }),
  poolToken0: sz.evm.address(),
  poolToken1: sz.evm.address(),
  poolFeeTier: z.coerce
    .number()
    .int()
    .refine(
      (feeTier) => Object.values(SushiSwapV3FeeAmount).includes(feeTier),
      { message: 'invalid fee tier' },
    ),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const params = {
    ...Object.fromEntries(request.nextUrl.searchParams.entries()),
    ticks: request.nextUrl.searchParams.getAll('ticks'),
  }

  const { chainId, sender, receiver, routingStrategy, ...actionParams } =
    schema.parse(params)

  const url = new URL('https://api.enso.finance/api/v1/shortcuts/bundle')
  url.searchParams.set('routingStrategy', `${routingStrategy}`)
  url.searchParams.set('chainId', `${chainId}`)
  url.searchParams.set('fromAddress', `${sender}`)
  url.searchParams.set('spender', `${sender}`)
  if (receiver) url.searchParams.set('receiver', `${receiver}`)

  const {
    slippage,
    tokenIn,
    tokenOut,
    amountIn,
    ticks,
    poolToken0,
    poolToken1,
    poolFeeTier,
  } = actionParams

  const body = [
    {
      protocol: 'enso',
      action: 'fee',
      args: {
        token: tokenIn,
        amount: amountIn,
        bps: `${UI_FEE_BIPS}`,
        receiver: UI_FEE_COLLECTOR_ADDRESS[chainId],
      },
    },
    {
      protocol: 'enso',
      action: 'split',
      args: {
        tokenIn: tokenIn,
        tokenOut: [poolToken0, poolToken1],
        amountIn: { useOutputOfCallAt: 0 },
      },
    },
    {
      protocol: 'enso',
      action: 'slippage',
      args: {
        amountOut: { useOutputOfCallAt: 1, index: 0 },
        bps: slippage,
      },
    },
    {
      protocol: 'enso',
      action: 'slippage',
      args: {
        amountOut: { useOutputOfCallAt: 1, index: 1 },
        bps: slippage,
      },
    },
    {
      protocol: 'sushiswap-v3',
      action: 'depositclmm',
      args: {
        tokenOut,
        ticks,
        tokenIn: [poolToken0, poolToken1],
        poolFee: poolFeeTier,
        amountIn: [
          {
            useOutputOfCallAt: 1,
            index: 0,
          },
          {
            useOutputOfCallAt: 1,
            index: 1,
          },
        ],
      },
    },
    {
      protocol: 'enso',
      action: 'slippage',
      args: {
        amountOut: { useOutputOfCallAt: 4 },
        bps: slippage,
      },
    },
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-wagmi-address': sender,
      Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}
