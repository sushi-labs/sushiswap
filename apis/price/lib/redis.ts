import Redis from 'ioredis'

if (!process.env.REDIS_URL) throw new Error('REDIS_URL is required')

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 1, // TODO: remove this later, limitation of testing a free redis server
})

export default redis
