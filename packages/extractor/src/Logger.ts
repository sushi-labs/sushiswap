import { ChainId } from 'sushi'

export type LogsMessageLevel = 'info' | 'warning' | 'error'

// Sentry
export type LogsExternalHandler = (
  message: string,
  level: LogsMessageLevel,
  context?: string,
) => void

class LoggerClass {
  private chainId?: ChainId
  private logsExternalHandler?: LogsExternalHandler

  setChainId(chainId: ChainId) {
    this.chainId = chainId
  }

  setLogsExternalHandler(logsExternalHandler: LogsExternalHandler) {
    this.logsExternalHandler = logsExternalHandler
  }

  info(message: string, error?: unknown) {
    this.msg(message, 'info', error)
  }
  warn(message: string, error?: unknown) {
    this.msg(message, 'warning', error)
  }
  error(message: string, error?: unknown) {
    this.msg(message, 'error', error)
  }
  msg(message: string, level: LogsMessageLevel, error?: unknown) {
    console.warn(`${this._nowDate()}-${this.chainId}: ${message}`)
    if (this.logsExternalHandler) {
      const context = error !== undefined ? `${error}` : undefined
      const details = context?.match(/Details: (.*)/)?.[1]
      const errorStr = context?.match(/^(.*)/)?.[1]?.substring(0, 100)
      const errMsg = [details, errorStr]
        .filter((s) => s !== undefined)
        .join('/')
      this.logsExternalHandler(
        `${this.chainId}: ${message}${errMsg !== '' ? ` (${errMsg})` : ''}`,
        level,
        error !== undefined ? `${error}` : undefined,
      )
      if (errMsg !== '')
        this.logsExternalHandler(
          `${this.chainId}: ${errMsg} (${message})`,
          level,
          error !== undefined ? `${error}` : undefined,
        )
    }
  }

  private _nowDate(): string {
    const d = new Date()
    const year = (d.getFullYear() % 100).toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    const sec = d.getSeconds().toString().padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${min}:${sec}`
  }
}

export const Logger = new LoggerClass()
