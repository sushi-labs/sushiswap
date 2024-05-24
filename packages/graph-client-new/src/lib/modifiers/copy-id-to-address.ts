type ReturnType<T extends { id: string; address?: never }> = T & {
  address: `0x${string}`
}

export function copyIdToAddress<T extends { id: string; address?: never }>(
  object: T,
): ReturnType<T> {
  Object.defineProperty(object, 'address', {
    value: object.id,
  })
  return object as ReturnType<T>
}
