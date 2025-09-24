import { LogLevel, faro } from '@grafana/faro-web-sdk'

const pushLog = faro?.api?.pushLog ? faro.api.pushLog : () => {}
const pushError = faro?.api?.pushError ? faro.api.pushError : () => {}

const unpatchedConsole = faro?.unpatchedConsole
  ? faro.unpatchedConsole
  : console

function serializeContext(
  context: Record<string, string | number> | undefined,
) {
  if (!context) {
    return undefined
  }

  const serialized: Record<string, string> = {}
  Object.entries(context).forEach(([key, value]) => {
    serialized[key] = String(value)
  })
  return serialized
}

export const logger = {
  info: (message: string, context?: Record<string, string | number>) => {
    pushLog([message], {
      level: LogLevel.INFO,
      context: serializeContext(context),
    })
    unpatchedConsole.info(message, context)
  },
  warn: (message: string, context?: Record<string, string | number>) => {
    pushLog([message], {
      level: LogLevel.WARN,
      context: serializeContext(context),
    })
    unpatchedConsole.warn(message, context)
  },
  error: (
    message: string | Error,
    context?: Record<string, string | number>,
  ) => {
    if (message instanceof Error) {
      pushError(message, { context: serializeContext(context) })
    } else {
      pushLog([message], {
        level: LogLevel.ERROR,
        context: serializeContext(context),
      })
    }

    unpatchedConsole.error(message, context)
  },
}
