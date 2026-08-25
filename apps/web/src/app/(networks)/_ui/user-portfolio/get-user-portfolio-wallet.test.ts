import { ChainId } from 'sushi'
import { describe, expect, it } from 'vitest'
import { getUserPortfolioWallet } from './get-user-portfolio-wallet'

const wallets = {
  evm: 'evm',
  svm: 'svm',
  stellar: 'stellar',
} as const

describe('getUserPortfolioWallet', () => {
  it('prefers the wallet for the selected network', () => {
    expect(getUserPortfolioWallet(wallets, ChainId.ETHEREUM)).toBe('evm')
    expect(getUserPortfolioWallet(wallets, ChainId.SOLANA)).toBe('svm')
    expect(getUserPortfolioWallet(wallets, ChainId.STELLAR)).toBe('stellar')
  })

  it('falls back to Stellar on EVM pages', () => {
    expect(
      getUserPortfolioWallet(
        { evm: undefined, svm: undefined, stellar: 'stellar' },
        ChainId.ETHEREUM,
      ),
    ).toBe('stellar')
  })

  it('falls back to Stellar on Solana pages', () => {
    expect(
      getUserPortfolioWallet(
        { evm: undefined, svm: undefined, stellar: 'stellar' },
        ChainId.SOLANA,
      ),
    ).toBe('stellar')
  })
})
