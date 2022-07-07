import { Breadcrumb, BreadcrumbLink, Layout } from 'components'
import { CreateForm } from 'components/vesting'

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

const MultipleVesting = () => {
  return (
    <Layout>
      <Breadcrumb links={LINKS} />
      <div className="mt-6">
        <CreateForm />
      </div>
    </Layout>
  )
}

export default MultipleVesting
