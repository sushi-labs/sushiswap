import { ChainId } from '@sushiswap/chain'
import {
  DAI_ADDRESS,
  MIM_ADDRESS,
  SUSHI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WETH9_ADDRESS,
  WNATIVE_ADDRESS,
  XSUSHI_ADDRESS,
} from '@sushiswap/currency'
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
  // const assets = chainIds.reduce<string[]>((previousValue, currentValue, i) => {
  //   const chainId = Number(currentValue)
  // if (chainId in WNATIVE_ADDRESS) previousValue[i] = WNATIVE_ADDRESS[chainId].toLowerCase()
  // if (chainId in WBTC_ADDRESS) previousValue[i] = WBTC_ADDRESS[chainId].toLowerCase()
  // if (chainId in SUSHI_ADDRESS) previousValue[i] = SUSHI_ADDRESS[chainId].toLowerCase()
  // if (chainId in XSUSHI_ADDRESS) previousValue[i] = XSUSHI_ADDRESS[chainId].toLowerCase()
  // if (chainId in USDC_ADDRESS) previousValue[i] = USDC_ADDRESS[chainId].toLowerCase()
  // if (chainId in USDT_ADDRESS) previousValue[i] = USDT_ADDRESS[chainId].toLowerCase()
  // if (chainId in DAI_ADDRESS) previousValue[i] = DAI_ADDRESS[chainId].toLowerCase()
  // if (chainId in FRAX_ADDRESS) previousValue[i] = FRAX_ADDRESS[chainId].toLowerCase()
  // if (chainId in MIM_ADDRESS) previousValue[i] = MIM_ADDRESS[chainId].toLowerCase()
  //   return previousValue
  // }, [])

  // get first pair for each configured base lending market, ordered by supplyAPR

  const [pairs, borrowPairs] = await Promise.all([
    Promise.all([
      Promise.all(
        chainIds
          .filter((chainId) => chainId in USDC_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: USDC_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in USDT_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: USDT_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in DAI_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: DAI_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in WETH9_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: WETH9_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in WNATIVE_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: WNATIVE_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in MIM_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: MIM_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in XSUSHI_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: XSUSHI_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
      Promise.all(
        chainIds
          .filter((chainId) => chainId in SUSHI_ADDRESS)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              skip: 0,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: SUSHI_ADDRESS[currentValue].toLowerCase() },
              // where: { asset_in: assets },
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            return Number(b['supplyAPR']) - Number(a['supplyAPR'])
          })
          .slice(0, 1)
      ),
    ]).then((pairs) =>
      pairs.flat().sort((a, b) => {
        return Number(b['supplyAPR']) - Number(a['supplyAPR'])
      })
    ),
    // getPairs({
    //   first: 1,
    //   skip: 0,
    //   orderBy: 'supplyAPR',
    //   orderDirection: 'desc',
    //   where: { totalBorrow_: { base_not: '0' }, asset: SUSHI_ADDRESS[chainId].toLowerCase() },
    //   // where: { asset_in: assets },
    // }),
    getPairs({
      first: 20,
      skip: 0,
      orderBy: 'borrowAPR',
      orderDirection: 'desc',
      // where: { asset_in: assets },
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
