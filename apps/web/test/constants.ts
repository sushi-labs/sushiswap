import { ChainId } from 'sushi'
import { Amount, Native } from 'sushi/currency'

export let forkBlockNumber: bigint
if (process.env.ANVIL_BLOCK_NUMBER) {
  forkBlockNumber = BigInt(Number(process.env.ANVIL_BLOCK_NUMBER))
} else {
  forkBlockNumber = 16280770n
  // console.warn(
  //   `\`ANVIL_BLOCK_NUMBER\` not found. Falling back to \`${forkBlockNumber}\`.`,
  // )
}

export let forkUrl: string
if (process.env.ANVIL_FORK_URL) {
  forkUrl = process.env.ANVIL_FORK_URL
} else {
  forkUrl = 'https://cloudflare-eth.com'
  // console.warn(`\`ANVIL_FORK_URL\` not found. Falling back to \`${forkUrl}\`.`)
}

export let blockTime: number
if (process.env.ANVIL_BLOCK_TIME) {
  blockTime = Number(process.env.ANVIL_BLOCK_TIME)
} else {
  blockTime = 1
  // console.warn(
  //   `\`ANVIL_BLOCK_TIME\` not found. Falling back to \`${blockTime}\`.`,
  // )
}

export let anvilPort: number
if (process.env.ANVIL_PORT) {
  anvilPort = Number(process.env.ANVIL_PORT)
} else {
  anvilPort = 8545
  // console.warn(`\`ANVIL_PORT\` not found. Falling back to \`${anvilPort}\`.`)
}

export let chainId: typeof ChainId.ETHEREUM | typeof ChainId.POLYGON
if (process.env.NEXT_PUBLIC_CHAIN_ID) {
  chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
} else {
  chainId = 137
  // console.warn(`\`ANVIL_PORT\` not found. Falling back to \`${anvilPort}\`.`)
}

export const testWorkerIndex = Number(process.env.TEST_WORKER_INDEX ?? 0)
export const testParallelIndex = Number(process.env.TEST_PARALLEL_INDEX ?? 0)

export const localHttpUrl = `http://127.0.0.1:${anvilPort}/${testParallelIndex}`
export const localWsUrl = `ws://127.0.0.1:${anvilPort}/${testParallelIndex}`

// Assume 100MATIC for Polygon, 1PROBABLY_ETH for the rest
export const nativeAmounts: Partial<Record<ChainId, Amount<Native>>> = {
  [ChainId.POLYGON]: Amount.fromRawAmount(
    Native.onChain(ChainId.POLYGON),
    1e20,
  ),
}
export const nativeAmount =
  nativeAmounts[chainId] || Amount.fromRawAmount(Native.onChain(chainId), 1e18)
