export const getRpcSubscriptionsUrl = (rpcUrl: string) => {
  const url = new URL(rpcUrl)

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

  return url.toString()
}
