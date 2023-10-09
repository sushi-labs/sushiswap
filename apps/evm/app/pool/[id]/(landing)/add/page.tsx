import PoolPage from '../page'

export default async function PoolPageAdd({ params }: { params: { id: string } }) {
  return <PoolPage params={params} tab="add" />
}
