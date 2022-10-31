// const { crossChainRebases: sdkRebases } = await sdk.CrossChainRebases({
//   first: 100,
//   skip: 0,
//   chainIds: [1],
// })
// console.log({ sdkRebases: sdkRebases.shift() })
// sdk
//   .CrossChainLiquidityPositions({
//     where: { user: '0x8f54c8c2df62c94772ac14ccfc85603742976312' },
//     chainIds: [1],
//   })
//   .then(({ crossChainLiquidityPositions }) => {
//     console.log({ crossChainLiquidityPositions })
//   })

import { getBuiltGraphSDK } from '../.graphclient'

const sdk = getBuiltGraphSDK()

;(async () => {
  // sdk.CrossChainPairsWithFarms({
  //   chainIds: [1, 137],
  // })
  // const [{ prices: pricesv0 }, { prices: pricesv1 }] = await Promise.all([sdk.PricesV0({ chainId: 1 }), sdk.PricesV1()])
  // console.log(pricesv0, pricesv1)
  // const [{ farms: farmsv0 }] = await Promise.all([sdk.FarmsV0()])
  // console.log(farmsv0)

  // PAIRS BY CHAIN ID
  // const { pairs } = await sdk.PairsByChainId({ chainId: 1 })
  // console.log('pairsByChainId', pairs)

  // PAIRS BY CHAIN IDS
  // const { pairs } = await sdk.PairsByChainIds({ chainIds: [1, 137] })
  // console.log('pairsByChainIds', pairs)

  // const { pairsByChainIds } = await sdk.PairsByChainIds({ chainIds: [1, 137] })

  // const [{ crossChainBlocks }] = await Promise.all([sdk.CrossChainBlocks({ chainIds: [1, 137] })])

  // PAIR WITH FARMS
  const { pairs } = await sdk.PairsWithFarms({ chainIds: [1, 137], farmsOnly: true })
  console.log('PairsWithFarms', pairs)
})()

// sdk
//   .CrossChainPairs({
//     chainIds: [1, 137],
//   })
//   .then(({ crossChainPairs }) => {
//     // console.log({ crossChainPairs })
//   })

// sdk
//   .CrossChainUserWithFarms({
//     id: '0x8f54c8c2df62c94772ac14ccfc85603742976312',
//     chainIds: [1],
//   })
//   .then(({ crossChainUserWithFarms }) => {
//     console.log({ crossChainUserWithFarms })
//   })
