import { type ChainId, Pact } from '@kadena/client'
import type { KvmTokenAddress } from 'sushi/kvm'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import { GAS_LIMIT, GAS_PRICE } from '~kadena/_common/constants/gas'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { formatPactDecimal } from './pact-decimal'

export const buildGetPoolExists = (
  token0: KvmTokenAddress,
  token1: KvmTokenAddress,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  const pactCode = `(${KADENA_CONTRACT}.pair-exists ${token0} ${token1})`
  return Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: chainId })
    .setNetworkId(networkId)
    .createTransaction()
}

export const buildGetPoolAddress = (
  token0: KvmTokenAddress,
  token1: KvmTokenAddress,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  const pactCode = `(${KADENA_CONTRACT}.get-pair ${token0} ${token1})`
  return Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: chainId })
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
  chainId = KADENA_CHAIN_ID,
  networkId = KADENA_NETWORK_ID,
}: {
  token0Address: KvmTokenAddress
  token1Address: KvmTokenAddress
  amountInToken0: number
  amountInToken1: number
  minAmountInToken0: number
  minAmountInToken1: number
  poolAddress: string | undefined
  signerAddress: string
  chainId: ChainId
  networkId: string
}) => {
  const _poolAddress = poolAddress
  const pubKey = signerAddress.split('k:')[1]
  if (!_poolAddress) {
    const pactCmd = `(${KADENA_CONTRACT}.create-pair ${token0Address} ${token1Address} "")`
    const tx = Pact.builder
      .execution(pactCmd)
      .setMeta({
        chainId: chainId,
        gasLimit: GAS_LIMIT,
        gasPrice: GAS_PRICE,
        senderAccount: signerAddress,
      })
      .addSigner(pubKey, (signFor) => [
        signFor('coin.GAS'),
        signFor(`${KADENA_CONTRACT}.GOVERNANCE`),
      ])
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
      chainId: chainId,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      senderAccount: signerAddress,
    })
    .setNetworkId(networkId)
    .createTransaction()
  return tx
}

export const buildGetLpBalanceTx = (
  account: string,
  token0Address: KvmTokenAddress,
  token1Address: KvmTokenAddress,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  const pactCmd = `(${KADENA_CONTRACT}-tokens.get-balance "${token0Address}:${token1Address}" "${account}")`
  const tx = Pact.builder
    .execution(pactCmd)
    .setMeta({
      chainId: chainId,
    })
    .setNetworkId(networkId)
    .createTransaction()
  return tx
}

export const buildGetTotalLpSupply = (
  token0Address: KvmTokenAddress,
  token1Address: KvmTokenAddress,
  chainId: ChainId = KADENA_CHAIN_ID,
  networkId: string = KADENA_NETWORK_ID,
) => {
  const pactCmd = `(${KADENA_CONTRACT}-tokens.total-supply "${token0Address}:${token1Address}")`
  const tx = Pact.builder
    .execution(pactCmd)
    .setMeta({
      chainId: chainId,
    })
    .setNetworkId(networkId)
    .createTransaction()
  return tx
}

export const buildRemoveLiquidityTxn = ({
  token0Address,
  token1Address,
  lpToRemove,
  minAmountOutToken0,
  minAmountOutToken1,
  pairAddress,
  signerAddress,
  chainId = KADENA_CHAIN_ID,
  networkId = KADENA_NETWORK_ID,
}: {
  token0Address: KvmTokenAddress
  token1Address: KvmTokenAddress
  lpToRemove: number
  minAmountOutToken0: number
  minAmountOutToken1: number
  pairAddress: string
  signerAddress: string
  chainId: ChainId
  networkId: string
}) => {
  const pubKey = signerAddress.split('k:')[1]
  const tx = Pact.builder
    .execution(
      `(
			${KADENA_CONTRACT}.remove-liquidity 
			${token0Address}
			${token1Address} 
			${formatPactDecimal(lpToRemove)} 
			${formatPactDecimal(minAmountOutToken0)} 
			${formatPactDecimal(minAmountOutToken1)} 
			"${signerAddress}" 
			"${signerAddress}" 
			(read-keyset "ks"))`,
    )
    .addSigner(pubKey, (signFor) => [
      signFor('coin.GAS'),
      signFor(
        `${KADENA_CONTRACT}-tokens.TRANSFER`,
        `${token0Address}:${token1Address}`,
        signerAddress,
        pairAddress,
        {
          decimal: formatPactDecimal(lpToRemove),
        },
      ),
    ])
    .addData('ks', {
      keys: [pubKey],
      pred: 'keys-all',
    })
    .setMeta({
      chainId: chainId,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      senderAccount: signerAddress,
    })
    .setNetworkId(networkId)
    .createTransaction()
  return tx
}
