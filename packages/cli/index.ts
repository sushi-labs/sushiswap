import { program } from 'commander'
import { MAKER_CONFIG } from './config'

import { bar, chef, maker } from './actions'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version>', 'version', '1')
  .option('-a,--all', 'all', false)
  .action(chef)

program.command('maker').description('get maker LPs for all available networks or a specific network')
.option('-n,--network <NETWORK>', 'network available: '.concat(Object.keys(MAKER_CONFIG).join(', ')))
.option('-v,--verbose', 'includes table data')
.action(maker)

program.parse(process.argv)

if (!program.args.length) program.help()
