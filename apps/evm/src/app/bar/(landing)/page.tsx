import { BarPage } from 'src/ui/bar/BarPage'

export default async function Page({ tab }: { tab: 'stake' | 'unstake' }) {
  return <BarPage tab={tab} />
}
