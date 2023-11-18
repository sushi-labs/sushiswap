import { Redis } from "@upstash/redis"

if (!process.env["UPSTASH_SUSHISWAP_REDIS_REST_URL"])
throw new Error('UPSTASH_REDIS_REST_URL undefined')
if (!process.env["UPSTASH_SUSHISWAP_REDIS_REST_TOKEN"])
throw new Error('UPSTASH_REDIS_REST_TOKEN undefined')

export const redis = new Redis({
url: process.env["UPSTASH_SUSHISWAP_REDIS_REST_URL"],
token: process.env["UPSTASH_SUSHISWAP_REDIS_REST_TOKEN"],
})
