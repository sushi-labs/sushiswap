import { Extractor } from '@sushiswap/extractor'
import { baseTokens } from 'sushi'
// import { Token } from 'sushi/currency'
// import { TokenList } from 'sushi/token-list'
import { CHAIN_ID, EXTRACTOR_CONFIG } from './config/index.js'

export const cacheReadOnly = process.env['CACHE_READ_ONLY'] === 'true'

const extractor = new Extractor({
  ...EXTRACTOR_CONFIG[CHAIN_ID],
  cacheReadOnly,
})

// const start = Date.now()
// fetch('https://token-list.sushi.com')
//   .then((res) => res.json() as Promise<TokenList>)
//   .then((tokenList) => {
//     const additional = tokenList.tokens
//       .filter((token) => token.chainId === CHAIN_ID)
//       .map(
//         (token) =>
//           new Token({
//             chainId: token.chainId,
//             address: token.address,
//             decimals: token.decimals,
//             symbol: token.symbol,
//             name: token.name,
//           }),
//       )

//     return extractor.start(baseTokens(CHAIN_ID, true), additional)
//   })
//   .then(() => {
//     const time = Date.now() - start
//     console.log('Preload complete, took', time * 1000, 'seconds')
//   })
//   .catch((e) => {
//     console.log('Error fetching tokens to preload')
//     throw e
//   })

extractor.start(baseTokens(CHAIN_ID, true))

export default extractor
