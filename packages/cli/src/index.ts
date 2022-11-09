// import { program } from 'commander'

// import { bar, chef, maker, serve } from './actions'
// import { MAKER_SUPPORTED_CHAIN_NAMES } from './config'

// program.version('0.0.0').description('Sushi CLI')

// program.command('bar').description('print bar data').action(bar)

// program
//   .command('chef')
//   .description('print chef data')
//   .option('-v,--version <version>', 'version', '1')
//   .option('-a,--all', 'all', false)
//   .action(chef)

// program
//   .command('maker')
//   .description('get maker LPs for all available networks or a specific network')
//   .option('-n,--network <NETWORK>', 'network available: '.concat(Object.keys(MAKER_SUPPORTED_CHAIN_NAMES).join(', ')))
//   .option('-v,--verbose', 'includes table data')
//   .action(maker)

// program
//   .command('serve')
//   .description('serve LPs fees for a specific network')
//   .option('-n,--network <NETWORK>', 'network available: '.concat(Object.keys(MAKER_SUPPORTED_CHAIN_NAMES).join(', ')))
//   .option('-v,--verbose', 'verbose')
//   .action(serve)

// program.parse(process.argv)

// if (!program.args.length) program.help()

import 'isomorphic-unfetch'

import { program } from 'commander'

import { bar, bentobox, chef, maker, revenues, serve } from './actions'
import { MAKER_SUPPORTED_CHAIN_NAMES, REVENUES_SUPPORTED_CHAIN_NAMES } from './config'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program.command('bentobox').description('bentobox').action(bentobox)

program
  .command('revenues')
  .description('Get revenues')
  .option('-n,--network <NETWORK>', 'network available: '.concat(REVENUES_SUPPORTED_CHAIN_NAMES.join(', ')))
  .action(revenues)

program
  .command('chef')
  .description('print chef data')
  .option('-v,--version <version>', 'version', '1')
  .option('-a,--all', 'all', false)
  .action(chef)

program
  .command('maker')
  .description('get maker LPs for all available networks or a specific network')
  .option('-n,--network <NETWORK>', 'network available: '.concat(Object.keys(MAKER_SUPPORTED_CHAIN_NAMES).join(', ')))
  .option('-v,--verbose', 'includes table data')
  .action(maker)

program
  .command('serve')
  .description('serve LPs fees for a specific network')
  .option('-n,--network <NETWORK>', 'network available: '.concat(Object.keys(MAKER_SUPPORTED_CHAIN_NAMES).join(', ')))
  .option('-v,--verbose', 'verbose')
  .action(serve)

program.parse(process.argv)

if (!program.args.length) program.help()
