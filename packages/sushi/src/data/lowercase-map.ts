export class LowercaseMap<K extends string, V> extends Map {
  override get(key: K): V | undefined {
    return super.get(key.toLowerCase())
  }
  override has(key: K) {
    return super.has(key.toLowerCase())
  }
  override set(key: K, value: V) {
    return super.set(key.toLowerCase(), value)
  }
  override delete(key: K) {
    return super.delete(key.toLowerCase())
  }
}
