import { ChainId } from '@sushiswap/chain'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { NextSeo } from 'next-seo'
import { useNetwork } from '@sushiswap/wagmi'

import { Layout } from '../../../components'
import { CreateForm } from '../../../components/stream'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/stream/create',
    label: 'Create Stream',
  },
  {
    href: '/stream/create/single',
    label: 'Single',
  },
]

const SingleStream = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroStreamRouterChainId

  return (
    <>
      <NextSeo title="New Stream" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateForm chainId={chainId} />
        </div>
      </Layout>
    </>
  )
}

export default SingleStream
