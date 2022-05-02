#!/usr/bin/env ts-node

const { default: log } = require('@sushiswap/logger')

import { program } from 'commander'

import { fetchBar } from '../fetchers/bar'

program.version('0.0.0').description('Sushi CLI')

program
  .command('bar')
  .description('print bar data')
  .action(async () => {
    fetchBar()

    log('Total SUSHI transfered to the bar:')
    log('Total SUSHI entered the bar:')
    log('Total SUSHI exited the bar:')
    log('APY 24h:', '10%')
    log('APY 1w:')
    log('APY 1m:')
    log('APY 1y:')
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
