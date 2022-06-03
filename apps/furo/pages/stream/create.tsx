import { Breadcrumb, Layout } from 'components'
import { CreateForm } from 'components/stream'

const Create = () => {
  return (
    <Layout>
      <Breadcrumb title="Create Stream" />
      <div className="mt-6">
        <CreateForm />
      </div>
    </Layout>
  )
}

export default Create
