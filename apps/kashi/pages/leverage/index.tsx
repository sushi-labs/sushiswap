import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: `/kashi/api/leverage`,
          args: {
            sorting: [
              {
                id: 'supplyAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })]: [],
      },
    },
  }
}

const Leverage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Leverage />
    </SWRConfig>
  )
}

const _Leverage = () => {
  return <Layout>LEVERAGE</Layout>
}

export default Leverage
