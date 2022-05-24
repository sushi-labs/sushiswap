import { FarmRepresentation, TridentPoolRepresentation } from 'features/onsen/context/representations'
import { FarmType } from 'features/onsen/context/types'
import { getFarm, getFarmToken } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { getFarmType } from '../../../functions'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }
  const farm = await getFarm(query.chainId, query.id)
  if (!farm) return { props: {} }
  const tokenId = farm.token.id
  const farmType = getFarmType(farm.token.name)
  
  return {
    props: {
      fallback: {
        [`/api/farm/${query.chainId}/${query.id}`]: farm,
        [`/api/farm-token/${query.chainId}/${farmType}/${tokenId}`]: await getFarmToken(
          query.chainId,
          query.id,
          farmType,
        ),
        farmType
      },
    },
  }
}

const _FarmPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const id = router.query.id as string
  return (
    <SWRConfig value={{ fallback }}>
      <FarmPage chainId={chainId} id={id} farmType={fallback?.farmType} />
    </SWRConfig>
  )
}

export const FarmPage: FC<{ chainId: number; id: string; farmType?: FarmType }> = ({ chainId, id, farmType }) => {

  const { data: farm, isValidating: isValidatingFarm } = useSWR<FarmRepresentation>(
    `/onsen/api/farm/${chainId}/${id}`,
    fetcher,
  )
  const { data: farmToken, isValidating: isValidatingFarmToken } = useSWR<TridentPoolRepresentation>(
    `/onsen/api/farm-token/${chainId}/${farmType}/${farm?.token.id}`,
    fetcher,
  )

  const trident = (pool: TridentPoolRepresentation) => {
    return (
      <div key={pool.id}>
        <div>
          {' '}
          Pool: {pool.assets[0].token.symbol}
          {`/`}
          {pool.assets[1].token?.symbol}
        </div>
        <div> Volume: {pool.kpi.volume}</div>
        <div> Volume USD: {pool.kpi.volumeUSD}</div>
      </div>
    )
  }

  return (
    <>
      <h1>Farm</h1>
      {farmToken ? (
        trident(farmToken)
      ) : (
        <div>
          <i>No Farm found..</i>
        </div>
      )}

      <h2>Reward</h2>
      {farm ? (
        <div key={farm.id}>
          {farm.id} {``}
          {/* {farm.token.name} {``}
          {farm.rewardToken.name} {``} */}
          {new Date(parseInt(farm.endTime) * 1000).toLocaleString()} {``}
          {new Date(parseInt(farm.lastRewardTime) * 1000).toLocaleString()} {``}
          {farm.rewardRemaining} {``}
          {farm.liquidityStaked} {``}
        </div>
      ) : (
        <div>
          <i>No Incentive found..</i>
        </div>
      )}
    </>
  )
}

export default _FarmPage
