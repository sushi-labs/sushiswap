import { program } from 'commander'

import { bar, chef } from './actions'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program.command('chef').description('print chef data').option('-v,--version <version', 'version').action(chef)

program.parse(process.argv)

if (!program.args.length) program.help()
