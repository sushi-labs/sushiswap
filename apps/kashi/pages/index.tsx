import { ChainId } from '@sushiswap/chain'
import { DAI_ADDRESS } from '@sushiswap/currency'
import { Button, NetworkIcon, Typography } from '@sushiswap/ui'
import { Layout, MarketsSection } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { getPairs } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const chainIds = (query.chianIds as string[]) || SUPPORTED_CHAIN_IDS

  const [pairs, borrowPairs] = await Promise.all([
    Promise.all(
      chainIds
        .filter((chainId) => chainId in DAI_ADDRESS)
        .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
          previousValue[i] = getPairs({
            first: 1,
            // skip: 0,
            orderBy: 'supplyAPR',
            orderDirection: 'desc',
            where: { asset: DAI_ADDRESS[currentValue].toLowerCase(), totalBorrow_: { base_not: '0' } },
          })

          return previousValue
        }, [])
    ).then((pairs) => {
      return pairs
        .flat()
        .sort((a, b) => {
          return Number(b['supplyAPR']) - Number(a['supplyAPR'])
        })
        .slice(0, 1)
    }),
    getPairs({
      first: 20,
      skip: 0,
      orderBy: 'borrowAPR',
      orderDirection: 'desc',
    }),
  ])
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'supplyAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })]: pairs,
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'borrowAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })]: borrowPairs,
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
            Kashi Lending
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
            <div className="w-[140px]">
              <Image src="https://www.sushi.com/kashi/images/KashiKanjiSign.png" layout="fill" />
            </div>
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
