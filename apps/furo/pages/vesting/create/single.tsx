import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { Layout } from 'components'
import { CreateForm } from 'components/vesting'
import { NextSeo } from 'next-seo'

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
  return (
    <>
      <NextSeo title="New Vesting" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateForm />
        </div>
      </Layout>
    </>
  )
}

export default SingleVesting
