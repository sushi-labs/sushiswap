import { JSBI } from '@sushiswap/math'

export interface TickData {
  tiers: {
    tick: number
    liquidity: string
    sqrtGamma: string
    nextTickBelow: number
    nextTickAbove: number
    ticks: {
      tickIdx: number
      tierId: number
      liquidityNet: string
    }[]
  }[]
}

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tickIdx: number
  price0: string
  liquidityActive: Record<number, JSBI>
  liquidityNet: Record<number, JSBI>
}

// Fetches all ticks for a given pool
export function useAllV3Ticks(): {
  isLoading: boolean
  isUninitialized?: boolean
  isError: boolean
  error?: unknown
  data: TickData | undefined
} {
  // const useSubgraph = pool ? CHAIN_IDS_WITH_SUBGRAPH_DATA.includes(pool.chainId) : false
  //
  // const tickLensTickData = useTicksFromTickLens(!useSubgraph ? pool : undefined)
  // const subgraphTickData = useTicksFromSubgraph(useSubgraph ? pool : undefined)
  //
  // return (useSubgraph ? subgraphTickData : tickLensTickData) as {
  //   isLoading: boolean
  //   isUninitialized?: boolean
  //   isError: boolean
  //   error?: unknown
  //   data: TickData | undefined
  // }

  return {
    isLoading: false,
    isError: false,
    data: {
      tiers: [
        {
          tick: 205216,
          liquidity: '14821271736535040',
          sqrtGamma: '99975',
          nextTickBelow: 204825,
          nextTickAbove: 205300,
          ticks: [
            {
              tickIdx: -776363,
              tierId: 0,
              liquidityNet: '25600',
            },
            {
              tickIdx: -776350,
              tierId: 0,
              liquidityNet: '18153401220352',
            },
            {
              tickIdx: 196250,
              tierId: 0,
              liquidityNet: '9445193779968',
            },
            {
              tickIdx: 198925,
              tierId: 0,
              liquidityNet: '17572008301568',
            },
            {
              tickIdx: 200300,
              tierId: 0,
              liquidityNet: '1708177302784',
            },
            {
              tickIdx: 200475,
              tierId: 0,
              liquidityNet: '923429178368',
            },
            {
              tickIdx: 200600,
              tierId: 0,
              liquidityNet: '4965885614592',
            },
            {
              tickIdx: 200725,
              tierId: 0,
              liquidityNet: '858359911680',
            },
            {
              tickIdx: 200900,
              tierId: 0,
              liquidityNet: '318224948736',
            },
            {
              tickIdx: 200925,
              tierId: 0,
              liquidityNet: '2880763546112',
            },
            {
              tickIdx: 201000,
              tierId: 0,
              liquidityNet: '27728318879232',
            },
            {
              tickIdx: 201025,
              tierId: 0,
              liquidityNet: '440231770873856',
            },
            {
              tickIdx: 201075,
              tierId: 0,
              liquidityNet: '458707348992',
            },
            {
              tickIdx: 201175,
              tierId: 0,
              liquidityNet: '2250588713472',
            },
            {
              tickIdx: 201650,
              tierId: 0,
              liquidityNet: '4374779648',
            },
            {
              tickIdx: 202225,
              tierId: 0,
              liquidityNet: '-425718785017600',
            },
            {
              tickIdx: 202600,
              tierId: 0,
              liquidityNet: '21032661378048',
            },
            {
              tickIdx: 202875,
              tierId: 0,
              liquidityNet: '25648210542080',
            },
            {
              tickIdx: 202925,
              tierId: 0,
              liquidityNet: '29809386608128',
            },
            {
              tickIdx: 203050,
              tierId: 0,
              liquidityNet: '324046731520',
            },
            {
              tickIdx: 203100,
              tierId: 0,
              liquidityNet: '13419198757376',
            },
            {
              tickIdx: 203200,
              tierId: 0,
              liquidityNet: '67623545255168',
            },
            {
              tickIdx: 203300,
              tierId: 0,
              liquidityNet: '1420514621440',
            },
            {
              tickIdx: 203450,
              tierId: 0,
              liquidityNet: '1644504273920',
            },
            {
              tickIdx: 203575,
              tierId: 0,
              liquidityNet: '3313059200256',
            },
            {
              tickIdx: 203625,
              tierId: 0,
              liquidityNet: '35434379126528',
            },
            {
              tickIdx: 204125,
              tierId: 0,
              liquidityNet: '-923429178368',
            },
            {
              tickIdx: 204225,
              tierId: 0,
              liquidityNet: '465653403148288',
            },
            {
              tickIdx: 204250,
              tierId: 0,
              liquidityNet: '-4105164414720',
            },
            {
              tickIdx: 204375,
              tierId: 0,
              liquidityNet: '-858359911680',
            },
            {
              tickIdx: 204425,
              tierId: 0,
              liquidityNet: '-466514124348160',
            },
            {
              tickIdx: 204475,
              tierId: 0,
              liquidityNet: '14574719074630656',
            },
            {
              tickIdx: 204550,
              tierId: 0,
              liquidityNet: '-318224948736',
            },
            {
              tickIdx: 204575,
              tierId: 0,
              liquidityNet: '-2880763546112',
            },
            {
              tickIdx: 204650,
              tierId: 0,
              liquidityNet: '-27728318879232',
            },
            {
              tickIdx: 204675,
              tierId: 0,
              liquidityNet: '-14512985856256',
            },
            {
              tickIdx: 204725,
              tierId: 0,
              liquidityNet: '-458707348992',
            },
            {
              tickIdx: 204825,
              tierId: 0,
              liquidityNet: '-2250588713472',
            },
            {
              tickIdx: 205300,
              tierId: 0,
              liquidityNet: '-4374779648',
            },
            {
              tickIdx: 205400,
              tierId: 0,
              liquidityNet: '-67623545255168',
            },
            {
              tickIdx: 205775,
              tierId: 0,
              liquidityNet: '-14574719074630656',
            },
            {
              tickIdx: 206225,
              tierId: 0,
              liquidityNet: '-21032661378048',
            },
            {
              tickIdx: 206525,
              tierId: 0,
              liquidityNet: '-25648210542080',
            },
            {
              tickIdx: 206575,
              tierId: 0,
              liquidityNet: '-29809386608128',
            },
            {
              tickIdx: 206700,
              tierId: 0,
              liquidityNet: '-324046731520',
            },
            {
              tickIdx: 206750,
              tierId: 0,
              liquidityNet: '-13419198757376',
            },
            {
              tickIdx: 206950,
              tierId: 0,
              liquidityNet: '-1420514621440',
            },
            {
              tickIdx: 207100,
              tierId: 0,
              liquidityNet: '-1644504273920',
            },
            {
              tickIdx: 207225,
              tierId: 0,
              liquidityNet: '-3313059200256',
            },
            {
              tickIdx: 208400,
              tierId: 0,
              liquidityNet: '-35434379126528',
            },
            {
              tickIdx: 209450,
              tierId: 0,
              liquidityNet: '-1708177302784',
            },
            {
              tickIdx: 209475,
              tierId: 0,
              liquidityNet: '-17572008301568',
            },
            {
              tickIdx: 210800,
              tierId: 0,
              liquidityNet: '-214232728576',
            },
            {
              tickIdx: 214175,
              tierId: 0,
              liquidityNet: '-9230961051392',
            },
            {
              tickIdx: 776350,
              tierId: 0,
              liquidityNet: '-18153401220352',
            },
            {
              tickIdx: 776363,
              tierId: 0,
              liquidityNet: '-25600',
            },
          ],
        },
        {
          tick: 205221,
          liquidity: '196967621209600',
          sqrtGamma: '99950',
          nextTickBelow: 202075,
          nextTickAbove: 205475,
          ticks: [
            {
              tickIdx: -776363,
              tierId: 1,
              liquidityNet: '25600',
            },
            {
              tickIdx: 196250,
              tierId: 1,
              liquidityNet: '132171064715776',
            },
            {
              tickIdx: 199350,
              tierId: 1,
              liquidityNet: '34073768098304',
            },
            {
              tickIdx: 202075,
              tierId: 1,
              liquidityNet: '30722788369920',
            },
            {
              tickIdx: 205475,
              tierId: 1,
              liquidityNet: '-34073768098304',
            },
            {
              tickIdx: 205725,
              tierId: 1,
              liquidityNet: '-30722788369920',
            },
            {
              tickIdx: 210125,
              tierId: 1,
              liquidityNet: '-132171064715776',
            },
            {
              tickIdx: 776363,
              tierId: 1,
              liquidityNet: '-25600',
            },
          ],
        },
        {
          tick: 205231,
          liquidity: '2460901608270080',
          sqrtGamma: '99900',
          nextTickBelow: 205075,
          nextTickAbove: 205275,
          ticks: [
            {
              tickIdx: -776363,
              tierId: 2,
              liquidityNet: '25600',
            },
            {
              tickIdx: 195625,
              tierId: 2,
              liquidityNet: '136631506047744',
            },
            {
              tickIdx: 200025,
              tierId: 2,
              liquidityNet: '96349584999680',
            },
            {
              tickIdx: 200050,
              tierId: 2,
              liquidityNet: '14640734116352',
            },
            {
              tickIdx: 200225,
              tierId: 2,
              liquidityNet: '1699454462243840',
            },
            {
              tickIdx: 200450,
              tierId: 2,
              liquidityNet: '1898889053696',
            },
            {
              tickIdx: 201000,
              tierId: 2,
              liquidityNet: '19963076245504',
            },
            {
              tickIdx: 201625,
              tierId: 2,
              liquidityNet: '60027478674944',
            },
            {
              tickIdx: 201825,
              tierId: 2,
              liquidityNet: '-96349584999680',
            },
            {
              tickIdx: 201850,
              tierId: 2,
              liquidityNet: '256574611231744',
            },
            {
              tickIdx: 202075,
              tierId: 2,
              liquidityNet: '48688727513088',
            },
            {
              tickIdx: 202375,
              tierId: 2,
              liquidityNet: '313136571194880',
            },
            {
              tickIdx: 202500,
              tierId: 2,
              liquidityNet: '74488330688768',
            },
            {
              tickIdx: 202550,
              tierId: 2,
              liquidityNet: '-136631506047744',
            },
            {
              tickIdx: 202625,
              tierId: 2,
              liquidityNet: '339233749903360',
            },
            {
              tickIdx: 202700,
              tierId: 2,
              liquidityNet: '-19963076245504',
            },
            {
              tickIdx: 203475,
              tierId: 2,
              liquidityNet: '360618714368',
            },
            {
              tickIdx: 203700,
              tierId: 2,
              liquidityNet: '-14640734116352',
            },
            {
              tickIdx: 203850,
              tierId: 2,
              liquidityNet: '167449712350208',
            },
            {
              tickIdx: 204100,
              tierId: 2,
              liquidityNet: '-1898889053696',
            },
            {
              tickIdx: 204525,
              tierId: 2,
              liquidityNet: '-74488330688768',
            },
            {
              tickIdx: 204875,
              tierId: 2,
              liquidityNet: '-167449712350208',
            },
            {
              tickIdx: 205075,
              tierId: 2,
              liquidityNet: '-256574611231744',
            },
            {
              tickIdx: 205275,
              tierId: 2,
              liquidityNet: '-60027478674944',
            },
            {
              tickIdx: 205475,
              tierId: 2,
              liquidityNet: '-1699454462243840',
            },
            {
              tickIdx: 205575,
              tierId: 2,
              liquidityNet: '-48688727513088',
            },
            {
              tickIdx: 206025,
              tierId: 2,
              liquidityNet: '-313136571194880',
            },
            {
              tickIdx: 207125,
              tierId: 2,
              liquidityNet: '-360618714368',
            },
            {
              tickIdx: 207550,
              tierId: 2,
              liquidityNet: '-339233749903360',
            },
            {
              tickIdx: 776363,
              tierId: 2,
              liquidityNet: '-25600',
            },
          ],
        },
        {
          tick: 206385,
          liquidity: '25600',
          sqrtGamma: '99800',
          nextTickBelow: -776363,
          nextTickAbove: 776363,
          ticks: [
            {
              tickIdx: -776363,
              tierId: 3,
              liquidityNet: '25600',
            },
            {
              tickIdx: 776363,
              tierId: 3,
              liquidityNet: '-25600',
            },
          ],
        },
      ],
    },
  }
}
