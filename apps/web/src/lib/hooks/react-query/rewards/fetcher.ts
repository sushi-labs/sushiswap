export const merklFetcher = async (url: string) => {
  const res = await fetch(`/api/merkl?url=${encodeURIComponent(url)}`)
  return res.json()
}
