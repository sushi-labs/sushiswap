import { NextRequest } from 'next/server'
import { SVM_USDC, SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import { proxy } from './proxy'

async function request(path: string): Promise<Response> {
  return proxy(new NextRequest(`http://localhost:3000${path}`))
}

describe('swap URL validation', () => {
  it.each([
    'token0=NATIVE&token1=NATIVE&chainId1=42161',
    'token0=0x1234&token1=0x1234&chainId0=8453&chainId1=42161',
    'token0=NATIVE&token1=NATIVE&chainId0=8453&chainId1=1',
    'token0=NATIVE&token1=NATIVE&chainId0=invalid&chainId1=42161',
  ])('preserves equal token parameters across networks: %s', async (search) => {
    const response = await request(`/ethereum/swap?${search}`)
    expect(response.status).toBe(200)
    const rewrite = new URL(response.headers.get('x-middleware-rewrite') ?? '')
    expect(rewrite.pathname).toBe('/1/swap')
    expect(rewrite.searchParams.get('token0')).toBe(
      new URLSearchParams(search).get('token0'),
    )
    expect(rewrite.searchParams.get('token1')).toBe(
      new URLSearchParams(search).get('token1'),
    )
  })

  it.each([
    'token0=NATIVE&token1=NATIVE',
    'token0=0xABCD&token1=0xabcd',
    'token0=NATIVE&token1=NATIVE&chainId0=8453&chainId1=8453',
    'token0=NATIVE&token1=NATIVE&chainId0=8453',
    'token0=NATIVE&token1=NATIVE&chainId0=invalid&chainId1=invalid',
    'token0=NATIVE&token1=NATIVE&chainId0=8453&chainId1=invalid',
  ])(
    'still removes duplicate tokens on the effective same chain: %s',
    async (search) => {
      const response = await request(`/ethereum/swap?${search}&referrer=keep`)
      expect(response.status).toBe(307)
      const redirect = new URL(response.headers.get('location') ?? '')
      expect(redirect.pathname).toBe('/ethereum/swap')
      expect(redirect.searchParams.has('token0')).toBe(false)
      expect(redirect.searchParams.has('token1')).toBe(false)
      expect(redirect.searchParams.get('referrer')).toBe('keep')
    },
  )

  it.each(['solana', 'ethereum'])(
    'preserves distinct Solana address casing on the %s entry route',
    async (network) => {
      const token = SVM_USDC[SvmChainId.SOLANA].address
      const search = new URLSearchParams({
        chainId0: String(SvmChainId.SOLANA),
        chainId1: String(SvmChainId.SOLANA),
        token0: token,
        token1: token.toLowerCase(),
      })
      const response = await request(`/${network}/swap?${search}`)
      expect(response.status).toBe(200)
      expect(response.headers.has('location')).toBe(false)
    },
  )

  it('removes exact duplicate Solana addresses', async () => {
    const token = SVM_USDC[SvmChainId.SOLANA].address
    const response = await request(
      `/solana/swap?token0=${token}&token1=${token}`,
    )
    expect(response.status).toBe(307)
  })

  it('keeps the Aptos duplicate-token behavior independent of unified parameters', async () => {
    const response = await request(
      '/aptos/swap?chainId0=1&chainId1=8453&token0=0x1::aptos_coin::AptosCoin&token1=0x1::aptos_coin::aptoscoin',
    )
    expect(response.status).toBe(307)
    const redirect = new URL(response.headers.get('location') ?? '')
    expect(redirect.searchParams.has('token0')).toBe(false)
    expect(redirect.searchParams.has('token1')).toBe(false)
  })

  it('preserves legacy cross-chain-route duplicate-network redirects', async () => {
    const response = await request(
      '/ethereum/cross-chain-swap?chainId1=1&token0=NATIVE&token1=0x1234&referrer=keep',
    )
    expect(response.status).toBe(307)
    const redirect = new URL(response.headers.get('location') ?? '')
    expect(redirect.searchParams.toString()).toBe('referrer=keep')
  })
})
