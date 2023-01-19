import timeout from 'connect-timeout'
import express from 'express'
import { z } from 'zod'

import { PoolType, Price, ProtocolName, ProtocolVersion } from './config.js'
import { honeySwapV2 } from './seed/honeyswap/v2/seed.js'
import { liquidity } from './seed/liquidity.js'
import { netSwapV2 } from './seed/netswap/v2/seed.js'
import { pancakeSwapV2 } from './seed/pancakeswap/v2/seed.js'
import { prices } from './seed/price.js'
import { quickswapV2 } from './seed/quickswap/v2/seed.js'
import { reserves } from './seed/reserves.js'
import { spookySwapV2 } from './seed/spookyswap/v2/seed.js'
import { sushiSwap } from './seed/sushiswap/seed.js'
import { traderJoeV2 } from './seed/trader-joe/v2/seed.js'
import { ubeSwapV2 } from './seed/ubeswap/v2/seed.js'
import { uniswapV2 } from './seed/uniswap/v2/seed.js'
import { whitelistPools } from './seed/whitelist-pool.js'

const app = express()

const protocolSchema = z.object({
  protocol: z.nativeEnum(ProtocolName),
  version: z.nativeEnum(ProtocolVersion).optional(),
  poolType: z.nativeEnum(PoolType).optional(),
})

const commonSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  version: z.nativeEnum(ProtocolVersion),
  poolType: z.nativeEnum(PoolType),
})

const priceSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  base: z.string(),
  price: z.nativeEnum(Price),
  version: z.nativeEnum(ProtocolVersion),
  poolType: z.nativeEnum(PoolType),
})

app.get(
  '/protocol',
  async (req, res) => {
    req.setTimeout(600000)

    const result = protocolSchema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json(result.error.format())
    }

    const { protocol: name, version, poolType } = result.data
    try {
      if (name === ProtocolName.SUSHISWAP) {
        await sushiSwap() // Includes legacy, trident and stable pools
        res.sendStatus(200)
      } else if (name === ProtocolName.UNISWAP) {
        if (version === ProtocolVersion.V2) {
          await uniswapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.PANCAKESWAP) {
        if (version === ProtocolVersion.V2) {
          await pancakeSwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.QUICKSWAP) {
        if (version === ProtocolVersion.V2) {
          await quickswapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.TRADERJOE) {
        if (version === ProtocolVersion.V2) {
          await traderJoeV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.SPOOKYSWAP) {
        if (version === ProtocolVersion.V2) {
          await spookySwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.UBESWAP) {
        if (version === ProtocolVersion.V2) {
          await ubeSwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.HONEYSWAP) {
        if (version === ProtocolVersion.V2) {
          await honeySwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.NETSWAP) {
        if (version === ProtocolVersion.V2) {
          await netSwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else {
        res
          .sendStatus(400)
          .send('Could not find protocol. valid protocols are: ' + Object.values(ProtocolName).join(','))
      }
    } catch (err) {
      res.status(500).send(err)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  },
  timeout('600s')
)

app.get(
  '/liquidity',
  async (req, res) => {
    req.setTimeout(300000)

    const result = commonSchema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json(result.error.format())
    }
    const { chainId, version, poolType } = result.data
    try {
      await liquidity(chainId, version, poolType)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  },
  timeout('300s')
)

app.get(
  '/reserves',
  async (req, res) => {
    req.setTimeout(300000)

    const result = commonSchema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json(result.error.format())
    }

    const { chainId, version, poolType } = result.data
    try {
      await reserves(chainId, version, poolType)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  },
  timeout('300s')
)

app.get(
  '/whitelist-pools',
  async (req, res) => {
    req.setTimeout(300000)

    try {
      await whitelistPools()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  },
  timeout('300s')
)

app.get(
  '/price',
  async (req, res) => {
    req.setTimeout(300000)

    const result = priceSchema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json(result.error.format())
    }

    const { chainId, version, poolType, base, price } = result.data
    try {
      await prices(chainId, version, poolType, base, price)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  },
  timeout('300s')
)

app.listen(8080)
