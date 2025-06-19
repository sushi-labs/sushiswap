import { Pact } from '@kadena/client'

export const buildGetBalanceTx = (
  account: string,
  chainId: number,
  networkId: string,
) => {
  return (
    Pact.builder
      // @ts-expect-error
      .execution(Pact.modules.coin['get-balance'](account))
      .setMeta({ chainId: String(chainId) })
      .setNetworkId(networkId)
      .createTransaction()
  )
}

export const buildGetTokenMetaTx = (
  tokenContract: string,
  chainId: number,
  networkId: string,
) => {
  return Pact.builder
    .execution(`(${tokenContract}.get-meta)`)
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()
}

export const buildGetTokenPrecision = (
  tokenContract: string,
  chainId: number,
  networkId: string,
) => {
  return Pact.builder
    .execution(`(${tokenContract}.precision)`)
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()
}

// biome-ignore lint/suspicious/noControlCharactersInRegex: expected
const isAscii = (str: string) => /^[\x00-\x7F]*$/.test(str)

export const buildGetTokenBalanceTx = (
  account: string,
  tokenContracts: string[],
  chainId: number,
  networkId: string,
) => {
  const cleanedTokenContracts = tokenContracts.filter((i) => isAscii(i))

  let endBracket = ''
  let tokenNames = cleanedTokenContracts
    .filter((i) => isAscii(i))
    .reduce((accum, cumul) => {
      endBracket += ')'
      const name = cumul?.replace('.', '')
      const code = `
      (let
        ((${name}
          (try -1 (${cumul}.get-balance "${account}"))
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
  const perToken = 900
  const buffer = 1.1

  const estimatedGasLimit = Math.ceil(
    (baseGas + perToken * tokenCount) * buffer,
  )

  return Pact.builder
    .execution(tokenNames)
    .setMeta({ chainId: String(chainId), gasLimit: estimatedGasLimit })
    .setNetworkId(networkId)
    .createTransaction()
}
