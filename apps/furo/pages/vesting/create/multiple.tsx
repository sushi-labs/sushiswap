import { ChainId } from '@sushiswap/chain'
import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { NextSeo } from 'next-seo'
import { useNetwork } from 'wagmi'

import { Layout } from '../../../components'
import { CreateMultipleForm } from '../../../components/vesting/CreateMultipleForm'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/vesting/create',
    label: 'Create Vesting',
  },
  {
    href: '/vesting/create/single',
    label: 'Multiple',
  },
]

const MultipleVesting = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM

  return (
    <>
      <NextSeo title="New Vestings" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateMultipleForm chainId={chainId} />
        </div>
      </Layout>
    </>
  )
}

export default MultipleVesting
