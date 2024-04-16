import { ChainId } from 'sushi'
import {
  BlockNotFoundError,
  ContractFunctionExecutionError,
  HttpRequestError,
} from 'viem'

export type LogsMessageLevel = 'info' | 'warning' | 'error'
type CainIdExt = ChainId | number | undefined

// Sentry
export type LogsExternalHandler = (
  message: string,
  level: LogsMessageLevel,
  context?: string,
  trace_id?: string,
) => void

class LoggerClass {
  private logsExternalHandler?: LogsExternalHandler

  setLogsExternalHandler(logsExternalHandler: LogsExternalHandler) {
    this.logsExternalHandler = logsExternalHandler
  }

  info(chainId: CainIdExt, message: string, error?: unknown, trim = true) {
    this.msg(chainId, message, 'info', error, trim)
  }
  warn(chainId: CainIdExt, message: string, error?: unknown, trim = true) {
    this.msg(chainId, message, 'warning', error, trim)
  }
  error(chainId: CainIdExt, message: string, error?: unknown, trim = true) {
    this.msg(chainId, message, 'error', error, trim)
  }
  msg(
    chainId: CainIdExt,
    message: string,
    level: LogsMessageLevel,
    error?: unknown,
    trim = true,
  ) {
    console.warn(`${this._nowDate()}-${chainId}: ${message}`)
    if (this.logsExternalHandler) {
      if (error instanceof BlockNotFoundError) {
        this.logsExternalHandler(
          `${chainId}: ${message}`,
          'error',
          this._cutLongMessage(error, trim),
        )
        return
      }
      if (error instanceof HttpRequestError) {
        const errStr = `${error.status} - ${error.shortMessage} (${error.details})`
        const traceId = error.headers?.get('x-drpc-trace-id') ?? undefined
        this.logsExternalHandler(
          `${chainId}: ${errStr} / ${message}`,
          level,
          this._cutLongMessage(error, trim),
          traceId,
        )
        this.logsExternalHandler(
          `${chainId}: ${message} / ${errStr}`,
          level,
          this._cutLongMessage(error, trim),
          traceId,
        )
        return
      }
      if (
        error instanceof ContractFunctionExecutionError &&
        error.details === 'out of gas'
      ) {
        this.logsExternalHandler(
          `${chainId}: ${message} / Out of Gas`,
          'error',
          this._cutLongMessage(error, trim),
        )
        return
      }
      if (error instanceof Error) {
        this.logsExternalHandler(
          `${chainId}: ${message}`,
          'error',
          JSON.stringify(error.stack?.split('\n'), undefined, '  '),
        )
        return
      }
      const context = error !== undefined ? `${error}` : undefined
      const details = context?.match(/Details: (.*)/)?.[1]
      const errorStr = context?.match(/^(.*)/)?.[1]?.substring(0, 100)
      const errMsg = [details, errorStr]
        .filter((s) => s !== undefined)
        .join('/')
      this.logsExternalHandler(
        `${chainId}: ${message}${errMsg !== '' ? ` / ${errMsg}` : ''}`,
        level,
        error !== undefined ? this._cutLongMessage(error, trim) : undefined,
      )
      if (details !== undefined)
        this.logsExternalHandler(
          `${chainId}: ${errMsg} / ${message}`,
          level,
          error !== undefined ? this._cutLongMessage(error, trim) : undefined,
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

  errMessageCache = new Map<any, string>()
  private _cutLongMessage(error: any, cut: boolean): string {
    if (!cut) return `${error}`
    let msg = this.errMessageCache.get(error)
    if (msg) return msg
    const errStr = `${error}`
    msg =
      errStr.length < 1000
        ? errStr
        : `${errStr.substring(0, 500)} *** ${errStr.substring(
            errStr.length - 500,
          )}`
    this.errMessageCache.set(error, msg)
    return msg
  }
}

export const Logger = new LoggerClass()

export function safeSerialize(data: any) {
  return JSON.stringify(
    data,
    (_key, value: any) =>
      typeof value === 'bigint' ? value.toString() : value,
    '  ',
  )
}
