import { FarmRepresentation } from 'features/onsen/context/representations'
import { getFarms } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
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
  const { data: farms, isValidating } = useSWR<FarmRepresentation[]>(`/onsen/api/farms/${chainId}`, fetcher)

  return (
    <div className="px-2 pt-16">
      {farms?.length ? (
        Object.values(farms).map((farm) => (
          <div key={farm.id}>
            {farm.id} {``}
            {farm.token.id} {``}
            {farm.rewardToken.id} {``}
            {new Date(parseInt(farm.endTime) * 1000).toLocaleString()} {``}
            {new Date(parseInt(farm.lastRewardTime) * 1000).toLocaleString()} {``}
            {farm.rewardRemaining} {``}
            {farm.liquidityStaked} {``}
          </div>
        ))
      ) : (
        <div>
          <i>No farms found..</i>
        </div>
      )}
    </div>
  )
}

export default _FarmsPage
