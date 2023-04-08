import { ChainId } from '@sushiswap/chain'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { NextSeo } from 'next-seo'
import { useNetwork } from '@sushiswap/wagmi'

import { Layout } from '../../../components'
import { CreateMultipleForm } from '../../../components/stream/CreateMultipleForm'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/stream/create',
    label: 'Create Stream',
  },
  {
    href: '/stream/create/multiple',
    label: 'Multiple',
  },
]

const MultipleStream = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroStreamRouterChainId

  return (
    <>
      <NextSeo title="New Streams" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateMultipleForm chainId={chainId} />
        </div>
      </Layout>
    </>
  )
}

export default MultipleStream
