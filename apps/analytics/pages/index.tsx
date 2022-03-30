import { FactoriesQueryQuery } from '../.graphclient'

export default function Analytics(props: FactoriesQueryQuery) {
  console.log({ props })

  const { liquidityUSD, volumeUSD } = Object.values(props).reduce(
    (previousValue, currentValue) => ({
      liquidityUSD: previousValue.liquidityUSD + Number(currentValue.liquidityUSD),
      volumeUSD: previousValue.volumeUSD + Number(currentValue.volumeUSD),
    }),
    { liquidityUSD: 0, volumeUSD: 0 },
  )

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <div>Liquidity USD: ${liquidityUSD.toLocaleString()}</div>
      <div>Volume USD: ${volumeUSD.toLocaleString()}</div>
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
