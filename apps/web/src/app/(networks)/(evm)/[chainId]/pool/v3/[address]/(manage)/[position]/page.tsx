import { notFound } from 'next/navigation'
import { V3PositionView } from 'src/ui/pool/V3PositionView'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'

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
