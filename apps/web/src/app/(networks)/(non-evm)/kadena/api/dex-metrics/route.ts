import { getDexMetrics } from '@sushiswap/graph-client/kadena'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'

export async function GET() {
  const data = await getDexMetrics({
    protocolAddress: KADENA_CONTRACT,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}
