import log from '@sushiswap/logger'

import { program } from 'commander'

program.version('0.0.0').description('Sushi CLI')

import { getBuiltGraphSDK } from './.graphclient'

import { subYears, subMonths, getUnixTime } from 'date-fns'

import numeral from 'numeral'

program
  .command('bar')
  .description('print bar data')
  .action(async () => {
    const sdk = await getBuiltGraphSDK()

    const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))
    const threeMonthAgo = getUnixTime(subMonths(new Date(), 3))
    const sixMonthAgo = getUnixTime(subMonths(new Date(), 6))
    const oneYearAgo = getUnixTime(subYears(new Date(), 1))

    const {
      blocks: [oneYearBlock],
    } = await sdk.Blocks({ where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 } })
    const {
      blocks: [oneMonthBlock],
    } = await sdk.Blocks({ where: { timestamp_gt: oneMonthAgo, timestamp_lt: oneMonthAgo + 30000 } })
    const {
      blocks: [threeMonthBlock],
    } = await sdk.Blocks({ where: { timestamp_gt: threeMonthAgo, timestamp_lt: threeMonthAgo + 30000 } })
    const {
      blocks: [sixMonthBlock],
    } = await sdk.Blocks({ where: { timestamp_gt: sixMonthAgo, timestamp_lt: sixMonthAgo + 30000 } })

    const { bar } = await sdk.Bar()

    const { bar: oneYearBar } = await sdk.Bar({ block: { number: Number(oneYearBlock.number) } })

    const { bar: oneMonthBar } = await sdk.Bar({ block: { number: Number(oneMonthBlock.number) } })

    const { bar: threeMonthBar } = await sdk.Bar({ block: { number: Number(threeMonthBlock.number) } })

    const { bar: sixMonthBar } = await sdk.Bar({ block: { number: Number(sixMonthBlock.number) } })

    // Lukas Witpeerd, [02/05/2022 19:23] ((current ratio / ratio 365 days ago) - 1) * 100
    log('APR 1y:', numeral(bar?.ratio / oneYearBar?.ratio - 1).format('0.00%'))
    log('APR 6m:', numeral((bar?.ratio / sixMonthBar?.ratio - 1) * 2).format('0.00%'))
    log('APR 3m:', numeral((bar?.ratio / threeMonthBar?.ratio - 1) * 4).format('0.00%'))
    log('APR 1m:', numeral((bar?.ratio / oneMonthBar?.ratio - 1) * 12).format('0.00%'))

    // log('Total SUSHI transfered to the bar:')
    // log('Total SUSHI entered the bar:', numeral(bar?.sushiStaked).format('0.00 a'))
    // log('Total SUSHI exited the bar:', numeral(bar?.sushiHarvested).format('0.00 a'))
    // log('Total xSUSHI minted:', numeral(bar?.xSushiMinted).format('0.00 a'))
    // log('Total xSUSHI burned:', numeral(bar?.xSushiBurned).format('0.00 a'))
    // log('Total xSUSHI:', numeral(bar?.totalSupply).format('0.00 a'))
  })

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version', 'version')
  .action(({ version }) => {
    log(`printing v${version} chef data`)
  })

program.parse(process.argv)

if (!program.args.length) program.help()
