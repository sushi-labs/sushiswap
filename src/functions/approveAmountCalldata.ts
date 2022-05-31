import { Interface } from '@ethersproject/abi'
import { BigintIsh, Currency, CurrencyAmount, JSBI } from '@sushiswap/core-sdk'

export function toHex(bigintIsh: BigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh)
  let hex = bigInt.toString(16)
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`
  }
  return `0x${hex}`
}

const ERC20_INTERFACE = new Interface([
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
])

export default function approveAmountCalldata(
  amount: CurrencyAmount<Currency>,
  spender: string
): { to: string; data: string; value: '0x0' } {
  if (!amount.currency.isToken) throw new Error('Must call with an amount of token')
  const approveData = ERC20_INTERFACE.encodeFunctionData('approve', [spender, toHex(amount.quotient)])
  return {
    to: amount.currency.address,
    data: approveData,
    value: '0x0',
  }
}
