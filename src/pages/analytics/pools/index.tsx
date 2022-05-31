import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import PoolSearch from 'app/features/analytics/pools/PoolSearch'
import PoolTable from 'app/features/analytics/pools/PoolTable'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function Pools() {
  const { i18n } = useLingui()
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  // const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  // const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })
  // const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })
  // const block2w = useTwoWeekBlock({ chainId, shouldFetch: !!chainId })

  // const pairs = useSushiPairs({ chainId })
  // const pairs1d = useSushiPairs({ variables: { block: block1d }, shouldFetch: !!block1d, chainId })
  // const pairs2d = useSushiPairs({ variables: { block: block2d }, shouldFetch: !!block2d && type !== 'all', chainId }) // No need to fetch if we don't need the data
  // const pairs1w = useSushiPairs({ variables: { block: block1w }, shouldFetch: !!block1w, chainId })
  // const pairs2w = useSushiPairs({ variables: { block: block2w }, shouldFetch: !!block2w && type !== 'all', chainId })

  // const pairsFormatted = useMemo(() => {
  //   return type === 'all'
  //     ? // @ts-ignore TYPE NEEDS FIXING
  //       pairs?.map((pair) => {
  //         // @ts-ignore TYPE NEEDS FIXING
  //         const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
  //         // @ts-ignore TYPE NEEDS FIXING
  //         const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

  //         return {
  //           pair: {
  //             token0: pair.token0,
  //             token1: pair.token1,
  //             id: pair.id,
  //           },
  //           liquidity: pair.reserveUSD,
  //           volume1d: pair.volumeUSD - pair1d.volumeUSD,
  //           volume1w: pair.volumeUSD - pair1w.volumeUSD,
  //         }
  //       })
  //     : pairs
  //         // @ts-ignore TYPE NEEDS FIXING
  //         ?.map((pair) => {
  //           // @ts-ignore TYPE NEEDS FIXING
  //           const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
  //           // @ts-ignore TYPE NEEDS FIXING
  //           const pair2d = pairs2d?.find((p) => pair.id === p.id) ?? pair1d
  //           // @ts-ignore TYPE NEEDS FIXING
  //           const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair2d
  //           // @ts-ignore TYPE NEEDS FIXING
  //           const pair2w = pairs2w?.find((p) => pair.id === p.id) ?? pair1w

  //           return {
  //             pair: {
  //               token0: pair.token0,
  //               token1: pair.token1,
  //               id: pair.id,
  //             },
  //             liquidityChangeNumber1d: pair.reserveUSD - pair1d.reserveUSD,
  //             liquidityChangePercent1d: (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100,
  //             liquidityChangeNumber1w: pair.reserveUSD - pair1w.reserveUSD,
  //             liquidityChangePercent1w: (pair.reserveUSD / pair1w.reserveUSD) * 100 - 100,

  //             volumeChangeNumber1d: pair.volumeUSD - pair1d.volumeUSD - (pair1d.volumeUSD - pair2d.volumeUSD),
  //             volumeChangePercent1d:
  //               ((pair.volumeUSD - pair1d.volumeUSD) / (pair1d.volumeUSD - pair2d.volumeUSD)) * 100 - 100,
  //             volumeChangeNumber1w: pair.volumeUSD - pair1w.volumeUSD - (pair1w.volumeUSD - pair2w.volumeUSD),
  //             volumeChangePercent1w:
  //               ((pair.volumeUSD - pair1w.volumeUSD) / (pair1w.volumeUSD - pair2w.volumeUSD)) * 100 - 100,
  //           }
  //         })
  //         // @ts-ignore TYPE NEEDS FIXING
  //         .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
  // }, [type, pairs, pairs1d, pairs2d, pairs1w, pairs2w])

  return (
    <>
      <NextSeo title={`Pool Anlytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Pool Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Click on the column name to sort pairs by its TVL, volume, fees or APY.`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <PoolSearch />
          <PoolTable chainId={chainId} />
        </div>
      </TridentBody>
    </>
  )
}
