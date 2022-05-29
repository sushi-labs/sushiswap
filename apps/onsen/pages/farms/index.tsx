import { Button } from '@sushiswap/ui'
import IncentiveTable from 'components/IncentiveTable'
import Layout from 'components/Layout'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useConnect, useNetwork } from 'wagmi'

import { IncentiveRepresentation } from '../../features/onsen/context/representations'
import { getFarms } from '../../graph/graph-client'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string') return { props: {} }

  return {
    props: {
      fallback: {
        [`/api/farms/${query.chainId}`]: await getFarms(query.chainId),
      },
    },
  }
}

const _FarmsPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <FarmsPage />
    </SWRConfig>
  )
}

export const FarmsPage: FC = () => {
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const connect = useConnect()
  const { data: incentiveRepresentations, isValidating } = useSWR<IncentiveRepresentation[]>(
    `/onsen/api/farms/${chainId}`,
    fetcher
  )

  return (
    <Layout>
      <div>
        <Link passHref={true} href="/farm/create">
          <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
            create incentive
          </Button>
        </Link>
      </div>
      <IncentiveTable
        incentives={incentiveRepresentations}
        chainId={activeChain?.id}
        loading={isValidating}
        placeholder="No incoming incentives found"
      />
    </Layout>
  )
}

export default _FarmsPage
