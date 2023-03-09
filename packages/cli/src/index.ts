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

import { program } from 'commander'

import { furo } from './actions/furo.js'
import { bar, bentobox, chef, maker, revenues, serve } from './actions/index.js'
import { FURO_SUPPORTED_CHAIN_NAMES, MAKER_SUPPORTED_CHAIN_NAMES, REVENUES_SUPPORTED_CHAIN_NAMES } from './config.js'

program.version('0.0.0').description('Sushi CLI')

program.command('bar').description('print bar data').action(bar)

program.command('bentobox').description('bentobox').action(bentobox)

program
  .command('revenues')
  .description('Get revenues')
  .option('-n,--network <NETWORK>', 'network available: '.concat(REVENUES_SUPPORTED_CHAIN_NAMES.join(', ')))
  .option('-d,--days <Amount of days>', '1 to 30, default set to 1.')
  .action(revenues)

program
  .command('furo')
  .description('Get Furo TVL')
  .option('-n,--network <NETWORK>', 'network available: '.concat(FURO_SUPPORTED_CHAIN_NAMES.join(', ')))
  .action(furo)

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
