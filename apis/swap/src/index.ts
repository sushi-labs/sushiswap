import './env.js'

import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { ChainId } from '@sushiswap/chain'
import { nativeCurrencyIds } from '@sushiswap/currency'
import { isRouteProcessorChainId, RouteProcessorChainId } from '@sushiswap/route-processor-sdk'
import { fastify } from 'fastify'
import { Address } from 'viem'
import { z } from 'zod'

const server = fastify({ logger: true })
server.register(cors)
// eslint-disable-next-line
// @ts-ignore default export not working
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine((chainId) => isRouteProcessorChainId(chainId as RouteProcessorChainId), {
      message: 'ChainId not supported.',
    })
    .transform((chainId) => chainId as RouteProcessorChainId),
  fromTokenId: z.string().default(nativeCurrencyIds[ChainId.ETHEREUM]),
  toTokenId: z.string().default('SUSHI'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.bigint(),
  to: z.optional(z.string().transform((to) => to as Address)),
  preferSushi: z.coerce.boolean().default(false),
})

// Declare a route
server.get('/v0', async (request) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to, preferSushi } = querySchema.parse(request.query)
  console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to, preferSushi })
})

// Run the server!
const start = async () => {
  try {
    await server.listen({ host: process.env.HOST, port: process.env.PORT })
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

start()
