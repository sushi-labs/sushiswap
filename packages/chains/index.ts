import chains from './chains.json'

export const CHAIN = Object.fromEntries(chains.map((data) => [data.chainId, data]))

export * from './types'

export default CHAIN
