import express from 'express'
const app = express()

app.get('/', async (req, res) => {
  const target = (req.query.target as string).toLowerCase()
  try {
    switch (target) {
      case 'pools':
        await import('./pools.js')
        res.sendStatus(200)
        break
      case 'incentives':
        await import('./incentives.js')
        res.sendStatus(200)
        break
      case 'volume':
        await import('./volume.js')
        res.sendStatus(200)
        break
      default:
        res.sendStatus(400).send('Not a valid target')
        break
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(8080)
