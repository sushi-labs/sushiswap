import express from 'express'

import { execute } from './index'

const app = express()

app.get('/', async (req, res) => {
  try {
    await execute()
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(8080)
