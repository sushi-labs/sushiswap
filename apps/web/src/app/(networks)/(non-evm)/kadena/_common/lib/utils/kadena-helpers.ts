import { IS_TESTNET } from '~kadena/_common/constants/is-testnet'

export const getChainwebTxnLink = (txnHash: string) => {
  if (IS_TESTNET) {
    return `https://explorer.chainweb.com/testnet/txdetail/${txnHash}`
  } else {
    return `https://explorer.chainweb.com/mainnet/txdetail/${txnHash}`
  }
}
