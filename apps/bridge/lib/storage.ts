export default async function storage(key: string) {
  const value = localStorage.getItem(key)
  if (!value) return undefined
  return JSON.parse(value)
}
