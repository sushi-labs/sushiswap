import { getBuiltGraphSDK } from '../.graphclient'

export default function Analytics(props) {
  console.log({ props })
  return (
    <div>
      <h1>Analytics</h1>
    </div>
  )
}

export async function getServerSideProps() {
  const sdk = await getBuiltGraphSDK()
  const data = await sdk.FactoriesQuery()
  return {
    props: {
      ...data,
    },
  }
}
