import type { Pair as PairDTO, Stake as StakeDTO } from '@sushiswap/graph-client'
import FarmTable from 'components/FarmTable'
import Layout from 'components/Layout'
import { RewardsAvailableModal } from 'components/RewardsAvailableModal'
import { updateIncentivePricing } from 'lib'
import { Farm } from 'lib/Farm'
import { getLegacyPairs, getPrice, getSubscribedIncentives, getUserFarms } from 'lib/graph'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useNetwork } from 'wagmi'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.address !== 'string') return { props: {} }

  return {
    props: {
      fallback: {
        [`/api/user/${query.address}/farms/${query.chainId}`]: await getUserFarms(query.chainId, query.address),
        [`/api/user/${query.address}/subscriptions/${query.chainId}`]: await getSubscribedIncentives(
          query.chainId,
          query.address
        ),
        [`/api/price/${query.chainId}`]: await getPrice(query.chainId),
        [`/api/legacy/${query.chainId}`]: await getLegacyPairs(query.chainId),
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
  // const connect = useConnect()

  const { data: subscriptions, isValidating: isValidatingSubscriptions } = useSWR<string[]>(
    `/onsen/api/user/${chainId}/${account?.address}/subscriptions`,
    fetcher
  )
  const { data: userStakes, isValidating: isValidatingStakes } = useSWR<StakeDTO[]>(
    `/onsen/api/user/${chainId}/${account?.address}/farms`,
    fetcher
  )
  const { data: prices, isValidating: isValidatingPrices } = useSWR<{ [key: string]: number }[]>(
    `/onsen/api/price/${chainId}`,
    fetcher
  )
  const { data: legacyPairs, isValidating: isValidatingLegacyPairs } = useSWR<PairDTO[]>(
    `/onsen/api/legacy/${chainId}`,
    fetcher
  )
  const isValidating = useMemo(
    () => isValidatingStakes || isValidatingSubscriptions || isValidatingPrices || isValidatingLegacyPairs,
    [isValidatingStakes, isValidatingSubscriptions, isValidatingPrices, isValidatingLegacyPairs]
  )

  const farms = useMemo(() => {
    if (isValidating) return []
    const now = new Date().getTime() / 1000
    const mappedFarms =
      userStakes
        ?.map(
          (stake) =>
            new Farm({
              chainId,
              token: stake.token,
              incentives: stake.farm.incentives.filter((incentive) => incentive.endTime >= now),
            })
        )
        .filter((farm) => farm.incentives.length) ?? []

    const parsedPrices = prices?.reduce((r, c) => ({ ...r, ...c }), {}) ?? {}
    const parsedLegacyPairs = legacyPairs?.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {} as Record<string, PairDTO>)
    mappedFarms.forEach((farm) => {
      farm.incentives.forEach((incentive) => {
        if (subscriptions?.includes(incentive.id)) {
          incentive.isSubscribed = true
        }
        updateIncentivePricing(incentive, parsedPrices, parsedLegacyPairs)
      })
    })
    return mappedFarms
  }, [userStakes, subscriptions, isValidating, legacyPairs, prices, chainId])

  return (
    <Layout>
      <RewardsAvailableModal farms={farms} chainId={activeChain?.id} />
      <FarmTable
        farms={farms}
        chainId={activeChain?.id}
        showIsSubscribed={true}
        loading={isValidating}
        placeholder="No farms found"
      />
    </Layout>
  )
}

export default _FarmsPage
