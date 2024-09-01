export class LowercaseMap<K extends string, V> extends Map<K, V> {
  override get(key: K): V | undefined {
    return super.get(key.toLowerCase() as K)
  }
  override has(key: K) {
    return super.has(key.toLowerCase() as K)
  }
  override set(key: K, value: V) {
    return super.set(key.toLowerCase() as K, value)
  }
  override delete(key: K) {
    return super.delete(key.toLowerCase() as K)
  }
}
