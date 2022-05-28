import { Button } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { Incentive } from '../../features/onsen/context/Incentive'
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
  // const connect = useConnect()
  // const { data: account } = useAccount()
  // const { connecting, reconnecting } = useWalletState(connect, account?.address)
  const { data: incentiveRepresentations, isValidating } = useSWR<IncentiveRepresentation[]>(
    `/onsen/api/farms/${chainId}`,
    fetcher
  )

  const incentives = useMemo(
    () => incentiveRepresentations?.map((incentive) => new Incentive({ incentive })),
    [incentiveRepresentations]
  )

  return (
    <div className="px-2 pt-16">
      <Link passHref={true} href="/farm/create">
        <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
          create incentive
        </Button>
      </Link>
      {incentives?.length ? (
        Object.values(incentives).map((incentive) => (
          <div key={incentive.id}>
            {incentive.id} {``}
            {incentive.liquidityStaked.toExact()} {``}
            {incentive.liquidityStaked.currency.symbol} {``}
            {incentive.rewardRemaining.toExact()} {``}
            {incentive.rewardRemaining.currency.symbol} {``}
          </div>
        ))
      ) : (
        <div>
          <i>No incentives found..</i>
        </div>
      )}
    </div>
  )
}

export default _FarmsPage
