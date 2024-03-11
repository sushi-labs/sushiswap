import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export function rateLimit(
  limiter: ConstructorParameters<typeof Ratelimit>['0']['limiter'],
) {
  let ratelimit: Ratelimit | undefined

  try {
    if (!process.env.UPSTASH_REDIS_REST_URL)
      throw new Error('UPSTASH_REDIS_REST_URL undefined')
    if (!process.env.UPSTASH_REDIS_REST_TOKEN)
      throw new Error('UPSTASH_REDIS_REST_TOKEN undefined')

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    ratelimit = new Ratelimit({
      redis,
      limiter,
    })
  } catch {
    console.warn('Rate limit not enabled')
  }

  return ratelimit
}
