import { ChainId } from '@sushiswap/chain'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { getBuiltGraphSDK } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async () => {
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
    <div className="grid grid-cols-4 gap-4 p-8">
      {data.map((kpi) => (
        <pre key={kpi.chainId} className="p-4 bg-slate-700 rounded-3xl">
          {JSON.stringify(kpi, null, 2)}
        </pre>
      ))}
    </div>
  )
}
