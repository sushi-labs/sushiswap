const originalStringify = JSON.stringify
export const stringify = (
  value: any,
  replacer?: any,
  space?: string | number,
) => {
  return originalStringify(
    value,
    function (key: string, value: any) {
      if (typeof value === 'bigint') {
        try {
          if (replacer && !Array.isArray(replacer)) {
            return replacer.call(this, key, value)
          }
        } catch {}

        return {
          __type: 'bigint',
          value: value.toString(),
        }
      }
      if (Array.isArray(replacer)) {
        return replacer.includes(key) ? value : undefined
      }
      if (replacer) {
        return replacer.call(this, key, value)
      }
      return value
    },
    space,
  )
}

const originalParse = JSON.parse
export const parse = (
  text: string,
  reviver?: (this: any, key: string, value: any) => any,
) => {
  return originalParse(text, function (key: string, value: any) {
    if (value && typeof value === 'object' && value.__type === 'bigint') {
      value = BigInt(value.value)
    }
    if (reviver) {
      return reviver.call(this, key, value)
    }
    return value
  })
}

export function installBigintSerializer() {
  JSON.stringify = stringify as typeof JSON.stringify
  JSON.parse = parse as typeof JSON.parse

  return { stringify, parse }
}
