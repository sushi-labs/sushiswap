#!/usr/bin/env node

const { program } = require('commander')

program
  .version('0.0.0')
  .description('Sushi CLI')
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz')

program.parse(process.argv)

if (!program.args.length) program.help()
