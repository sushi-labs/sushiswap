import { type ChainId, Pact } from '@kadena/client'
import type { KvmTokenAddress } from 'sushi/kvm'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'

export const buildGetBalanceTx = (
  account: string,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  return Pact.builder
    .execution(`(coin.get-balance "${account}")`)
    .setMeta({ chainId: chainId })
    .setNetworkId(networkId)
    .createTransaction()
}

export const buildGetTokenPrecision = (
  tokenContract: KvmTokenAddress,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  return Pact.builder
    .execution(`(${tokenContract}.precision)`)
    .setMeta({ chainId: chainId })
    .setNetworkId(networkId)
    .createTransaction()
}

const isAscii = (str: string) => [...str].every((c) => c.charCodeAt(0) <= 127)

export const buildGetTokenBalanceAndPrecisionTx = (
  account: string,
  tokenContracts: KvmTokenAddress[],
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  const cleanedTokenContracts = tokenContracts.filter((i) => isAscii(i))

  let endBracket = ''
  let tokenNames = cleanedTokenContracts.reduce((accum, cumul) => {
    endBracket += ')'
    const name = cumul.replace('.', '')

    const code = `
      (let
        ((${name}
          { "balance": (try 0 (${cumul}.get-balance "${account}"))
          , "precision": (${cumul}.precision) }
      ))`
    accum += code
    return accum
  }, '')

  const objFormat = `{${cleanedTokenContracts
    .map((token) => {
      const name = token.replace('.', '')
      return `"${name}": ${name}`
    })
    .join(',')}}`
  tokenNames = tokenNames + objFormat + endBracket

  const tokenCount = cleanedTokenContracts.length
  const baseGas = 500
  const perToken = 1200 // slightly higher, because we call precision too
  const buffer = 1.15

  const estimatedGasLimit = Math.ceil(
    (baseGas + perToken * tokenCount) * buffer,
  )

  return Pact.builder
    .execution(tokenNames)
    .setMeta({
      chainId,
      gasLimit: estimatedGasLimit,
    })
    .setNetworkId(networkId)
    .createTransaction()
}
