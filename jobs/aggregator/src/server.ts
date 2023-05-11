import 'dotenv/config'

import timeout from 'connect-timeout'
import express from 'express'
import { z } from 'zod'

import { PoolType, Price, ProtocolName, ProtocolVersion } from './config.js'
import { apeSwapV2 } from './seed/apeswap/v2/seed.js'
import { dfynV2 } from './seed/Dfyn/v2/seed.js'
import { elkV2 } from './seed/Elk/v2/seed.js'
import { honeySwapV2 } from './seed/honeyswap/v2/seed.js'
import { jetSwapV2 } from './seed/jetswap/v2/seed.js'
import { liquidity } from './seed/liquidity.js'
import { netSwapV2 } from './seed/netswap/v2/seed.js'
import { pancakeSwapV2 } from './seed/pancakeswap/v2/seed.js'
import { prices } from './seed/price.js'
import { quickswapV2 } from './seed/quickswap/v2/seed.js'
import { reserves } from './seed/reserves.js'
import { spiritSwapV2 } from './seed/spiritswap/v2/seed.js'
import { spookySwapV2 } from './seed/spookyswap/v2/seed.js'
import { sushiSwap } from './seed/sushiswap/seed.js'
import { traderJoeV2 } from './seed/trader-joe/v2/seed.js'
import { ubeSwapV2 } from './seed/ubeswap/v2/seed.js'
import { uniswapV2 } from './seed/uniswap/v2/seed.js'
import { whitelistPools } from './seed/whitelist-pool.js'
import { whitelistPools2 } from './seed/whitelist-pool-2.js'
import { whitelistTokens2 } from './seed/whitelist-tokens-2.js'

const app = express()

const protocolSchema = z.object({
  name: z.nativeEnum(ProtocolName),
  version: z.nativeEnum(ProtocolVersion).optional(),
  poolType: z.nativeEnum(PoolType).optional(),
})

const chainIdOnlySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

const priceSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  base: z.string(),
  price: z.nativeEnum(Price),
})

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.get(
  '/protocol',
  async (req, res) => {
    req.setTimeout(600000)

    const result = protocolSchema.safeParse(req.query)
    if (result.success === false) {
      return res.status(400).send(result.error.format())
    }

    const { name, version, poolType } = result.data
    try {
      if (name === ProtocolName.SUSHISWAP) {
        await sushiSwap() // Includes legacy, trident and stable pools
        res.sendStatus(200)
      } else if (name === ProtocolName.UNISWAP) {
        if (version === ProtocolVersion.V2) {
          await uniswapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.PANCAKESWAP) {
        if (version === ProtocolVersion.V2) {
          await pancakeSwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.QUICKSWAP) {
        if (version === ProtocolVersion.V2) {
          await quickswapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.TRADERJOE) {
        if (version === ProtocolVersion.V2) {
          await traderJoeV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.SPOOKYSWAP) {
        if (version === ProtocolVersion.V2) {
          await spookySwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.UBESWAP) {
        if (version === ProtocolVersion.V2) {
          await ubeSwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.HONEYSWAP) {
        if (version === ProtocolVersion.V2) {
          await honeySwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.NETSWAP) {
        if (version === ProtocolVersion.V2) {
          await netSwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.APESWAP) {
        if (version === ProtocolVersion.V2) {
          await apeSwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.JETSWAP) {
        if (version === ProtocolVersion.V2) {
          await jetSwapV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.DFYN) {
        if (version === ProtocolVersion.V2) {
          await dfynV2()
          res.sendStatus(200)
        } else {
          res.status(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.ELK) {
        if (version === ProtocolVersion.V2) {
          await elkV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else if (name === ProtocolName.SPIRITSWAP) {
        if (version === ProtocolVersion.V2) {
          await spiritSwapV2()
          res.sendStatus(200)
        } else {
          res.sendStatus(400).send('Not a valid version')
        }
      } else {
        res.status(400).send(`Could not find protocol. valid protocols are: ${Object.values(ProtocolName).join(',')}`)
      }
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('600s')
)

app.get(
  '/liquidity',
  async (req, res) => {
    req.setTimeout(300000)

    const result = chainIdOnlySchema.safeParse(req.query)
    if (result.success === false) {
      return res.status(400).json(result.error.format())
    }
    const { chainId } = result.data
    try {
      await liquidity(chainId)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('300s')
)

app.get(
  '/reserves',
  async (req, res) => {
    req.setTimeout(300000)

    const result = chainIdOnlySchema.safeParse(req.query)
    if (result.success === false) {
      return res.status(400).json(result.error.format())
    }

    const { chainId } = result.data
    try {
      await reserves(chainId)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
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
    }
  },
  timeout('300s')
)

app.get(
  '/whitelist-pools-2',
  async (req, res) => {
    req.setTimeout(300000)

    try {
      await whitelistPools2()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('300s')
)
app.get(
  '/whitelist-tokens-2',
  async (req, res) => {
    req.setTimeout(300000)

    try {
      await whitelistTokens2()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('300s')
)
app.get(
  '/price',
  async (req, res) => {
    req.setTimeout(300000)

    const result = priceSchema.safeParse(req.query)
    if (result.success === false) {
      return res.status(400).json(result.error.format())
    }

    const { chainId, base, price } = result.data
    try {
      await prices(chainId, base, price)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('300s')
)

app.listen(8080)

console.log('Server listening on port 8080')
