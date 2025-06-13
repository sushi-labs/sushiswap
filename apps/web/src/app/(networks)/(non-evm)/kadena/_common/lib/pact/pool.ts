import { Pact } from '@kadena/client'
import { kadenaClient } from '~kadena/_common/constants/client'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import { formatPactDecimal } from '../utils/formatters'

export const buildGetPoolExists = (
  token0: string,
  token1: string,
  chainId: number,
  networkId: string,
) => {
  const pactCode = `(${KADENA_CONTRACT}.pair-exists ${token0} ${token1})`
  return Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()
}

export const buildGetPoolAddress = (
  token0: string,
  token1: string,
  chainId: number,
  networkId: string,
) => {
  const pactCode = `(${KADENA_CONTRACT}.get-pair ${token0} ${token1})`
  return Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()
}

export const buildAddLiquidityTxn = ({
  token0Address,
  token1Address,
  amountInToken0,
  amountInToken1,
  minAmountInToken0,
  minAmountInToken1,
  poolAddress,
  signerAddress,
  chainId,
  networkId,
}: {
  token0Address: string
  token1Address: string
  amountInToken0: number
  amountInToken1: number
  minAmountInToken0: number
  minAmountInToken1: number
  poolAddress: string | undefined
  signerAddress: string
  chainId: number
  networkId: string
}) => {
  const _poolAddress = poolAddress
  const pubKey = signerAddress.split('k:')[1]
  if (!_poolAddress) {
    const pactCmd = `(${KADENA_CONTRACT}.create-pair ${token0Address} ${token1Address} "")`
    const tx = Pact.builder
      .execution(pactCmd)
      .setMeta({
        chainId: String(chainId),
        gasLimit: 80300,
        gasPrice: 0.0000001,
        senderAccount: signerAddress,
      })
      .addSigner(pubKey, (signFor) => [signFor('coin.GAS')])
      .setNetworkId(networkId)
      .createTransaction()
    return tx
  }
  const tx = Pact.builder
    .execution(
      `(
			${KADENA_CONTRACT}.add-liquidity 
			${token0Address}
			${token1Address} 
			${formatPactDecimal(amountInToken0)}
			${formatPactDecimal(amountInToken1)}
			${formatPactDecimal(minAmountInToken0)} 
			${formatPactDecimal(minAmountInToken1)} 
			"${signerAddress}" 
			"${signerAddress}" 
			(read-keyset "ks"))`,
    )
    .addSigner(pubKey, (signFor) => [
      signFor('coin.GAS'),
      signFor(
        `${token0Address}.TRANSFER`,
        `${signerAddress}`,
        `${poolAddress}`,
        {
          decimal: amountInToken0.toString(),
        },
      ),
      signFor(
        `${token1Address}.TRANSFER`,
        `${signerAddress}`,
        `${poolAddress}`,
        {
          decimal: amountInToken1.toString(),
        },
      ),
    ])
    .addData('ks', {
      keys: [pubKey],
      pred: 'keys-all',
    })
    .setMeta({
      chainId: String(chainId),
      gasLimit: 80300,
      gasPrice: 0.0000001,
      senderAccount: signerAddress,
    })
    .setNetworkId(networkId)
    .createTransaction()
  return tx
}
