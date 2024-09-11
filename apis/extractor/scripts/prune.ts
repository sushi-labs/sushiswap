import { FileHandle, open } from 'fs/promises'

const chainId = process.env.CHAIN_ID

if (!chainId) {
  throw Error('CHAIN_ID environment variable not set')
}

const cacheDir = process.env.CACHE_DIR

if (!cacheDir) {
  throw Error('CACHE_DIR environment variable not set')
}

let prices: string[]

function percentage(x: number, y: number, fixed = 2) {
  const percent = (x / y) * 100
  return percent.toFixed(fixed)
}

async function prune(
  path: string,
  accessors: 'address' | ('token0' | 'token1')[],
  minLines = 1000,
): Promise<[number, number, number, number]> {
  let valid = 0
  let invalid = 0
  let duplicate = 0
  let removed = 0

  let file: FileHandle | null = null

  try {
    file = await open(path, 'r+')
    const data = await file.readFile('utf8')
    const set = new Set<string>()
    const records: {
      address: string
    }[] &
      {
        address: string
        token0: string
        token1: string
      }[] = []
    const lines = data.split('\n')
    if (lines.length < minLines) {
      throw Error('Too few lines to prune')
    }

    for (const line of lines) {
      if (line === '') {
        //   console.log('Empty line')
        continue
      }
      try {
        const record: {
          address: string
        } & {
          address: string
          token0: string
          token1: string
        } = JSON.parse(line)
        valid++
        if (set.has(record.address)) {
          duplicate++
          // console.log(`Duplicate record: ${record.address}`)
          continue
        }
        set.add(record.address)
        if (
          (typeof accessors === 'string' &&
            !prices.includes(record[accessors])) ||
          (typeof accessors !== 'string' &&
            accessors.some((accessor) => !prices.includes(record[accessor])))
        ) {
          removed++
          continue
        }
        records.push(record)
      } catch {
        invalid++
      }
    }

    await file.truncate(0)
    await file.write(
      records.reduce(
        (previousValue, currentValue) =>
          `${previousValue}${JSON.stringify(currentValue)}\n`,
        '',
      ),
      0,
    )
  } finally {
    await file?.close()
  }

  return [valid, invalid, duplicate, removed]
}
;(async () => {
  try {
    prices = await fetch(`https://api.sushi.com/price/v1/${chainId}`)
      .then((res) => res.json())
      .then(Object.keys)
  } catch {
    console.warn('Failed to fetch prices, skipping pruning')
    return
  }

  try {
    console.log(`Analyzing cache for chain ${chainId}...`)

    const [validTokens, invalidTokens, duplicateTokens, removedTokens] =
      await prune(`${cacheDir}/tokens-${chainId}`, 'address')
    console.log(
      `Tokens, Valid: ${validTokens} Invalid: ${invalidTokens} Duplicate: ${duplicateTokens} Removed: ${removedTokens} (${percentage(
        removedTokens,
        validTokens,
      )}%) Remaining: ${validTokens - removedTokens} (${percentage(
        validTokens - removedTokens,
        validTokens,
      )}%)`,
    )
  } catch (_e) {
    // console.error(e)
  }

  try {
    const [
      validUniswapV2Pools,
      invalidUniswapV2Pools,
      duplicateUniswapV2Pools,
      removedUniswapV2Pools,
    ] = await prune(`${cacheDir}/uniV2Pools-${chainId}`, ['token0', 'token1'])
    console.log(
      `UniswapV2, Valid: ${validUniswapV2Pools} Invalid: ${invalidUniswapV2Pools} Duplicate: ${duplicateUniswapV2Pools} Removed: ${removedUniswapV2Pools} (${percentage(
        removedUniswapV2Pools,
        validUniswapV2Pools,
      )}%) Remaining: ${
        validUniswapV2Pools - removedUniswapV2Pools
      } (${percentage(
        validUniswapV2Pools - removedUniswapV2Pools,
        validUniswapV2Pools,
      )}%)`,
    )
  } catch (_e) {
    // console.error(e)
  }

  try {
    const [
      validUniswapV3Pools,
      invalidUniswapV3Pools,
      duplicateUniswapV3Pools,
      removedUniswapV3Pools,
    ] = await prune(`${cacheDir}/uniV3Pools-${chainId}`, ['token0', 'token1'])

    console.log(
      `UniswapV3, Valid: ${validUniswapV3Pools} Invalid: ${invalidUniswapV3Pools} Duplicate: ${duplicateUniswapV3Pools} Removed: ${removedUniswapV3Pools} (${percentage(
        removedUniswapV3Pools,
        validUniswapV3Pools,
      )}%) Remaining: ${
        validUniswapV3Pools - removedUniswapV3Pools
      } (${percentage(
        validUniswapV3Pools - removedUniswapV3Pools,
        validUniswapV3Pools,
      )}%)`,
    )
  } catch (_e) {
    // console.error(e)
  }

  try {
    const [
      validAlgebraIntegralPools,
      invalidAlgebraIntegralPools,
      duplicateAlgebraIntegralPools,
      removedAlgebraIntegralPools,
    ] = await prune(`${cacheDir}/AlgebraPools-${chainId}`, ['token0', 'token1'])

    console.log(
      `Algebra Integral, Valid: ${validAlgebraIntegralPools} Invalid: ${invalidAlgebraIntegralPools} Duplicate: ${duplicateAlgebraIntegralPools} Removed: ${removedAlgebraIntegralPools} (${percentage(
        removedAlgebraIntegralPools,
        validAlgebraIntegralPools,
      )}%) Remaining: ${
        validAlgebraIntegralPools - removedAlgebraIntegralPools
      } (${percentage(
        validAlgebraIntegralPools - removedAlgebraIntegralPools,
        validAlgebraIntegralPools,
      )}%)`,
    )
  } catch (_e) {
    // console.error(e)
  }

  try {
    const [
      validSlipstreamPools,
      invalidSlipstreamPool,
      duplicateSlipstreamPool,
      removedSlipstreamPool,
    ] = await prune(`${cacheDir}/slipstreamV3Pools-${chainId}`, [
      'token0',
      'token1',
    ])
    console.log(
      `Slipstream, Valid: ${validSlipstreamPools} Invalid: ${invalidSlipstreamPool} Duplicate: ${duplicateSlipstreamPool} Removed: ${removedSlipstreamPool} (${percentage(
        removedSlipstreamPool,
        validSlipstreamPools,
      )}%) Remaining: ${
        validSlipstreamPools - removedSlipstreamPool
      } (${percentage(
        validSlipstreamPools - removedSlipstreamPool,
        validSlipstreamPools,
      )}%)`,
    )
  } catch (_e) {
    // console.error(e)
  }
})()
