#!/usr/bin/env node

const chalk = require('chalk')

const log = (message, ...optionalParams) => console.log(chalk.blue(message), chalk.green(optionalParams))

const { program } = require('commander')

program.version('0.0.0').description('Sushi CLI')

program
  .command('bar')
  .description('print bar data')
  .action(() => {
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
  .option('-v,--version <version', 'version', 1)
  .action(({ version }) => {
    log(`printing v${version} chef data`)
  })

program.parse(process.argv)

if (!program.args.length) program.help()
