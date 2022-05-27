import chalk from 'chalk'
import tenderly from './tenderly'
import warning from './warning'
import error from './error'

const log = (message: any, ...optionalParams: any[]) => console.log(chalk.blue(message), chalk.green(optionalParams))

log.warning = warning

log.tenderly = tenderly

log.error = error

export default log
