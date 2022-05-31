import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Container from '../../components/Container'

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  const router = useRouter()
  const chainId = String(router.query.chainId)

  const items = [
    {
      text: 'Dashboard',
      href: `/analytics/${chainId}/dashboard`,
    },
    {
      text: 'xSushi',
      href: '/analytics/xsushi',
    },
    {
      text: 'Pairs',
      href: `/analytics/${chainId}/pairs`,
    },
    {
      text: 'Tokens',
      href: `/analytics/${chainId}/tokens`,
    },
  ]

  if (featureEnabled(Feature.LIQUIDITY_MINING, Number(chainId))) {
    items.push({
      text: 'Farms',
      href: `/analytics/${chainId}/farms`,
    })
  }

  if (featureEnabled(Feature.BENTOBOX, Number(chainId))) {
    items.push({
      text: 'BentoBox',
      href: `/analytics/${chainId}/bentobox`,
    })
  }

  return (
    <div className="relative w-full">
      <Head>
        <title>Sushi Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>
      <Container id="analytics" maxWidth="7xl" className="mx-auto">
        <div className="w-full border-dark-700">{children}</div>
      </Container>
    </div>
  )
}
