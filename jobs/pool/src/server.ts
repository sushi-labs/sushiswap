import 'dotenv/config'

import { Protocol } from '@sushiswap/database'
import timeout from 'connect-timeout'
import express from 'express'
import { z } from 'zod'

import { execute as incentives } from './incentives.js'
import { execute as merklIncentives } from './merkl-incentives.js'
import { execute as pools } from './pools.js'
import { prices } from './price.js'
import { steer } from './steer.js'

const app = express()

const protocolSchema = z.object({
  protocol: z.nativeEnum(Protocol),
})

app.get(
  '/pools',
  async (req, res) => {
    req.setTimeout(1200_000)

    const result = protocolSchema.safeParse(req.query)
    if (result.success === false) {
      return res.status(400).send(result.error.format())
    }

    const { protocol } = result.data
    try {
      await pools(protocol)
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('1200s'),
)

app.get(
  '/incentives',
  async (req, res) => {
    req.setTimeout(600_000)
    try {
      await incentives()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('600s'),
)

app.get(
  '/merkl-incentives',
  async (req, res) => {
    req.setTimeout(600_000)
    try {
      await merklIncentives()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('600s'),
)

app.get(
  '/prices',
  async (req, res) => {
    req.setTimeout(600_000)
    try {
      await prices()
      res.sendStatus(200)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  timeout('600s'),
)

app.get(
  '/steer',
  async (req, res) => {
    req.setTimeout(600_000)
    try {
      await steer()
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  timeout('600s'),
)

app.listen(8080)
