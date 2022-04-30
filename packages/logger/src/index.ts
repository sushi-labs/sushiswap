import chalk from 'chalk'

const log = (message: any, ...optionalParams: any[]) => console.log(chalk.blue(message), chalk.green(optionalParams))

export default log
