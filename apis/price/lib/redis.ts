import Redis from 'ioredis'

const path = `rediss://:${process.env.UPSTASH_REDIS_REST_PASSWORD}@${process.env.UPSTASH_REDIS_REST_URL}`

const redis = new Redis(path, {
  // This is the default value of `retryStrategy`
  maxRetriesPerRequest: 1, // TODO: remove this later, limitation of testing a free redis server
})

export default redis
