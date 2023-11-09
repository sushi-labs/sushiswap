import PoolPage from '../page'

export default async function PoolPageRemove({
  params,
}: { params: { id: string } }) {
  return <PoolPage params={params} tab="remove" />
}
