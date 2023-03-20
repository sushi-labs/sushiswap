import { ChainId, chainName } from '@sushiswap/chain'
import { Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import {
  getBuiltGraphSDK,
  MessariPairsQuery,
  MessariPairsQueryVariables,
  Sdk,
} from '../../../.graphclient/index.js'
import { createPools, getNonExistingPools } from '../../etl/pool/load.js'
import { createTokens } from '../../etl/token/load.js'
import { NewestPool, SeedConfiguration } from './index.js'

export class MessariSchema {
  public static async run({
    client,
    config,
    initialRun,
    dryRun,
  }: {
    client: PrismaClient
    config: SeedConfiguration
    initialRun: boolean
    dryRun: boolean
  }): Promise<NewestPool | undefined> {
    try {
      const startTime = performance.now()
      console.log(`${this.logPrefix(config)} - STARTING...`)

      const newestPool = await this.start(client, config, dryRun, initialRun)

      const endTime = performance.now()
      console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds.`)
      return newestPool
    } catch (e) {
      console.error(e)
      await client.$disconnect()
    } finally {
      await client.$disconnect()
    }
  }

  /**
   * NOTE: This should not run as a job the first time. It should be run manually to seed the database, compare the count with subgraph pair count to verify everything is correct.
   * This function handles three different cases:
   * 1. If initialRun is true, it will fetch all pools from the subgraph and insert them into the database. This should only be run once AND not as a job, we do not want multiple initial seedings to run simultaneously.
   * 2. If there are pools in the database, it will fetch 1000 pools from the subgraph, check if they exist in the database, and insert them if they don't. Then save the last created pool timestamp in memory.
   * 3. Continue from the previous state, step 2. There's now a timestamp to compare against, so we can fetch pools from the subgraph that are newer than the timestamp.
   * @param client
   */
  static async start(
    client: PrismaClient,
    config: SeedConfiguration,
    dryRun: boolean,
    initialRun: boolean
  ): Promise<NewestPool | undefined> {
    const { chainId, subgraph, graphHost, newestPool } = config
    const sdk = getBuiltGraphSDK({ chainId, host: graphHost, name: subgraph })

    console.log(
      `${this.logPrefix(config)} - Loading data from chain: ${chainName[chainId]}(${chainId}), ${graphHost}/${subgraph}`
    )
    let totalPairCount = 0
    try {
      if (initialRun) {
        const batchSize = 1000
        const query = {
          first: batchSize,
        }
        let cursor = ''

        do {
          let where = {}
          if (cursor !== '') {
            where = {
              id_gt: cursor,
            }
          }

          const { result } = await this.getPools(sdk, { ...query, where })
          const currentPairCount = result.MESSARI_liquidityPools.length
          if (currentPairCount === batchSize) {
            cursor = result.MESSARI_liquidityPools[currentPairCount - 1]?.id ?? ''
          }
          totalPairCount += currentPairCount
          console.log(
            `${this.logPrefix(config)} - ${chainName[chainId]}(${chainId}), ${graphHost}/${subgraph}` +
              `: Found ${currentPairCount} pools.`
          )

          if (!dryRun) {
            const { tokens, pools } = this.transform(chainId, config, result)
            await Promise.all([createTokens(client, tokens), createPools(client, pools)])
          } else {
            console.log(
              `${this.logPrefix(config)} - ${chainName[chainId]}(${chainId}), ${graphHost}/${subgraph}` +
                `: This IS A DRY RUN, ${currentPairCount} pools would have been created.`
            )
          }
        } while (cursor !== '')
        console.log(
          `${this.logPrefix(config)} - ${chainName[chainId]}(${chainId}),` +
            ` ${graphHost}/${subgraph} COMPLETED, total pairs found: ${totalPairCount}`
        )
      } else {
        const query = newestPool
          ? ({
              first: 1000,
              where: {
                createdTimestamp_gt: newestPool.timestamp,
              },
              orderBy: 'createdTimestamp',
              orderDirection: 'desc',
            } as MessariPairsQueryVariables)
          : ({
              first: 1000,
              orderBy: 'createdTimestamp',
              orderDirection: 'desc',
            } as MessariPairsQueryVariables)
        const { result, newestPool: subgraphNewestPool } = await this.getPools(sdk, query)
        if (!result.MESSARI_liquidityPools.length) {
          console.log(`${this.logPrefix(config)} No new pools found for ${chainId}`)
          return undefined
        }

        const { tokens, pools } = this.transform(chainId, config, result)
        if (!dryRun) {
          await Promise.all([createTokens(client, tokens), createPools(client, pools)])
        } else {
          const nonExistingPools = await getNonExistingPools(client, pools)
          if (nonExistingPools.length) {
            console.log(
              `${this.logPrefix(config)} - DRY RUN, ${nonExistingPools.length}` +
                `does not exist in the database. They will be created if you rerun this without dry run configuration.`
            )
          } else {
            console.log(`${this.logPrefix(config)} - DRY RUN, all pools exist in the database.`)
          }
          return undefined
        }

        return subgraphNewestPool
      }
    } catch (e: any) {
      console.warn({ e })
    }
  }

  static async getPools(sdk: Sdk, query: MessariPairsQueryVariables) {
    const result = await sdk.MessariPairs(query)
    const sorted = result.MESSARI_liquidityPools.sort((a, b) => Number(b.createdTimestamp) - Number(a.createdTimestamp))
    const newestPool = result.MESSARI_liquidityPools.length
      ? ({ address: sorted[0].id, timestamp: Number(sorted[0].createdTimestamp) } as NewestPool)
      : undefined
    return { result, newestPool }
  }

    static transform(
      chainId: ChainId,
      config: SeedConfiguration,
      data: MessariPairsQuery
    ): {
      pools: Prisma.PoolCreateManyInput[]
      tokens: Prisma.TokenCreateManyInput[]
    } {
      const { protocol, version } = config
      const type = config.poolConfiguration?.type
      const swapFee = config.poolConfiguration?.swapFee
      const twapEnabled = config.poolConfiguration?.twapEnabled
      if (!type || !swapFee || !twapEnabled) {
        throw new Error(
          `${this.logPrefix(
            config
          )} - ERROR: Pool type, swap fee and twapEnabled are all required when transforming pools using MessariSchema`
        )
      }

      const tokens: Prisma.TokenCreateManyInput[] = []
      const uniqueTokens: Set<string> = new Set()
      const poolsTransformed = data.MESSARI_liquidityPools.map((pair) => {
        if (!uniqueTokens.has(pair.inputTokens[0].id)) {
          uniqueTokens.add(pair.inputTokens[0].id)
          tokens.push(
            Prisma.validator<Prisma.TokenCreateManyInput>()({
              id: chainId.toString().concat(':').concat(pair.inputTokens[0].id),
              address: pair.inputTokens[0].id,
              chainId,
              name: pair.inputTokens[0].name,
              symbol: pair.inputTokens[0].symbol,
              decimals: Number(pair.inputTokens[0].decimals),
            })
          )
        }
        if (!uniqueTokens.has(pair.inputTokens[1].id)) {
          uniqueTokens.add(pair.inputTokens[1].id)
          tokens.push(
            Prisma.validator<Prisma.TokenCreateManyInput>()({
              id: chainId.toString().concat(':').concat(pair.inputTokens[1].id),
              address: pair.inputTokens[1].id,
              chainId: chainId,
              name: pair.inputTokens[1].name,
              symbol: pair.inputTokens[1].symbol,
              decimals: Number(pair.inputTokens[1].decimals),
            })
          )
        }

        const regex = /([^\w ]|_|-)/g
        const name = pair.inputTokens[0].symbol
          .replace(regex, '')
          .slice(0, 15)
          .concat('-')
          .concat(pair.inputTokens[1].symbol.replace(regex, '').slice(0, 15))
        return Prisma.validator<Prisma.PoolCreateManyInput>()({
          id: chainId.toString().concat(':').concat(pair.id),
          address: pair.id,
          name,
          protocol,
          version,
          type,
          chainId,
          swapFee,
          twapEnabled,
          token0Id: chainId.toString().concat(':').concat(pair.inputTokens[0].id),
          token1Id: chainId.toString().concat(':').concat(pair.inputTokens[1].id),
          liquidityUSD: 0,
        })
      })

      return { pools: poolsTransformed, tokens }
    }
    static logPrefix(config: SeedConfiguration): string {
      return `${config.protocol} ${config.version}`
    }
}