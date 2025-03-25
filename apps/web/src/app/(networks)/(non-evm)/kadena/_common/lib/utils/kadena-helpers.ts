import { IS_TESTNET } from '~kadena/_common/constants/is-testnet'

export const getChainwebAddressLink = (address: string) => {
  if (IS_TESTNET) {
    return `https://explorer.chainweb.com/testnet/account/${address}`
  } else {
    return `https://explorer.chainweb.com/mainnet/account/${address}`
  }
}

export const getChainwebTxnLink = (txnHash: string) => {
  if (IS_TESTNET) {
    return `https://explorer.chainweb.com/testnet/txDetail/${txnHash}`
  } else {
    return `https://explorer.chainweb.com/mainnet/txDetail/${txnHash}`
  }
}
