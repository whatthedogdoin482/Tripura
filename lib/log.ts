type LogLevel = 'info' | 'warn' | 'error'

/**
 * Strukturiertes Logging für API-Routen.
 * Gibt JSON-Zeilen aus, die sich später leicht an einen Log-Dienst weiterleiten lassen.
 */
function log(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...meta,
  }
  const line = JSON.stringify(entry)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

export const logger = {
  info: (scope: string, message: string, meta?: Record<string, unknown>) => log('info', scope, message, meta),
  warn: (scope: string, message: string, meta?: Record<string, unknown>) => log('warn', scope, message, meta),
  error: (scope: string, message: string, meta?: Record<string, unknown>) => log('error', scope, message, meta),
}
