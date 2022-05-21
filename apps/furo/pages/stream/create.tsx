import { useIsMounted } from '@sushiswap/hooks'
import Layout from 'components/Layout'
import { CreateForm } from 'features/stream/CreateForm'

const Create = () => {
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <Layout gradient={false}>
      <CreateForm />
    </Layout>
  )
}

export default Create
