// Stolen from https://github.com/wevm/wagmi/blob/main/packages/core/src/utils/

/**
 * Get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys: string[], cutoff: number) {
  return keys.slice(0, cutoff).join('.') || '.'
}

/**
 * Faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */
function getCutoff(array: any[], value: any) {
  const { length } = array

  for (let index = 0; index < length; ++index) {
    if (array[index] === value) {
      return index + 1
    }
  }

  return 0
}

type StandardReplacer = (key: string, value: any) => any

/**
 * Create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(
  replacer?: StandardReplacer | null | undefined,
): StandardReplacer {
  const hasReplacer = typeof replacer === 'function'

  const cache: any[] = []
  const keys: string[] = []

  return function replace(this: any, key: string, value: any) {
    if (typeof value === 'object') {
      if (cache.length) {
        const thisCutoff = getCutoff(cache, this)

        if (thisCutoff === 0) {
          cache[cache.length] = this
        } else {
          cache.splice(thisCutoff)
          keys.splice(thisCutoff)
        }

        keys[keys.length] = key

        const valueCutoff = getCutoff(cache, value)

        if (valueCutoff !== 0) {
          return `[ref=${getReferenceKey(keys, valueCutoff)}]`
        }
      } else {
        cache[0] = value
        keys[0] = key
      }
    }

    return hasReplacer ? replacer.call(this, key, value) : value
  }
}

/**
 * Stringifier that handles circular values
 *
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */
export function serialize(
  value: any,
  replacer?: StandardReplacer | (string | number)[] | null | undefined,
  indent?: number | string | null | undefined,
) {
  if (Array.isArray(replacer)) {
    throw new Error('Array replacer is not supported')
  }

  return JSON.stringify(
    value,
    createReplacer((key, value_) => {
      let value = value_
      if (typeof value === 'bigint')
        value = { __type: 'bigint', value: value_.toString() }
      if (value instanceof Map)
        value = { __type: 'Map', value: Array.from(value_.entries()) }
      return replacer?.(key, value) ?? value
    }),
    indent ?? undefined,
  )
}

type Reviver = (key: string, value: any) => any

export function deserialize<type>(value: string, reviver?: Reviver): type {
  return JSON.parse(value, (key, value_) => {
    let value = value_
    if (value?.__type === 'bigint') value = BigInt(value.value)
    if (value?.__type === 'Map') value = new Map(value.value)
    return reviver?.(key, value) ?? value
  })
}
