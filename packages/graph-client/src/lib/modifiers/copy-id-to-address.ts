type ReturnType<T extends { id: `0x${string}`; address?: never }> = T & {
  address: `0x${string}`
}

export function copyIdToAddress<
  T extends { id: `0x${string}`; address?: never },
>(object: T): ReturnType<T> {
  Object.defineProperty(object, 'address', {
    value: object.id,
    enumerable: true,
  })
  return object as ReturnType<T>
}
