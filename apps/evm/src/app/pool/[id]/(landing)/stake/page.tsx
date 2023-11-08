import PoolPage from '../page'

export default async function PoolPageStake({
  params,
}: { params: { id: string } }) {
  return <PoolPage params={params} tab="stake" />
}
