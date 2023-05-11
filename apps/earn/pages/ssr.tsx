import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Pools as _Pools } from '../components'
import { getPoolCount, getPoolCountUrl, getPools, getPoolsUrl } from '@sushiswap/client'
import { defaultPoolsArgs } from '../lib/constants'
import { unstable_serialize } from 'swr/infinite'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const [pools, poolCount] = await Promise.all([getPools(defaultPoolsArgs), getPoolCount(defaultPoolsArgs)])

  return {
    props: {
      fallback: {
        // Need unstable_serialize for SWRInfinite: https://github.com/vercel/swr/discussions/2164
        [unstable_serialize(() => getPoolsUrl(defaultPoolsArgs))]: pools,
        [unstable_serialize(() => getPoolCountUrl(defaultPoolsArgs))]: poolCount,
      },
    },
  }
}

const Pools: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools />
    </SWRConfig>
  )
}

export default Pools
