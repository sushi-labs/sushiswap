'use client'

import { Token as GraphToken } from '@sushiswap/graph-client'
import { FC } from 'react'
import useSWR from 'swr'

import { Layout } from '../../components/Layout'
import { TokenHeader, TokenInformation, TokenStats } from '../../components/TokenSection'
import { TokenPairs } from '../../components/TokenSection/TokenPairs'

const TokenPage: FC<{ params: { id: string } }> = ({ params }) => {
  const { data } = useSWR<{ token: GraphToken }>(`/analytics/api/token/${params.id}`, (url) =>
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
