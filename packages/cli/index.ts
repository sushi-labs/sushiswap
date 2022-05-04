import { program } from 'commander'

import log from '@sushiswap/logger'

import { bar } from './actions'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version', 'version')
  .action(({ version }) => {
    log(`printing v${version} chef data`)
  })

program.parse(process.argv)

if (!program.args.length) program.help()
