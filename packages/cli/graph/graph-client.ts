import { getBuiltGraphSDK } from '../.graphclient'

export const getBar = async (block?: number) => {
  const sdk = getBuiltGraphSDK()
  return (await sdk.Bar({ block: block ? { number: block } : {} })) ?? {}
}
