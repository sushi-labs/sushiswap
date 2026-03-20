import type { Amount } from 'sushi'
import { EvmChainId, type EvmToken, RED_SNWAPPER_ADDRESS } from 'sushi/evm'
import type { Address } from 'viem/accounts'
import { encodeFunctionData } from 'viem/utils'
import type { UseSimulateContractParameters } from 'wagmi'
import { redSnwapperAbi_snwap } from '../swap/abi'
import { yojimboAbi_enterSushiBar, yojimboAbi_leaveSushiBar } from './abi'

export const YOJIMBO_ADDRESS = '0xf4162050601f09e971194b4e9983f893442523ee'

type PreparedRedSnwapperTx = Pick<
  UseSimulateContractParameters<typeof redSnwapperAbi_snwap, 'snwap'>,
  'chainId' | 'address' | 'abi' | 'functionName' | 'args'
>

const prepareJojimboTx = (
  action: 'enter' | 'leave',
  amountIn: Amount<EvmToken>,
  amountOut: Amount<EvmToken>,
  recipient: Address,
) => {
  return {
    chainId: EvmChainId.ETHEREUM,
    address: RED_SNWAPPER_ADDRESS[EvmChainId.ETHEREUM],
    abi: redSnwapperAbi_snwap,
    functionName: 'snwap',
    args: [
      amountIn.currency.address, // tokenIn
      amountIn.amount, // amountIn
      recipient, // recipient
      amountOut.currency.address, // tokenOut
      amountOut.amount, // amountOutMin
      YOJIMBO_ADDRESS, // executor
      action === 'enter' // executorData
        ? encodeFunctionData({
            abi: yojimboAbi_enterSushiBar,
            functionName: 'enterSushiBar',
            args: [amountIn.amount, recipient],
          })
        : encodeFunctionData({
            abi: yojimboAbi_leaveSushiBar,
            functionName: 'leaveSushiBar',
            args: [amountIn.amount, recipient],
          }),
    ],
  } as const satisfies PreparedRedSnwapperTx
}

export const prepareEnterSushiBarTx = (
  amountIn: Amount<EvmToken>,
  amountOut: Amount<EvmToken>,
  recipient: Address,
) => {
  return prepareJojimboTx('enter', amountIn, amountOut, recipient)
}

export const prepareLeaveSushiBarTx = (
  amountIn: Amount<EvmToken>,
  amountOut: Amount<EvmToken>,
  recipient: Address,
) => {
  return prepareJojimboTx('leave', amountIn, amountOut, recipient)
}
