const originalStringify = JSON.stringify
JSON.stringify = (value, replacer, space) => {
  return originalStringify(
    value,
    function (key, value) {
      if (typeof value === 'bigint') {
        // Check if the reviver supports BigInt
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
        // If replacer is an array, only include the keys specified in the array
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
JSON.parse = (text, reviver) => {
  return originalParse(text, function (key, value) {
    if (value && typeof value === 'object' && value.__type === 'bigint') {
      value = BigInt(value.value)
    }
    if (reviver) {
      return reviver.call(this, key, value)
    }
    return value
  })
}

export {}
