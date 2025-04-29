export const kadenaConfig = {
  network: process.env.KADENA_NETWORK || 'mainnet',
  chainId: process.env.KADENA_CHAIN_ID || '1',
  nodeUrl: process.env.KADENA_NODE_URL || 'https://api.chainweb.com',
  gasLimit: process.env.KADENA_GAS_LIMIT || '1000000',
  gasPrice: process.env.KADENA_GAS_PRICE || '0.0000001',
  contractName: process.env.KADENA_CONTRACT_NAME || 'swap',
  contractNamespace: process.env.KADENA_CONTRACT_NAMESPACE || 'free',
} as const

export type KadenaConfig = typeof kadenaConfig
