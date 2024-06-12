import PoolPage from '../page'

export default async function PoolPageUnstake({
  params,
}: { params: { id: string } }) {
  return <PoolPage params={{ ...params, tab: 'unstake' }} />
}
