// import { Chain, WebSocketPublicClient } from '@wagmi/core'
// import {
//   http,
//   Hex,
//   RpcRequestError,
//   createPublicClient,
//   createWalletClient,
//   custom,
//   webSocket,
// } from 'viem'
// import { privateKeyToAccount } from 'viem/accounts'
// import { rpc } from 'viem/utils'
// import { accounts, foundryPolygon, testChains } from './constants'

// export function getPublicClient({
//   chains = testChains,
//   chainId,
// }: { chains?: Chain[]; chainId?: number } = {}) {
//   const chain = chains.find((x) => x.id === chainId) ?? foundryPolygon
//   const url = foundryPolygon.rpcUrls.default.http[0]
//   const publicClient = createPublicClient({
//     chain,
//     transport: http(url),
//     pollingInterval: 1_000,
//   })
//   return Object.assign(publicClient, {
//     chains,
//     toJSON() {
//       return `<PublicClient network={${chain.id}} />`
//     },
//   })
// }

// export function getWebSocketPublicClient({
//   chains = testChains,
//   chainId,
// }: { chains?: Chain[]; chainId?: number } = {}) {
//   const chain = testChains.find((x) => x.id === chainId) ?? foundryPolygon
//   const url = foundryPolygon.rpcUrls.default.http[0]!.replace('http', 'ws')
//   const webSocketPublicClient = createPublicClient({
//     chain,
//     transport: webSocket(url),
//   })
//   return Object.assign(webSocketPublicClient, {
//     chains,
//     toJSON() {
//       return `<WebSocketPublicClient network={${chain.id}} />`
//     },
//   }) as WebSocketPublicClient
// }

// export function getWalletClients() {
//   const publicClient = getPublicClient()
//   publicClient.request = async ({ method, params }: any) => {
//     if (method === 'personal_sign') {
//       method = 'eth_sign'
//       params = [params[1], params[0]]
//     }

//     const url = foundryPolygon.rpcUrls.default.http[0]!
//     const body = {
//       method,
//       params,
//     }
//     const { result, error } = await rpc.http(url, {
//       body,
//     })
//     if (error) {
//       throw new RpcRequestError({
//         body,
//         error,
//         url,
//       })
//     }
//     return result
//   }
//   return accounts.map((x) =>
//     createWalletClient({
//       account: privateKeyToAccount(x.privateKey as Hex).address,
//       chain: publicClient.chain,
//       transport: custom(publicClient),
//     }),
//   )
// }
