import { createServer } from './server'
import { log } from 'logger'

const port = process.env.PORT || 5001
const server = createServer()

if (process.env.NODE_ENV === 'development') {
  server.listen(port, () => {
    log(`api running on ${port}`)
  })
}

export { server }
