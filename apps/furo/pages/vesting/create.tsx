import { useIsMounted } from '@sushiswap/hooks'
import Layout from 'components/Layout'
import { CreateForm } from 'features/vesting/CreateForm'

const Create = () => {
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <Layout>
      <CreateForm />
    </Layout>
  )
}

export default Create
