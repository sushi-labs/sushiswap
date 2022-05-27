import chalk from 'chalk'

export default (message: any, ...optionalParams: any[]) => console.error(chalk.red(message), chalk.red(optionalParams))
