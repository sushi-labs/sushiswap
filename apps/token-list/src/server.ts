import { json, urlencoded } from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { List, Lists, Token } from './types'

import DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list'

export const createServer = () => {
  const app = express()
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get('/', (req, res) => {
      return res.json(DEFAULT_TOKEN_LIST)
    })
    .get('/healthz', (req, res) => {
      return res.json({ ok: true })
    })

  return app
}
