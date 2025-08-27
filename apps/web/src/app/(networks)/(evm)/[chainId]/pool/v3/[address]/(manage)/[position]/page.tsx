import { V3PositionView } from 'src/ui/pool/V3PositionView'

export default async function V3PositionsPage(props: {
  params: Promise<{ chainId: string; address: string; position: string }>
}) {
  const params = await props.params
  return <V3PositionView params={params} />
}
