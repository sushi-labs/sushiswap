import { notFound } from 'next/navigation'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { V3PositionView } from './_common/ui/V3PositionView'

export default async function V3PositionsPage(props: {
  params: Promise<{ chainId: string; address: string; position: string }>
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

  return (
    <V3PositionView chainId={chainId} address={address} position={position} />
  )
}
