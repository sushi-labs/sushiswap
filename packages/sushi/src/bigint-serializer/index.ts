declare global {
  interface BigInt {
    toJSON: () => { __type: 'bigint'; value: string }
  }
}

if (!BigInt.prototype.toJSON) {
  Object.defineProperty(BigInt.prototype, 'toJSON', {
    get() {
      return () => ({
        __type: 'bigint',
        value: this.toString(),
      })
    },
  })
}

const parse = JSON.parse
JSON.parse = (text: string, reviver?: (key: any, value: any) => any) => {
  return parse.bind(this)(text, (key, value_) => {
    let value = value_
    if (value?.__type === 'bigint') {
      value = BigInt(value.value)
    }
    if (reviver) {
      return reviver(key, value)
    }
    return value
  })
}

export {}
