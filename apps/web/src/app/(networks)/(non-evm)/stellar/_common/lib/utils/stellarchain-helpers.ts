import type {
  StellarAccountAddress,
  StellarContractAddress,
} from 'sushi/stellar'

export const getStellarAddressLink = (
  address: StellarAccountAddress,
): string => {
  return `https://stellar.expert/explorer/public/account/${address}`
}

export const getStellarContractLink = (
  contractId: StellarContractAddress,
): string => {
  return `https://stellar.expert/explorer/public/contract/${contractId}`
}

export const getStellarTxnLink = (txnHash: string): string => {
  return `https://stellar.expert/explorer/public/tx/${txnHash}`
}
