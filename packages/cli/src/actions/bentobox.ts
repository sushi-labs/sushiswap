import { formatNumber } from '@sushiswap/format'
import { deprecated_TokensAndBundleQuery, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { BENTOBOX_SUBGRAPH_NAME, EXCHANGE_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import chalk from 'chalk'
import CliTable3 from 'cli-table3'

// import { EXCHANGE_SUBGRAPH_NAME } from '../config'

interface Arguments {
  network?: keyof typeof BENTOBOX_SUBGRAPH_NAME
  verbose?: boolean
}

const sdk = getBuiltGraphSDK()

export async function bentobox(args: Arguments) {
  const { rebases } = await sdk.RebasesByChainIds({
    first: 5000,
    skip: 0,
    chainIds: Object.keys(BENTOBOX_SUBGRAPH_NAME).map(Number),
  })

  const table = new CliTable3({
    truncate: '...',
    colAligns: ['left', 'left', 'right', 'right'],
    head: ['Network', 'Asset', 'Amount', 'USD'],
    style: { compact: true },
  })

  const tokenPrices = Object.fromEntries(
    await Promise.all(
      Object.entries(EXCHANGE_SUBGRAPH_NAME)
        .filter(([chainId]) => chainId in BENTOBOX_SUBGRAPH_NAME)
        .map(([chainId, subgraphName]) => {
          return getBuiltGraphSDK({
            chainId,
            subgraphName,
            subgraphHost: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
          })
            .deprecated_TokensAndBundle({
              // first: 5000,
              // skip: 0,
              where: {
                id_in: rebases
                  .filter((rebase) => Number(rebase.chainId) === Number(chainId))
                  .map((rebase) => rebase.id),
              },
            })
            .then((data) => {
              // console.log(data)
              return [chainId, data]
            })
        })
    )
  )

  rebases
    .reduce<[number, string | undefined, number, number][]>((previousValue, rebase) => {
      const tokenPrice: deprecated_TokensAndBundleQuery = tokenPrices[rebase.chainId]
      const ethPrice = tokenPrice?.bundle?.ethPrice
      if (!tokenPrice || !tokenPrice?.tokens?.length || !ethPrice) {
        return previousValue
      }
      const token = tokenPrice.tokens.find((token) => token.id.toLowerCase() === rebase.id.toLowerCase())
      return [
        ...previousValue,
        [
          rebase.chainId,
          token?.symbol,
          Number(rebase.elastic) / 10 ** Number(token?.decimals),
          Number(ethPrice) * Number(token?.derivedETH) * (Number(rebase.elastic) / 10 ** Number(token?.decimals)),
        ],
      ]
    }, [])
    .filter((a) => Number(a[3]) > 0)
    // Sort TVL
    .sort((a, b) => {
      return Number(b[3]) - Number(a[3])
    })
    // Top 25
    .slice(0, 25)
    .forEach((a) => table.push([a[0], a[1], formatNumber(a[2]), formatNumber(a[3])]))

  console.log(chalk.red('BentoBox, summary'))

  console.log(table.toString())
}
