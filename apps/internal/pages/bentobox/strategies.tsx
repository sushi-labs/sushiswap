import { ChainId } from '@sushiswap/chain'
import { Typography } from '@sushiswap/ui'
import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { getBuiltGraphSDK } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const sdk = getBuiltGraphSDK()
  const { crossChainStrategyKpis: data } = await sdk.CrossChainStrategyKpis({
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

export default function BentoBoxStrategiesPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="max-w-full px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <Typography variant="hero" weight={600} className="text-slate-50">
          BentoBox Strategies
        </Typography>
        <div className="grid grid-cols-1 gap-5 mt-5">
          {data.map((kpi: any) => (
            <pre key={kpi.chainId} className="p-4 bg-slate-700 rounded-3xl">
              {JSON.stringify(kpi, null, 2)}
            </pre>
          ))}
        </div>
      </div>
    </Layout>
  )
}
