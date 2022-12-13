import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Prisma, PrismaClient, Token } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { calcTokenPrices, ConstantProductRPool } from '@sushiswap/tines'
import { performance } from 'perf_hooks'
import { PoolType, Price, ProtocolVersion } from '../config.js'

const prisma = new PrismaClient()

if (process.env.CHAIN_ID === undefined) {
  throw new Error('CHAIN_ID env var not set')
}

if (
  process.env.VERSION === undefined ||
  process.env.TYPE === undefined ||
  process.env.BASE === undefined ||
  process.env.PRICE === undefined
) {
  throw new Error(
    'VERSION, TYPE, BASE and PRICE env vars must be set, e.g. CHAIN_ID=137 VERSION=V2 TYPE=CONSTANT_PRODUCT_POOL BASE=0x2791bca1f2de4661ed88a30c99a7a9449aa84174 PRICE=USD'
  )
}
if (!isAddress(process.env.BASE)) {
  throw new Error(`${process.env.BASE} is not a valid address`)
}
const BASE = process.env.BASE.toLowerCase()
const CHAIN_ID = Number(process.env.CHAIN_ID) as ChainId
const TYPE = process.env.TYPE

if (TYPE !== PoolType.CONSTANT_PRODUCT_POOL) {
  throw new Error(
    `Pool type not supported, ${TYPE}. Current implementation only supports ${PoolType.CONSTANT_PRODUCT_POOL}`
  )
}

const CURRENT_SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]

if (!Object.values(CURRENT_SUPPORTED_VERSIONS).includes(process.env.VERSION as ProtocolVersion)) {
  throw new Error(
    `Protocol version (${process.env.VERSION}) not supported, supported versions: ${CURRENT_SUPPORTED_VERSIONS.join(
      ','
    )}`
  )
}

if (!Object.values(Price).includes(process.env.PRICE as Price)) {
  throw new Error(
    `Price (${process.env.PRICE}) not supported, supported price types: ${Object.values(Price).join(',')}`
  )
}
const PRICE = process.env.PRICE as Price

const VERSIONS = ['V2', 'LEGACY', 'TRIDENT']

async function main() {
  const startTime = performance.now()

  console.log(
    `Arguments: CHAIN_ID: ${CHAIN_ID}, VERSION: ${process.env.VERSION}, TYPE: ${TYPE}, BASE: ${process.env.BASE}, PRICE: ${process.env.PRICE}`
  )

  const baseToken = await getBaseToken(CHAIN_ID, BASE)
  const pools = await getPools(CHAIN_ID)


  const { constantProductPools, tokens } = transform(pools)
  const tokensToUpdate = calculatePrices(constantProductPools, baseToken, tokens)

  await updateTokenPrices(tokensToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

async function getBaseToken(chainId: ChainId, address: string) {
  const baseToken = await prisma.token.findFirst({
    select: {
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      chainId,
      address: address.toLowerCase(),
    },
  })

  if (!baseToken) throw new Error(`${baseToken} not found in database, check the address and chainId.`)
  return baseToken
}

async function getPools(chainId: ChainId) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsByPagination(chainId, batchSize)
    } else {
      result = await getPoolsByPagination(chainId, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
    totalCount += result.length
    results.push(result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pools with ${result.length} (${((requestEndTime - requestStartTime) / 1000).toFixed(
        1
      )}s). cursor: ${cursor}, total: ${totalCount}`
    )
  } while (cursor != null)
  const endTime = performance.now()
  const flatResult = results.flat()

  console.log(`Fetched ${flatResult.length} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return flatResult
}

async function getPoolsByPagination(
  chainId: ChainId,
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
): Promise<Pool[]> {
  return prisma.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
      address: true,
      token0: true,
      token1: true,
      swapFee: true,
      type: true,
      reserve0: true,
      reserve1: true,
    },
    where: {
      isWhitelisted: true,
      chainId,
      type: PoolType.CONSTANT_PRODUCT_POOL,
      version: {
        in: VERSIONS,
      },
    },
  })
}

function transform(pools: Pool[]) {
  const tokens: Map<string, Token> = new Map()
  const constantProductPools: ConstantProductRPool[] = []
  pools.forEach((pool) => {

    const token0 = {
      address: pool.token0.address,
      name: pool.token0.name,
      symbol: pool.token0.symbol,
    }
    const token1 = {
      address: pool.token1.address,
      name: pool.token1.name,
      symbol: pool.token1.symbol,
    }
    if (!tokens.has(token0.address)) tokens.set(token0.address, pool.token0)
    if (!tokens.has(token1.address)) tokens.set(token1.address, pool.token1)
    
    const amount0 = (Number(pool.reserve0) / 10 ** pool.token0.decimals)
    const amount1 = (Number(pool.reserve1) / 10 ** pool.token1.decimals)
    if (amount0 < 0.001 || amount1 < 0.001) {
      return
    }
    constantProductPools.push(
      new ConstantProductRPool(
        pool.address,
        token0,
        token1,
        pool.swapFee,
        BigNumber.from(pool.reserve0),
        BigNumber.from(pool.reserve1)
      )
    )
  })
  return { constantProductPools, tokens }
}

function calculatePrices(
  constantProductPools: ConstantProductRPool[],
  baseToken: { symbol: string; address: string; name: string; decimals: number },
  tokens: Map<string, Token>
) {
  const startTime = performance.now()
  const results = calcTokenPrices(constantProductPools, baseToken)
  const endTime = performance.now()
  console.log(`calcTokenPrices() found ${results.size} prices (${((endTime - startTime) / 1000).toFixed(1)}s). `)

  const tokensWithPrices = []

  for (const [rToken, value] of results.entries()) {
    const token = tokens.get(rToken.address)
    if (!token || value === 0) continue
    const price = Number((value / Math.pow(10, baseToken.decimals - token.decimals)).toFixed(12))
    if (price > Number.MAX_SAFE_INTEGER) continue
    // console.log(`${token.symbol}~${token.address}~${price}`)
    tokensWithPrices.push({ id: token.id, price })
  }

  return tokensWithPrices
}

async function updateTokenPrices(tokens: { id: string; price: number }[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const requests = batch.map((token) => {
      const data = PRICE === Price.USD ? { derivedUSD: token.price } : { derivedETH: token.price }
      return prisma.token.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id: token.id },
        data,
      })
    })
    const responses = await Promise.all(requests)
    console.log(`BATCH: Updated ${responses.length} prices.`)
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(`Updated ${updatedCount} prices (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface Pool {
  id: string
  address: string
  type: string
  token0: Token
  token1: Token
  swapFee: number
  reserve0: string
  reserve1: string
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
