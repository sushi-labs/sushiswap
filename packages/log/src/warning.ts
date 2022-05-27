import chalk from 'chalk'

export default (message: any, ...optionalParams: any[]) =>
  console.warn(chalk.yellow(message), chalk.yellow(optionalParams))
