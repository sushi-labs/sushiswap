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

program.command('maker').description('get LPs in USD across all networks, or specify network to get more detail information')
.option('-n,--network <NETWORK>', 'network')
.action(maker)

program.parse(process.argv)

if (!program.args.length) program.help()
