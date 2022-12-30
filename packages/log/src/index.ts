import chalk from 'chalk'

import error from './error'
import tenderly from './tenderly'
import warning from './warning'

const log = (message: any, ...optionalParams: any[]) => console.log(chalk.blue(message), chalk.green(optionalParams))

log.warning = warning

log.tenderly = tenderly

log.error = error

export default log
