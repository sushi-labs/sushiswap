import { IS_TESTNET } from '~stellar/_common/lib/constants'

export const getStellarAddressLink = (address: string) => {
  if (IS_TESTNET) {
    return `https://testnet.stellarchain.io/accounts/${address}`
  } else {
    return `https://stellarchain.io/accounts/${address}`
  }
}

export const getStellarTxnLink = (txnHash: string) => {
  if (IS_TESTNET) {
    return `https://testnet.stellarchain.io/transactions/${txnHash}`
  } else {
    return `https://stellarchain.io/transactions/${txnHash}`
  }
}
