import chalk from 'chalk'

const log = (message: any, ...optionalParams: any[]) => console.log(chalk.blue(message), chalk.green(optionalParams))

log.warn = (message: any, ...optionalParams: any[]) => console.warn(chalk.yellow(message), chalk.yellow(optionalParams))

export default log
