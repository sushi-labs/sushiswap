import { IS_FUTURENET } from '~stellar/_common/lib/constants'

export const getStellarAddressLink = (address: string): string => {
  if (IS_FUTURENET) {
    return `https://futurenet.steexp.com/account/${address}`
  } else {
    return `https://stellar.expert/explorer/public/account/${address}`
  }
}

export const getStellarContractLink = (contractId: string): string => {
  if (IS_FUTURENET) {
    return `https://futurenet.steexp.com/contract/${contractId}`
  } else {
    return `https://stellar.expert/explorer/public/contract/${contractId}`
  }
}

export const getStellarTxnLink = (txnHash: string): string => {
  if (IS_FUTURENET) {
    return `https://futurenet.steexp.com/tx/${txnHash}`
  } else {
    return `https://stellar.expert/explorer/public/tx/${txnHash}`
  }
}
