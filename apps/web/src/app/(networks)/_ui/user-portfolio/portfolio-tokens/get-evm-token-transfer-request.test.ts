import { Amount } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { decodeFunctionData, erc20Abi, isHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { getEvmTokenTransferRequest } from './get-evm-token-transfer-request'

const destination = '0x56d1670070C8f015c5c5ADF717b8B04012d353C2'

describe('getEvmTokenTransferRequest', () => {
  it('builds a native currency transfer', () => {
    const currency = EvmNative.fromChainId(EvmChainId.ETHEREUM)
    const amount = new Amount(currency, 123n)

    expect(getEvmTokenTransferRequest({ amount, destination })).toEqual({
      chainId: EvmChainId.ETHEREUM,
      to: destination,
      value: 123n,
    })
  })

  it('builds an ERC-20 transfer', () => {
    const currency = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    })
    const amount = new Amount(currency, 1_000_000n)

    const request = getEvmTokenTransferRequest({ amount, destination })

    expect(request.chainId).toBe(EvmChainId.ETHEREUM)
    expect(request.to).toBe(currency.address)
    expect(request.value).toBe(0n)
    if (typeof request.data !== 'string' || !isHex(request.data)) {
      throw new Error('Expected hex-encoded transfer data')
    }
    expect(
      decodeFunctionData({
        abi: erc20Abi,
        data: request.data,
      }),
    ).toEqual({
      functionName: 'transfer',
      args: [destination, 1_000_000n],
    })
  })
})
