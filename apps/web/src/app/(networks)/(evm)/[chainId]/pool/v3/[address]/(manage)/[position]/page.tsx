import { notFound } from 'next/navigation'
import { getPositionManager } from 'src/lib/wagmi/hooks/positions/position-manager'
import { parsePositionTokenId } from 'src/lib/wagmi/hooks/positions/position-token-id'
import { type EvmAddress, isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { V3PositionView } from './_common/ui/v3-position-view'

export default async function V3PositionsPage(props: {
  params: Promise<{ chainId: string; address: string; position: string }>
  searchParams: Promise<{ positionManager?: string | string[] }>
}) {
  const params = await props.params

  const { chainId: _chainId, address, position } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId)) {
    return notFound()
  }

  if (!isEvmAddress(address)) {
    return notFound()
  }

  if (!parsePositionTokenId(position)) {
    return notFound()
  }

  const { positionManager: manager } = await props.searchParams
  if (Array.isArray(manager)) return notFound()

  let positionManager: EvmAddress
  try {
    positionManager = getPositionManager(chainId, manager)
  } catch {
    return notFound()
  }

  return (
    <V3PositionView
      chainId={chainId}
      address={address}
      position={position}
      positionManager={positionManager}
    />
  )
}
