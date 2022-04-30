#!/usr/bin/env node

const { program } = require('commander')

program.version('0.0.0').description('Sushi CLI')

program
  .command('bar')
  .description('print bar data')
  .action(() => {
    console.log('Total SUSHI transfered to the bar:')
    console.log('Total SUSHI entered the bar:')
    console.log('Total SUSHI exited the bar:')
    console.log('APY 24h:')
    console.log('APY 1w:')
    console.log('APY 1m:')
    console.log('APY 1y:')
  })

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version', 'version', 1)
  .action(({ version }) => {
    console.log(`printing v${version} chef data`)
  })

program.parse(process.argv)

if (!program.args.length) program.help()
