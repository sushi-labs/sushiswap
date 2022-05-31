import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useRouter } from 'next/router'

import Tabs from '../Tabs'

// @ts-ignore TYPE NEEDS FIXING
export default function DashboardTabs({ currentType, setType }): JSX.Element {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const tabs = [
    {
      name: 'Top Pairs',
      type: 'pairs',
    },
    {
      name: 'Top Tokens',
      type: 'tokens',
    },
  ]

  if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
    tabs.unshift({
      name: 'Top Farms',
      type: 'pools',
    })
  }

  return (
    <>
      <Tabs tabs={tabs} currentType={currentType} setType={setType} />
    </>
  )
}
