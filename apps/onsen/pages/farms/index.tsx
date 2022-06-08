import { Farm as FarmDTO, Pair as PairDTO } from '@sushiswap/graph-client'
import { Button } from '@sushiswap/ui'
import FarmTable from 'components/FarmTable'
import Layout from 'components/Layout'
import { Farm } from 'lib/Farm'
import { updateIncentivePricing } from 'lib/mapper'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useNetwork } from 'wagmi'

import { getFarms, getLegacyPairs, getPrice } from '../../lib/graph'

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
  const { data: farmsDTO, isValidating: isValidatingFarms } = useSWR<FarmDTO[]>(`/onsen/api/farms/${chainId}`, fetcher)
  const { data: prices, isValidating: isValidatingPrices } = useSWR<{ [key: string]: number }[]>(
    `/onsen/api/price/${chainId}`,
    fetcher
  )
  const { data: legacyPairs, isValidating: isValidatingLegacyPairs } = useSWR<PairDTO[]>(
    `/onsen/api/legacy/${chainId}`,
    fetcher
  )
  const isValidating = useMemo(
    () => isValidatingFarms || isValidatingPrices || isValidatingLegacyPairs,
    [isValidatingFarms, isValidatingPrices, isValidatingLegacyPairs]
  )

  const farms = useMemo(() => {
    if (isValidating || !farmsDTO) {
      return
    }
    const mappedFarms = farmsDTO.map(
      (farm) =>
        new Farm({
          token: farm.stakeToken,
          incentives: farm.incentives,
        })
    )
    const parsedPrices = prices?.reduce((r, c) => ({ ...r, ...c }), {}) ?? {}
    const parsedLegacyPairs = legacyPairs?.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {} as Record<string, PairDTO>)
    mappedFarms.forEach((farm) => {
      farm.incentives.forEach((incentive) => {
        updateIncentivePricing(incentive, parsedPrices, parsedLegacyPairs)
      })
    })
    return mappedFarms
  }, [prices, isValidating, legacyPairs, farmsDTO])

  return (
    <Layout>
      <div className="flex p-4 gap-7">
        <Link passHref={true} href="/farm/create">
          <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
            Create Farm
          </Button>
        </Link>

        <Link passHref={true} href={`/users/${account?.address}?chainId=${chainId}`}>
          <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
            My Farms
          </Button>
        </Link>
      </div>
      <FarmTable
        farms={farms}
        chainId={activeChain?.id}
        showSubscribeAction={true}
        loading={isValidating}
        placeholder="No farms found"
      />
    </Layout>
  )
}

export default _FarmsPage
