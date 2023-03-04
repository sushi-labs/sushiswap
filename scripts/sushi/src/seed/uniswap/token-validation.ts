// import { client } from '@sushiswap/database'
// import fetch from 'isomorphic-unfetch'
// import { performance } from 'perf_hooks'

// import { TokenResponse, transform } from '../../etl/token/token-validation.js'

// async function main() {
//   const startTime = performance.now()
//   console.log(`Preparing to approve tokens`)

//   // EXTRACT
//   const tokenLists = await extract()
//   console.log(`EXTRACT - ${tokenLists.length} Tokens extracted from source`)

//   // TRANSFORM
//   const transformedTokens = await transform(tokenLists)
//   console.log(`TRANSFORM - ${transformedTokens.length} is transformed and ready for approval.`)

//   // LOAD
//   const batchSize = 200
//   let count = 0
//   for (let i = 0; i < transformedTokens.length; i += batchSize) {
//     const batch = transformedTokens.slice(i, i + batchSize)
//     const updates = batch.map((token) => client.token.update(token))
//     const results = await Promise.allSettled(updates)
//     console.log(`LOAD - ${results.length} tokens approved.`)
//     count += results.length
//   }
//   console.log(`LOAD - ${count} tokens updated`)
//   const endTime = performance.now()

//   console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
// }

// async function extract() {
//   const headers = {
//     'Content-Type': 'application/json',
//   }
//   const result: TokenResponse[] = await fetch(`https://extendedtokens.uniswap.org`, {
//     method: 'GET',
//     headers,
//   })
//     .then((response: any) => response.json())
//     .then((data: any) => {
//       const tokens = data.tokens
//       console.log(`${tokens.length} UniSwap tokens found`)
//       return tokens
//     })
//   return result
// }

// main()
//   .then(async () => {
//     await client.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await client.$disconnect()
//     process.exit(1)
//   })
