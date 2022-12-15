import { ChainId } from '@sushiswap/chain'
import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { NextSeo } from 'next-seo'
import { useNetwork } from 'wagmi'

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
  const chainId = chain?.id || ChainId.ETHEREUM

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
