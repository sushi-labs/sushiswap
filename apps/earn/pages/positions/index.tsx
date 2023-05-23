import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  return {
    props: {
      fallback: {},
    },
  }
}

const Pools: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return <SWRConfig value={{ fallback }}>Positions</SWRConfig>
}

export default Pools
