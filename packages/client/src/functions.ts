export function parseArgs<T>(args?: Partial<T>) {
  if (!args) return ''
  return Object.entries(args)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((acc, [key, value]) => {
      if (value === undefined || value === null) return acc
      if (Array.isArray(value) && value.length === 0) return acc
      const param = `${key}=${Array.isArray(value) ? value.join(',') : value}`
      if (acc === '?') {
        return `${acc}${param}`
      } else {
        return `${acc}&${param}`
      }
    }, '?')
}

function jsonParse<T>(text: string): T {
  return JSON.parse(text, (_key: string, value: any) => {
    if (value && typeof value === 'object' && value.__type === 'bigint') {
      value = BigInt(value.value)
    }
    return value
  })
}

export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  const text = await res.text()

  return jsonParse<T>(text)
}
