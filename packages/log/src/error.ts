import chalk from 'chalk'

const error = (message: any, ...optionalParams: any[]) => console.error(chalk.red(message), chalk.red(optionalParams))

export default error
