import chalk from 'chalk'

const warning = (message: any, ...optionalParams: any[]) =>
  console.warn(chalk.yellow(message), chalk.yellow(optionalParams))

export default warning
