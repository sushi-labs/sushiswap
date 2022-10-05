import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { Layout } from 'components'
import { CreateForm } from 'components/stream'
import { NextSeo } from 'next-seo'

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
  return (
    <>
      <NextSeo title="New Stream" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-6">
          <CreateForm />
        </div>
      </Layout>
    </>
  )
}

export default SingleStream
