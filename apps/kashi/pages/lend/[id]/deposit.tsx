import { Layout, LendWidget } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { KashiPair } from '../../../.graphclient'
import { LendInformation } from '../../../components/LendSection/LendInformation'
import { getPair } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pair] = await Promise.all([getPair(query.id as string)])

  return {
    props: {
      fallback: {
        [`/kashi/api/pair/${query.id}`]: { pair },
      },
    },
  }
}

const LendDeposit: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_LendDeposit />
    </SWRConfig>
  )
}

const _LendDeposit = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: KashiPair }>(`/kashi/api/pair/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data

  return (
    <Layout>
      <div className="flex flex-col lg:grid lg:grid-cols-[264px_396px_264px] gap-6">
        <LendInformation pair={pair} />
        <LendWidget pair={pair} />
      </div>
    </Layout>
  )
}

export default LendDeposit
