import { getBuiltGraphSDK } from '../.graphclient'

const sdk = getBuiltGraphSDK()

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

sdk.CrossChainPairsWithFarms({
  chainIds: [1, 137],
})

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
