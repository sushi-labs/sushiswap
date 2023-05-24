import { ChainId } from '@sushiswap/chain'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { NextSeo } from 'next-seo'
import { useNetwork } from '@sushiswap/wagmi'

import { Layout } from '../../../components'
import { CreateForm } from '../../../components/stream'

const SingleStream = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroStreamRouterChainId

  return (
    <>
      <NextSeo title="New Stream" />
      <Layout>
        <div className="mt-6">
          <CreateForm chainId={chainId} />
        </div>
      </Layout>
    </>
  )
}

export default SingleStream
