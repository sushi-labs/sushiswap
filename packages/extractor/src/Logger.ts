import { ChainId } from 'sushi'

export type LogsMessageLevel = 'info' | 'warning' | 'error'
type CainIdExt = ChainId | number | undefined

// Sentry
export type LogsExternalHandler = (
  message: string,
  level: LogsMessageLevel,
  context?: string,
) => void

class LoggerClass {
  private logsExternalHandler?: LogsExternalHandler

  setLogsExternalHandler(logsExternalHandler: LogsExternalHandler) {
    this.logsExternalHandler = logsExternalHandler
  }

  info(chainId: CainIdExt, message: string, error?: unknown) {
    this.msg(chainId, message, 'info', error)
  }
  warn(chainId: CainIdExt, message: string, error?: unknown) {
    this.msg(chainId, message, 'warning', error)
  }
  error(chainId: CainIdExt, message: string, error?: unknown) {
    this.msg(chainId, message, 'error', error)
  }
  msg(
    chainId: CainIdExt,
    message: string,
    level: LogsMessageLevel,
    error?: unknown,
  ) {
    console.warn(`${this._nowDate()}-${chainId}: ${message}`)
    if (this.logsExternalHandler) {
      const context = error !== undefined ? `${error}` : undefined
      const details = context?.match(/Details: (.*)/)?.[1]
      const errorStr = context?.match(/^(.*)/)?.[1]?.substring(0, 100)
      const errMsg = [details, errorStr]
        .filter((s) => s !== undefined)
        .join('/')
      this.logsExternalHandler(
        `${chainId}: ${message}${errMsg !== '' ? ` (${errMsg})` : ''}`,
        level,
        error !== undefined ? `${error}` : undefined,
      )
      if (errMsg !== '')
        this.logsExternalHandler(
          `${chainId}: ${errMsg} (${message})`,
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
