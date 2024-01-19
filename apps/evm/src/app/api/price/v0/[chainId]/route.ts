import { getUnixTime } from 'date-fns'
import { z } from 'zod'

import redis from 'src/lib/redis'
import { SUPPORTED_CHAINS } from '../config'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

export async function GET(
  _request: Request,
  { params }: { params: { chainId: string } },
) {
  const { chainId } = schema.parse(params)
  if (!(chainId in SUPPORTED_CHAINS)) {
    return Response.json(
      {
        message: 'Unsupported network. Supported chain ids: '.concat(
          SUPPORTED_CHAINS.join(', '),
        ),
      },
      { status: 422 },
    )
  }

  const data = await redis.hget('prices', chainId.toString())

  if (!data) {
    return new Response(null, { status: 503 })
  }

  const json = JSON.parse(data as string)

  const now = getUnixTime(Date.now())

  return Response.json({
    ...json,
    updatedSecondsAgo: now - json.updatedAtTimestamp,
  })
}
