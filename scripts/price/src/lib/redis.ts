import Redis from 'ioredis'

if (!process.env.UPSTASH_REDIS_REST_URL) throw new Error('UPSTASH_REDIS_REST_URL is required for redis')
if (!process.env.UPSTASH_REDIS_REST_PASSWORD) throw new Error('UPSTASH_REDIS_REST_PASSWORD is required for redis')

const path = `rediss://:${process.env.UPSTASH_REDIS_REST_PASSWORD}@${process.env.UPSTASH_REDIS_REST_URL}`
const redis = new Redis(path, {
  maxRetriesPerRequest: 1, // TODO: remove this later, limitation of testing a free redis server
})

export default redis
