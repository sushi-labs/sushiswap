import { ChainId } from 'sushi/chain'
import { Logger, LogsMessageLevel } from './Logger.js'

export function warnLog(
  _chain: ChainId | number | undefined,
  msg: string,
  level: LogsMessageLevel = 'warning',
  error?: unknown,
) {
  Logger.msg(msg, level, error)
}

export class LogSender {
  chain?: ChainId | number = undefined

  constructor(chain: ChainId | number) {
    this.chain = chain
  }

  warning(msg: string) {
    warnLog(this.chain, msg)
  }

  error(msg: string) {
    warnLog(this.chain, msg, 'error')
  }
}
