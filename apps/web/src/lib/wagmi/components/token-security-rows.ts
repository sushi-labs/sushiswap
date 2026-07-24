interface TokenSecurityValue {
  deFi?: boolean
  goPlus?: boolean
}

interface TokenSecurityRows<Key extends string> {
  rows: { key: Key; isIssue: boolean }[]
  issueCount: number
}

function isKeyOf<Key extends string>(
  record: Record<Key, unknown>,
  key: string,
): key is Key {
  return Object.hasOwn(record, key)
}

function isOptionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || typeof value === 'boolean'
}

function isTokenSecurityValue(value: unknown): value is TokenSecurityValue {
  if (!value || typeof value !== 'object') return false

  return (
    isOptionalBoolean(Reflect.get(value, 'deFi')) &&
    isOptionalBoolean(Reflect.get(value, 'goPlus'))
  )
}

export function getTokenSecurityRows<Key extends string>(
  data: object | undefined,
  isIssueByKey: Record<
    Key,
    (value: TokenSecurityValue[keyof TokenSecurityValue]) => boolean
  >,
): TokenSecurityRows<Key> {
  const issues: Key[] = []
  const nonIssues: Key[] = []

  for (const [key, value] of Object.entries(data || {})) {
    if (!isKeyOf(isIssueByKey, key) || !isTokenSecurityValue(value)) continue

    if (isIssueByKey[key](value.deFi) || isIssueByKey[key](value.goPlus)) {
      issues.push(key)
    } else {
      nonIssues.push(key)
    }
  }

  return {
    rows: [
      ...issues.map((key) => ({ key, isIssue: true })),
      ...nonIssues.map((key) => ({ key, isIssue: false })),
    ],
    issueCount: issues.length,
  }
}
