import { type IPartialPactCommand, Pact } from '@kadena/client'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { formatPactDecimal } from '../utils/formatters'

interface BuildSwapTxnParams {
  isSwapIn: boolean
  token0Address: string
  token1Address: string
  amountIn?: number
  amountOut?: number
  signerAddress: string
  poolAddress: string
}

export const buildSwapTxn = ({
  isSwapIn,
  token0Address,
  token1Address,
  amountIn = 0,
  amountOut = 0,
  signerAddress,
  poolAddress,
}: BuildSwapTxnParams): IPartialPactCommand => {
  const pubKey = signerAddress.replace(/^k:/, '')

  const pactCmd = isSwapIn
    ? `(${KADENA_CONTRACT}.swap-exact-in
        ${formatPactDecimal(amountIn)}
        0.0
        [${token0Address} ${token1Address}]
        "${signerAddress}"
        "${signerAddress}"
        (read-keyset "ks")
      )`
    : `(${KADENA_CONTRACT}.swap-exact-out
        ${formatPactDecimal(amountOut)}
        0.0
        [${token0Address} ${token1Address}]
        "${signerAddress}"
        "${signerAddress}"
        (read-keyset "ks")
      )`

  const inputTokenModule = token0Address.includes('.') ? token0Address : `coin`

  return Pact.builder
    .execution(pactCmd)
    .addSigner(pubKey, (signFor) => [
      signFor('coin.GAS'),
      signFor(`${inputTokenModule}.TRANSFER`, `k:${pubKey}`, poolAddress, {
        decimal: formatPactDecimal(amountIn),
      }),
    ])
    .setMeta({
      chainId: String(KADENA_CHAIN_ID),
      gasLimit: 80300,
      gasPrice: 0.0000001,
      senderAccount: signerAddress,
    })
    .addData('ks', { keys: [pubKey], pred: 'keys-all' })
    .setNetworkId(KADENA_NETWORK_ID)
    .createTransaction()
}
