import { Incentive } from 'features/onsen/context/Onsen'
import { IncentiveRepresentation } from 'features/onsen/context/representations'
import { getFarms } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'

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
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const address = router.query.address as string

  return (
    <SWRConfig value={{ fallback }}>
      <FarmsPage chainId={chainId} />
    </SWRConfig>
  )
}

export const FarmsPage: FC<{ chainId: number }> = ({ chainId }) => {
  const { data: incentiveRepresentations, isValidating } = useSWR<IncentiveRepresentation[]>(`/onsen/api/farms/${chainId}`, fetcher)

  const incentives = useMemo( () => incentiveRepresentations?.map(incentive => new Incentive({incentive})), [incentiveRepresentations])

  return (
    <div className="px-2 pt-16">
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
