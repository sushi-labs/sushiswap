import timeout from 'connect-timeout'
import express from 'express'
import { z } from 'zod'

import { PoolType, Price,ProtocolName, ProtocolVersion } from './config.js'

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
  version: z.nativeEnum(ProtocolVersion).optional(),
  poolType: z.nativeEnum(PoolType).optional(),
})

const priceSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  base: z.string(),
  price: z.nativeEnum(Price),
  version: z.nativeEnum(ProtocolVersion).optional(),
  poolType: z.nativeEnum(PoolType).optional(),
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
        // await sushiswap()
      } else if (name === ProtocolName.UNISWAP) {
        if (version === ProtocolVersion.V2) {
          // await uniswapV2()
          res.sendStatus(200)
        } else if (version === ProtocolVersion.V3) {
          // await uniswapV3()
          res.sendStatus(200)
        }
      } else if (name === ProtocolName.PANCAKESWAP) {
        // await pancakeswap()
        res.sendStatus(200)
      } else if (name === ProtocolName.QUICKSWAP) {
        // await quickswap()
        res.sendStatus(200)
      } else if (name === ProtocolName.SWAPFISH) {
        // await swapfish()
        res.sendStatus(501).send('Disabled, dynamic fee?')
      } else if (name === ProtocolName.TRADERJOE) {
        // await traderjoe()
        res.sendStatus(200)
      } else if (name === ProtocolName.SPOOKYSWAP) {
        // await spookySwap()
        res.sendStatus(200)
      } else if (name === ProtocolName.UBESWAP) {
        // await ubeSwap()
        res.sendStatus(200)
      } else if (name === ProtocolName.HONEYSWAP) {
        // await honeySwap()
        res.sendStatus(200)
      } else if (name === ProtocolName.NETSWAP) {
        // await netSwap()
        res.sendStatus(200)
      } else {
        res.sendStatus(400).send('Could not find protocol')
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
      // await liquidity(chainId, version, poolType)
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
      // await reserves(chainId, version, poolType)
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
      // await whitelistPools()
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
      // await prices(chainId, version, poolType, base, price)
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
