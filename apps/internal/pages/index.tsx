import { ChainId } from '@sushiswap/chain'
import { Typography } from '@sushiswap/ui'
import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { getBuiltGraphSDK } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const sdk = getBuiltGraphSDK()
  const { crossChainBentoBoxKpis: data } = await sdk.CrossChainBentoBoxKpis({
    chainIds: [
      ChainId.ETHEREUM,
      ChainId.POLYGON,
      ChainId.AVALANCHE,
      ChainId.BSC,
      ChainId.FANTOM,
      ChainId.GNOSIS,
      ChainId.ARBITRUM,
      ChainId.CELO,
      ChainId.MOONRIVER,
      ChainId.MOONBEAM,
      ChainId.OPTIMISM,
      ChainId.HARMONY,
      // ChainId.KAVA,
    ],
  })
  return {
    props: {
      data,
    },
  }
}

export default function IndexPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="max-w-md space-y-4">
        <Typography variant="hero" weight={600} className="text-slate-50">
          Dashboard
        </Typography>
      </div>
    </Layout>
  )
}
