import { notFound } from 'next/navigation'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'
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

  const pool = (await getCachedV3Pool({ chainId, address }))!

  return (
    <PoolsFiltersProvider>
      <ManageV3PoolPositionsTable pool={pool} />
    </PoolsFiltersProvider>
  )
}
