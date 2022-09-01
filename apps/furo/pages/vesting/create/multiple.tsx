import { Breadcrumb, BreadcrumbLink } from '@sushiswap/ui'
import { Layout } from 'components'
import { CreateMultipleForm } from 'components/vesting'

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
  return (
    <Layout>
      <Breadcrumb home="/dashboard" links={LINKS} />
      <div className="mt-6">
        <CreateMultipleForm />
      </div>
    </Layout>
  )
}

export default MultipleVesting
