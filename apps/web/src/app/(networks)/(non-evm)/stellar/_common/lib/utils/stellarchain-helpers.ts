import { IS_TESTNET } from '~stellar/_common/lib/constants'

export const getStellarAddressLink = (address: string): string => {
  if (IS_TESTNET) {
    return `https://stellar.expert/explorer/testnet/account/${address}`
  } else {
    return `https://stellar.expert/explorer/public/account/${address}`
  }
}

export const getStellarContractLink = (contractId: string): string => {
  if (IS_TESTNET) {
    return `https://stellar.expert/explorer/testnet/contract/${contractId}`
  } else {
    return `https://stellar.expert/explorer/public/contract/${contractId}`
  }
}

export const getStellarAssetLink = (code: string): string => {
  if (IS_TESTNET) {
    return `https://stellar.expert/explorer/testnet/asset/${code}`
  } else {
    return `https://stellar.expert/explorer/public/asset/${code}`
  }
}

export const getStellarTxnLink = (txnHash: string): string => {
  if (IS_TESTNET) {
    return `https://stellar.expert/explorer/testnet/tx/${txnHash}`
  } else {
    return `https://stellar.expert/explorer/public/tx/${txnHash}`
  }
}
