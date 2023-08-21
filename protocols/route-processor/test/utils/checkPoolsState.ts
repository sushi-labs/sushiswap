// import { expect } from 'chai'

// function closeValues(_a: number | bigint, _b: number | bigint, accuracy: number, absolute: number): boolean {
//   const a: number = typeof _a === 'number' ? _a : parseInt(_a.toString())
//   const b: number = typeof _b === 'number' ? _b : parseInt(_b.toString())
//   if (accuracy === 0) return a === b
//   if (Math.abs(a - b) < absolute) return true
//   // if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
//   // if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
//   return Math.abs(a / b - 1) < accuracy
// }

// function expectCloseValues(
//   _a: number | bigint,
//   _b: number | bigint,
//   accuracy: number,
//   absolute: number,
//   logInfoIfFalse = ''
// ) {
//   const res = closeValues(_a, _b, accuracy, absolute)
//   if (!res) {
//     console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
//     // debugger
//     expect(res).equal(true)
//   }
//   return res
// }

// export async function checkPoolsState(pools: Map<string, PoolCode>, user: SignerWithAddress, chainId: ChainId) {
//   const bentoAddress = bentoBoxV1Address[chainId as BentoBoxV1ChainId]
//   const bentoContract = new Contract(bentoAddress, ['function totals(address) view returns (uint128, uint128)'], user)

//   const addresses = Array.from(pools.keys())
//   for (let i = 0; i < addresses.length; ++i) {
//     const addr = addresses[i]
//     const pool = (pools.get(addr) as PoolCode).pool
//     if (pool instanceof StableSwapRPool) {
//       const poolContract = new Contract(addr, ['function getReserves() view returns (uint256, uint256)'], user)

//       const totals0 = await bentoContract.totals(pool.token0.address)
//       const token0 = pool.token0.symbol
//       expectCloseValues(pool.getTotal0().elastic, totals0[0], 1e-10, 10, `StableSwapRPool ${addr} ${token0}.elastic`)
//       expectCloseValues(pool.getTotal0().base, totals0[1], 1e-10, 10, `StableSwapRPool ${addr} ${token0}.base`)

//       const totals1 = await bentoContract.totals(pool.token1.address)
//       const token1 = pool.token1.symbol
//       expectCloseValues(pool.getTotal1().elastic, totals1[0], 1e-10, 10, `StableSwapRPool ${addr} ${token1}.elastic`)
//       expectCloseValues(pool.getTotal1().base, totals1[1], 1e-10, 10, `StableSwapRPool ${addr} ${token1}.base`)

//       const reserves = await poolContract.getReserves()
//       expectCloseValues(
//         pool.getReserve0(),
//         toShareBI(reserves[0], pool.getTotal0()),
//         1e-10,
//         1e6,
//         `StableSwapRPool ${addr} reserve0`
//       )
//       expectCloseValues(
//         pool.getReserve1(),
//         toShareBI(reserves[1], pool.getTotal1()),
//         1e-10,
//         1e6,
//         `StableSwapRPool ${addr} reserve1`
//       )
//     } else if (pool instanceof ConstantProductRPool) {
//       const poolContract = new Contract(addr, ['function getReserves() view returns (uint112, uint112)'], user)
//       const reserves = await poolContract.getReserves()
//       expectCloseValues(pool.getReserve0(), reserves[0], 1e-10, 10, `CP ${addr} reserve0`)
//       expectCloseValues(pool.getReserve1(), reserves[1], 1e-10, 10, `CP ${addr} reserve1`)
//     } else if (pool instanceof BridgeBento) {
//       const totals = await bentoContract.totals(pool.token1.address)
//       expectCloseValues(pool.elastic, totals[0], 1e-10, 10, `BentoBridge ${pool.token1.symbol} elastic`)
//       expectCloseValues(pool.base, totals[1], 1e-10, 10, `BentoBridge ${pool.token1.symbol} base`)
//     } else if (pool instanceof BridgeUnlimited) {
//       // native - skip
//     } else if (pool instanceof UniV3Pool) {
//       // TODO: add pool check
//     } else {
//       console.log('Unknown pool: ', pool.address)
//     }
//   }
// }
