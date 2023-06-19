import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Pools as _Pools } from '../components'
import { getPoolCount, getPoolCountUrl, getPools, getPoolsUrl } from '@sushiswap/client'
import { defaultPoolsArgs } from '../lib/constants'
import { unstable_serialize } from 'swr/infinite'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useIsMounted } from '@sushiswap/hooks'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async () => {
  const [pools, poolCount] = await Promise.all([getPools(defaultPoolsArgs), getPoolCount(defaultPoolsArgs)])

  return {
    props: {
      fallback: {
        // Need unstable_serialize for SWRInfinite: https://github.com/vercel/swr/discussions/2164
        [unstable_serialize(() => getPoolsUrl(defaultPoolsArgs))]: pools,
        [unstable_serialize(() => getPoolCountUrl(defaultPoolsArgs))]: poolCount,
      },
    },
    revalidate: 60,
  }
}

export const Pools: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  const isMounted = useIsMounted()
  const router = useRouter()
  return (
    <SplashController show={!isMounted || !router.isReady}>
      <SWRConfig value={{ fallback }}>
        <_Pools />
      </SWRConfig>
    </SplashController>
  )
}

export default Pools
