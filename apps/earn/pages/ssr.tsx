import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Pools as _Pools } from '../components'
import { getPoolCount, getPoolCountUrl, getPools, getPoolsUrl } from '@sushiswap/client'
import { defaultPoolsArgs } from '../lib/constants'
import { unstable_serialize } from 'swr/infinite'

export const getServerSideProps: GetServerSideProps = async () => {
  const [pools, poolCount] = await Promise.all([getPools(defaultPoolsArgs), getPoolCount(defaultPoolsArgs)])

  return {
    props: {
      fallback: {
        // Need unstable_serialize for SWRInfinite: https://github.com/vercel/swr/discussions/2164
        [unstable_serialize(() => getPoolsUrl(defaultPoolsArgs))]: pools,
        [getPoolCountUrl(defaultPoolsArgs)]: poolCount,
      },
      revalidate: 60,
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
