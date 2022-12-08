import { prisma, Prisma, PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { PairsQuery } from '../.graphclient'
import { mergePools } from './etl/pool/load'
import { filterPools } from './etl/pool/transform'
import { createTokens } from './etl/token/load'
import { filterTokensToCreate } from './etl/token/transform'
import fetch from 'isomorphic-unfetch'

const client = new PrismaClient()

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to approve tokens`)

  // EXTRACT
  const tokenLists = await extract()
  console.log(`EXTRACT - ${tokenLists.length} Tokens extracted from source`)

  // TRANSFORM
  const transformedTokens = await transform(tokenLists)

  // // LOAD
  // const batchSize = 500
  // let count = 0
  // for (let i = 0; i < transformedTokens.length; i += batchSize) {
  //   const batch = transformedTokens.slice(i, i + batchSize)
  //   const updates = batch.map((token) => client.token.update(token))
  //   const results = await Promise.allSettled(updates)

  //   const fulfilled = results.filter((result) => result.status === 'fulfilled')
  //   console.log(fulfilled.length)

  //   const rejected = results.filter((result) => result.status === 'rejected')
  //   console.log(rejected)
  //   count += fulfilled.length
  // }
  // console.log(`LOAD - ${count} tokens updated`)
  // const endTime = performance.now()

  // console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  // only a few kbs, no need to parallelize requests

  const headers = {
    'Content-Type': 'application/json',
  }
  const uniswap_eth: TokenResponse[] = await fetch(`https://api.coinmarketcap.com/data-api/v3/uniswap/all.json`, {
    method: 'GET',
    headers,
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      const tokens = data.tokens
      console.log(`${tokens.length} UniSwap tokens found`)
      return tokens
    })

  const sushiswap_all: TokenResponse[] = await fetch(`https://token-list.sushi.com`, {
    method: 'GET',
    headers,
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      const tokens = data.tokens
      console.log(`${tokens.length} SushiSwap tokens found`)
      return tokens
    })

  const quickswap_polygon: TokenResponse[] = await fetch(
    `https://raw.githubusercontent.com/sameepsi/quickswap-default-token-list/master/src/tokens/mainnet.json`,
    {
      method: 'GET',
      headers,
    }
  ).then(async (response: any) => {
    const json = await response.json()
    console.log(`${json.length} QuickSwap tokens found`)
    return json
  })

  const combined = [
    // uniswap_eth,
    sushiswap_all,
     quickswap_polygon
  ].flat()
  const unique = [
    ...new Map(combined.map((item) => [item.chainId.toString().concat(':').concat(item.address), item])).values(),
  ]
  if (unique.length !== combined.length) console.log(`${combined.length - unique.length} Duplicate tokens found`)
  return unique.flat()
}

async function transform(data: TokenResponse[]): Promise<Prisma.TokenUpdateArgs[]> {
  const existingTokens = await client.token.findMany({
    where: {
        id: {
          in: data.map((token) => token.chainId.toString().concat(':').concat(token.address.toLowerCase())),
        },
    },
  })
  let tokensToApproveCount = 0
  let tokensAlreadyApprovedCount = 0
  let tokensToCreateCount = 0
  const tokensToCreate = []
  for (const token of data) {
    const id = token.chainId.toString().concat(':').concat(token.address.toLowerCase())
    const existingToken = existingTokens.find((token) => token.id === id)
    if (existingToken) {
      if (existingToken.status !== 'APPROVED') {
        if (existingToken.decimals !== token.decimals)
          console.log(
            `Token ${id} ${token.symbol} decimals mismatch. DB: ${existingToken.decimals}, SOURCE: ${token.decimals}`
          )
        // if (existingToken.name !== token.name)
        //   console.log(`Token ${id} ${token.symbol} name mismatch. DB: ${existingToken.name}, SOURCE: ${token.name}`)
        if (existingToken.symbol !== token.symbol)
          console.log(
            `Token ${id} ${token.symbol} symbol mismatch. DB: ${existingToken.symbol}, SOURCE: ${token.symbol}`
          )
        tokensToApproveCount += 1
      } else {
        tokensAlreadyApprovedCount += 1
        // console.log(`Token ${id} ${token.symbol} already approved`)
      }
    } else {
      tokensToCreateCount += 1
      // console.log(`Token ${id} ${token.symbol} not found in the db`)
      tokensToCreate.push(token)
    }
  }
  console.log(
    `${tokensToApproveCount} needs approval, ${tokensAlreadyApprovedCount} already approved, ${tokensToCreateCount} should be created.`
  )
  // console.log("Tokens to create:")
  // for(const token of tokensToCreate) {
  //   console.log(`${token.symbol}, ${token.address}, ${token.chainId}, ${token.decimals}, ${token.name}`)
  // }

  return data.map(
    (token) =>
      ({
        where: {
          id: token.chainId.toString().concat(':').concat(token.address.toLowerCase()),
        },
        data: {
          decimals: token.decimals,
          name: token.name,
          symbol: token.symbol,
          status: 'APPROVED',
        },
      } as Prisma.TokenUpdateArgs)
  )
}

interface TokenResponse {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
