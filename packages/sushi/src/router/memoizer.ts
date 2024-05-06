import memoize from 'memoize-fs'

export const serialize = (val: any) => {
  const circRefColl: any[] = []
  return JSON.stringify(val, (_name, value) => {
    if (typeof value === 'function') {
      return // ignore arguments and attributes of type function silently
    }
    if (typeof value === 'object' && value !== null) {
      if (circRefColl.indexOf(value) !== -1) {
        // circular reference has been found, discard key
        return
      }
      // store value in collection
      circRefColl.push(value)
    }
    if (typeof value === 'bigint') return `${value.toString()}n`
    return value
  })
}

export const deserialize = (val: string) => {
  return JSON.parse(val, (_key, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1))
    } else return value
  }).data
}

export const memoizer = memoize({
  cachePath: './mem-cache',
  serialize,
  deserialize,
})
