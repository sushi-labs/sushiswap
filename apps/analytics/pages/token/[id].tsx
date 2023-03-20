import { Token as GraphToken } from '@sushiswap/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { Layout } from '../../components'
import { TokenInformation } from '../../components/TokenSection'
import { TokenHeader } from '../../components/TokenSection/TokenHeader'
import { TokenPairs } from '../../components/TokenSection/TokenPairs'
import { TokenStats } from '../../components/TokenSection/TokenStats'
import { getBundles, getToken } from '../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const [token, bundles] = await Promise.all([getToken(query.id as string), getBundles()])
  return {
    props: {
      fallback: {
        [`/analytics/api/token/${query.id}`]: { token },
        [`/analytics/api/bundles`]: bundles,
      },
    },
  }
}

const TokenPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_TokenPage />
    </SWRConfig>
  )
}

const _TokenPage: FC = () => {
  const router = useRouter()
  const { data } = useSWR<{ token: GraphToken }>(`/analytics/api/token/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { token } = data

  return (
    <Layout className="flex flex-col gap-10">
      <TokenHeader token={token} />
      <TokenStats token={token} />
      <TokenInformation token={token} />
      <TokenPairs token={token} />
    </Layout>
  )
}

export default TokenPage
