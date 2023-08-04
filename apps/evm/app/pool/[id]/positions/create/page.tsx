import { ChainId } from '@sushiswap/chain'

import { getPool } from '../../page'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const pool = await getPool({ chainId, address })

  return <h1>Test</h1>
}
