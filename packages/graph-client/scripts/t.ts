import { getSushiV3Pools } from '../src/subgraphs/sushi-v3/queries/pools'

const a = await getSushiV3Pools({ chainId: 8453, first: Infinity })

console.log('v3 pools:', a.length)
