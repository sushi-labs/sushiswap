import { FactoriesQueryQuery } from '../.graphclient'
import { KPI } from '../components'

export default function Analytics(props: FactoriesQueryQuery) {
  console.log({ props })

  const { liquidityUSD, volumeUSD, txCount, pairCount, userCount, tokenCount } = Object.values(props).reduce(
    (previousValue, currentValue) => ({
      liquidityUSD: previousValue.liquidityUSD + Number(currentValue.liquidityUSD),
      volumeUSD: previousValue.volumeUSD + Number(currentValue.volumeUSD),
      txCount: previousValue.txCount + Number(currentValue.txCount),
      pairCount: previousValue.pairCount + Number(currentValue.pairCount),
      userCount: previousValue.userCount + Number(currentValue.userCount),
      tokenCount: previousValue.tokenCount + Number(currentValue.tokenCount),
    }),
    { liquidityUSD: 0, volumeUSD: 0, txCount: 0, pairCount: 0, userCount: 0, tokenCount: 0 },
  )

  return (
    <div className="px-2 pt-16">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-2">
        <KPI label="TVL" value={`$${liquidityUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <KPI label="VOLUME" value={`$${volumeUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <KPI label="TRANSACTIONS" value={txCount.toLocaleString()} />
        <KPI label="POOLS" value={pairCount.toLocaleString()} />
        <KPI label="USERS" value={userCount.toLocaleString()} />
        <KPI label="TOKENS" value={tokenCount.toLocaleString()} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = await getBuiltGraphSDK()
  const data = await sdk.FactoriesQuery()
  return {
    props: {
      ...data,
    },
  }
}
