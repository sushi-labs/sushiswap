import { Layout, LendWidget } from 'components'
import { useMarket } from 'lib/hooks/useMarket'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { LendInformation } from '../../../components/LendSection/LendInformation'
import { getPair } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const pair = await getPair(query.id as string)

  return {
    props: {
      fallback: {
        [`/kashi/api/pair/${query.id}`]: pair,
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
  const pair = useMarket()
  if (!pair) return <></>
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
