import { kadenaConfig } from './config'
import { getKdaPrice } from './getKdaPrice'
import { getPair } from './getPair'
import { kadenaService } from './service'
import { simulateTransaction } from './simulateTransaction'

export const getKadenaNetworkConfig = () => {
  return {
    network: kadenaConfig.network,
    chainId: kadenaConfig.chainId,
  }
}

export const getKadenaTransactionConfig = () => {
  return {
    gasLimit: kadenaConfig.gasLimit,
    gasPrice: kadenaConfig.gasPrice,
  }
}

export const formatKadenaAddress = (address: string) => {
  return address.replace(/^k:/, '')
}

export const validateKadenaAddress = (address: string): boolean => {
  const formattedAddress = formatKadenaAddress(address)
  return /^[a-zA-Z0-9-_]+$/.test(formattedAddress)
}

export const getKadenaNodeUrl = () => {
  return kadenaConfig.nodeUrl
}

export {
  getKdaPrice,
  getPair,
  kadenaConfig,
  kadenaService,
  simulateTransaction,
}
