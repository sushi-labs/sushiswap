import { Breadcrumb, Layout } from 'components'
import { CreateForm } from 'components/vesting'

const Create = () => {
  return (
    <Layout>
      <Breadcrumb title="Create Vesting" />
      <div className="mt-6">
        <CreateForm />
      </div>
    </Layout>
  )
}

export default Create
