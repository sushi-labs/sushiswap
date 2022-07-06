import { Breadcrumb, Layout } from 'components'
import { CreateMultipleForm } from 'components/stream'

const Create = () => {
  return (
    <Layout>
      <Breadcrumb title="Create Stream" />
      <div className="mt-6">
        <CreateMultipleForm />
      </div>
    </Layout>
  )
}

export default Create
