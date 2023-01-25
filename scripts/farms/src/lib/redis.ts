import Redis from 'ioredis'

if (!process.env.REDIS_URL) throw new Error('REDIS_URL is required')

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const redis = new Redis(process.env.REDIS_URL)
