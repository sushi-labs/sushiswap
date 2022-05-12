import { program } from 'commander'

import { bar, chef, maker } from './actions'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version>', 'version', '1')
  .option('-a,--all', 'all', false)
  .action(chef)

program.command('maker').description('print maker data').action(maker)

program.parse(process.argv)

if (!program.args.length) program.help()
