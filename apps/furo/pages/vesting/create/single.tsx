import { ChainId } from '@sushiswap/chain'
import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { NextSeo } from 'next-seo'
import { useNetwork } from 'wagmi'

import { Layout } from '../../../components'
import { CreateForm } from '../../../components/vesting'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/vesting/create',
    label: 'Create Vesting',
  },
  {
    href: '/vesting/create/single',
    label: 'Single',
  },
]

const SingleVesting = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM

  return (
    <>
      <NextSeo title="New Vesting" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateForm chainId={chainId} />
        </div>
      </Layout>
    </>
  )
}

export default SingleVesting
