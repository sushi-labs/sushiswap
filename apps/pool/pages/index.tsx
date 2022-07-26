import { ChainId } from '@sushiswap/chain'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const { getBuiltGraphSDK } = await import('.graphclient')
  const sdk = await getBuiltGraphSDK()
  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: [ChainId.ETHEREUM, ChainId.ARBITRUM],
  })
  const { crossChainBundles: bundles } = await sdk.CrossChainBundles({
    chainIds: [ChainId.ETHEREUM, ChainId.ARBITRUM],
  })
  return {
    props: {
      bundles,
      pairs,
    },
  }
}

export default function Index({ bundles, pairs }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>Cross Chain Budnles</h1>
      <pre>{JSON.stringify(bundles, null, 2)}</pre>
      <h1>Cross Chain Pairs</h1>
      <pre>{JSON.stringify(pairs, null, 2)}</pre>
    </div>
  )
}
