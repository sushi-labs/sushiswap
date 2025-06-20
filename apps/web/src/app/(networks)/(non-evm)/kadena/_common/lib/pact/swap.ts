import { type IPartialPactCommand, Pact } from '@kadena/client'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import { GAS_LIMIT, GAS_PRICE } from '~kadena/_common/constants/gas'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { formatPactDecimal } from '../utils/formatters'

interface BuildSwapTxnParams {
  token0Address: string
  token1Address: string
  amountIn?: number
  amountOut?: number
  signerAddress: string
  poolAddress: string
  isSimulate: boolean
}

export const buildSwapTxn = ({
  token0Address,
  token1Address,
  amountIn = 0,
  amountOut = 0,
  signerAddress,
  poolAddress,
  isSimulate,
}: BuildSwapTxnParams): IPartialPactCommand => {
  const pubKey = signerAddress.replace(/^k:/, '')

  const pactCmd = `(${KADENA_CONTRACT}.swap-exact-in
      ${formatPactDecimal(amountIn)}
      ${formatPactDecimal(isSimulate ? 0 : amountOut)}
      [${token0Address} ${token1Address}]
      "${signerAddress}"
      "${signerAddress}"
      (read-keyset "ks")
    )`

  return Pact.builder
    .execution(pactCmd)
    .addSigner(pubKey, (signFor) => [
      signFor('coin.GAS'),
      signFor(`${token0Address}.TRANSFER`, `k:${pubKey}`, poolAddress, {
        decimal: formatPactDecimal(amountIn),
      }),
    ])
    .setMeta({
      chainId: String(KADENA_CHAIN_ID),
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      senderAccount: signerAddress,
    })
    .addData('ks', { keys: [pubKey], pred: 'keys-all' })
    .setNetworkId(KADENA_NETWORK_ID)
    .createTransaction()
}
