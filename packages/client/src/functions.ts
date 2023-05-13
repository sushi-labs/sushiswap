export function parseArgs<T>(args?: Partial<T>) {
  if (!args) return ''

  return Object.entries(args)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((acc, [key, value]) => {
      if (value === undefined) return acc

      return `${acc}&${key}=${Array.isArray(value) ? value.join(',') : value}`
    }, '?')
}
