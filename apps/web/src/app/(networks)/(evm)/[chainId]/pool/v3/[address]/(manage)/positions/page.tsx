import { type V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/PoolsFiltersProvider'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { ManageV3PoolPositionsTable } from './table'

export default async function ManageV3PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = (await unstable_cache(
    async () => await getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V3Pool

  return (
    <PoolsFiltersProvider>
      <ManageV3PoolPositionsTable pool={pool} />
    </PoolsFiltersProvider>
  )
}
