import client from '../lib/urlq'
import { FactoriesQueryDocument } from '../.graphclient'

export default function Analytics(props) {
  console.log({ props })
  return (
    <div>
      <h1>Analytics</h1>
    </div>
  )
}

export async function getStaticProps() {
  const { data } = await client.query(FactoriesQueryDocument).toPromise()

  return {
    props: {
      ...data,
    },
  }
}
