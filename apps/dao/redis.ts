import Redis from 'ioredis'

const path = process.env.REDIS_PATH

const redis = new Redis(path)

export default redis
