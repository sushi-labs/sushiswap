import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { Layout } from 'components'
import { CreateForm } from 'components/stream'

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
    <Layout>
      <Breadcrumb home="/dashboard" links={LINKS} />
      <div className="mt-6">
        <CreateForm />
      </div>
    </Layout>
  )
}

export default SingleStream
