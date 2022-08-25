import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Container, Link, Typography } from '@sushiswap/ui'
import { useFarmRewards } from '@sushiswap/wagmi'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  AddSectionLegacy,
  AddSectionMyPosition,
  AddSectionStake,
  AddSectionStepper,
  AddSectionTrident,
  Layout,
} from '../../components'
import { getPool } from '../../lib/api'
import { PairWithAlias } from '../../types'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pair] = await Promise.all([getPool(query.id as string)])

  return {
    props: {
      fallback: {
        [`/pool/api/pool/${query.id}`]: { pair },
      },
    },
  }
}

const Add: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Add />
    </SWRConfig>
  )
}

const _Add = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const { data: rewards } = useFarmRewards()

  if (!data) return <></>
  const { pair } = data
  const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
        <div className="hidden md:block" />
        <div className="order-3 sm:order-2 flex flex-col gap-3 pb-40">
          {pair.source === 'TRIDENT' ? (
            <AddSectionTrident pair={pair} isFarm={!!incentives} />
          ) : (
            <AddSectionLegacy pair={pair} isFarm={!!incentives} />
          )}
          {incentives && <AddSectionStake pair={pair} />}
          <Container className="flex justify-center">
            <Link.External
              href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
              className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
            >
              <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-500">
                Learn more about liquidity and yield farming
                <ExternalLinkIcon width={16} height={16} className="text-slate-500" />
              </Typography>
            </Link.External>
          </Container>
        </div>
        {incentives && (
          <div className="order-1 sm:order-3">
            <div className="flex flex-col bg-white bg-opacity-[0.04] rounded-2xl">
              <AddSectionStepper pair={pair} />
              <div className="px-5">
                <hr className="h-px border-t border-slate-200/5" />
              </div>
              <AddSectionMyPosition pair={pair} />
            </div>
          </div>
        )}
      </div>
      <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
    </Layout>
  )
}

export default Add
