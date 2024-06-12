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

const originalParse = JSON.parse;
JSON.parse = (text, reviver) => {
  return originalParse(text, function(key, value) {
    if (value && typeof value === 'object' && value.__type === 'bigint') {
      value = BigInt(value.value);
    }
    if (reviver) {
      return reviver.call(this, key, value);
    }
    return value;
  });
};

export {}
