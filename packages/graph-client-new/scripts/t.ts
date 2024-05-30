import { getSushiV3Transactions } from '../src/subgraphs/sushi-v3/queries/transactions'

const a = await getSushiV3Transactions({ chainId: 1, first: 2001 })

console.log(a[0])
