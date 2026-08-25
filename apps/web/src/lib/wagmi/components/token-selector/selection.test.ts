import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { type TokenSelectorSelection, isTokenSelectorPair } from './selection'

type EthereumSelection = TokenSelectorSelection<
  typeof EvmChainId.ETHEREUM,
  true
>

const token = new EvmToken({
  address: '0x0000000000000000000000000000000000000001',
  chainId: EvmChainId.ETHEREUM,
  decimals: 18,
  name: 'Token',
  symbol: 'TKN',
})

describe('token selector selection', () => {
  it('narrows an atomic pair selection', () => {
    const selection: EthereumSelection = [token, token]

    expect(isTokenSelectorPair(selection)).toBe(true)
  })

  it('requires pair-enabled consumers to handle pair selections', () => {
    const tokenOnlyHandler = (
      _selection: CurrencyFor<typeof EvmChainId.ETHEREUM>,
    ) => undefined

    // @ts-expect-error A pair-enabled handler cannot accept only one currency.
    const pairEnabledHandler: (selection: EthereumSelection) => void =
      tokenOnlyHandler

    expect(pairEnabledHandler).toBe(tokenOnlyHandler)
  })
})
