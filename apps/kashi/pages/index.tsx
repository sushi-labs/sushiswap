import { ChainId } from '@sushiswap/chain'
import { Button, NetworkIcon, Typography } from '@sushiswap/ui'
import { Layout, MarketsSection } from 'components'
import { DEFAULT_MARKETS, SUPPORTED_CHAIN_IDS } from 'config'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { getPairs } from '../lib/api'
import { KashiPair } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const chainIds = (query.chianIds as string[]) || SUPPORTED_CHAIN_IDS

  const [lending, borrowing] = await Promise.all([
    Promise.all(
      DEFAULT_MARKETS.map((addressMap) =>
        Promise.all(
          chainIds
            .filter((chainId) => chainId in addressMap)
            .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
              previousValue[i] = getPairs({
                first: 1000,
                // orderBy: 'supplyAPR',
                // orderDirection: 'desc',
                where: { asset: addressMap[currentValue].toLowerCase() },
                chainIds: [currentValue],
              }).then((pairs) => {
                return pairs.sort((a, b) => {
                  const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
                  const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
                  if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
                  return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
                })
              })
              return previousValue
            }, [])
        ).then((pairs) =>
          pairs
            .flat()
            .sort((a, b) => {
              const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
              const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
              if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
              return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
            })
            .slice(0, 1)
        )
      )
    ).then((pairs) =>
      pairs.flat().sort((a, b) => {
        const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
        const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
        if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
        return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
      })
    ),
    Promise.all(
      DEFAULT_MARKETS.map((addressMap) =>
        Promise.all(
          chainIds
            .filter((chainId) => chainId in addressMap)
            .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
              previousValue[i] = getPairs({
                first: 1,
                orderBy: 'totalBorrowUSD',
                orderDirection: 'desc',
                where: { asset: addressMap[currentValue].toLowerCase() },
                chainIds: [currentValue],
              })
              return previousValue
            }, [])
        ).then((pairs) =>
          pairs
            .flat()
            .sort((a, b) => {
              console.log({ totalBorrowUSD: a.totalBorrowUSD })
              if (b.totalBorrowUSD === a.totalBorrowUSD) return 0
              return b.totalBorrowUSD < a.totalBorrowUSD ? -1 : 1
            })
            .slice(0, 1)
        )
      )
    ).then((pairs) =>
      pairs.flat().sort((a, b) => {
        if (b.totalBorrowUSD === a.totalBorrowUSD) return 0
        return b.totalBorrowUSD < a.totalBorrowUSD ? -1 : 1
      })
    ),
  ])
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'currentSupplyAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: DEFAULT_MARKETS.length,
            },
          },
        })]: lending,
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'totalBorrowUSD',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: DEFAULT_MARKETS.length,
            },
          },
        })]: borrowing,
      },
    },
  }
}

const Index: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Index />
    </SWRConfig>
  )
}

const _Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Typography variant="h3" weight={600}>
            Lending
          </Typography>
          <Typography weight={400} className="text-slate-300">
            Lend, borrow or margin trade with low liquidiation risk, and earn staking rewards! Available on
          </Typography>
          <div>
            <Button className="!px-6">My Position (0)</Button>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="relative rounded-full h-[240px] w-[240px] border-2 border-dashed border-slate-700 flex items-center justify-center">
            {/* <div className="w-[140px]">
              <Image src="https://www.sushi.com/kashi/images/KashiKanjiSign.png" alt="Kashi" layout="fill" />
            </div> */}
            <NetworkIcon width={32} chainId={ChainId.ETHEREUM} className="absolute top-0 right-9" />
            <NetworkIcon width={32} chainId={ChainId.ARBITRUM} className="absolute right-0 bottom-9" />
            <NetworkIcon width={32} chainId={ChainId.BSC} className="absolute left-0 top-9" />
            <NetworkIcon width={32} chainId={ChainId.POLYGON} className="absolute bottom-0 left-9" />
          </div>
        </div>
      </div>
      <MarketsSection />
    </Layout>
  )
}

export default Index
