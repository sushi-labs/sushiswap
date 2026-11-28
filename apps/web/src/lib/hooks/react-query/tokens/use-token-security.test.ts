import type { TokenSecurityResponse } from 'src/lib/token-security'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { SvmChainId, SvmToken, svmAddress } from 'sushi/svm'
import { afterEach, expect, it, vi } from 'vitest'
import { useTokenSecurity } from './use-token-security'

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock:
    vi.fn<
      (options: { queryFn: () => Promise<TokenSecurityResponse> }) => void
    >(),
}))

vi.mock('@tanstack/react-query', () => ({ useQuery: useQueryMock }))

const currency = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  decimals: 18,
  symbol: 'SUSHI',
  name: 'Sushi',
})

afterEach(() => {
  useQueryMock.mockClear()
  vi.unstubAllGlobals()
})

function scanWith(
  goPlus: Response,
  deFi: Response,
  token: EvmToken | SvmToken = currency,
) {
  vi.stubGlobal('window', { location: { origin: 'http://localhost' } })
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: URL) =>
      url.hostname === 'api.gopluslabs.io' ? goPlus : deFi,
    ),
  )
  useTokenSecurity({ currency: token })
  return useQueryMock.mock.calls[0][0].queryFn()
}

it('preserves explicit zero tax and reports risks from a partial scan', async () => {
  const report = await scanWith(
    Response.json({
      result: {
        [currency.address.toLowerCase()]: {
          buy_tax: '0.00',
          sell_tax: '',
          cannot_buy: null,
          is_honeypot: '1',
        },
      },
    }),
    Response.json({
      coreIssues: null,
      generalIssues: [
        { scwId: '185', issues: null },
        { scwId: '189', issues: [{}] },
      ],
    }),
  )

  expect(report).toMatchObject({
    isFoT: false,
    isHoneypot: true,
    issueCount: 2,
    rows: [
      { check: 'is_honeypot', goPlus: true, deFi: null, isIssue: true },
      { check: 'transfer_pausable', goPlus: null, deFi: true, isIssue: true },
      { check: 'buy_tax', goPlus: false, deFi: null, isIssue: false },
    ],
  })
})

it('reports De.Fi transfer findings without inferring buy or sell restrictions', async () => {
  const report = await scanWith(
    new Response(null, { status: 503 }),
    Response.json({
      coreIssues: [
        { scwId: '209', issues: [{}] },
        { scwId: '211', issues: [{}, {}] },
      ],
      generalIssues: [{ scwId: '209', issues: [] }],
    }),
  )

  expect(report.isFoT).toBe(true)
  expect(report.rows).toMatchObject([
    { check: 'transfer_fee', goPlus: null, deFi: true },
    { check: 'transfer_limit', goPlus: null, deFi: true },
  ])
})

it.each([
  ['0', false],
  ['1000', true],
])(
  'uses Solana’s current transfer fee and reported authorities with a cap of %s',
  async (maximum_fee, hasFee) => {
    const token = new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo'),
      decimals: 6,
      symbol: 'PYUSD',
      name: 'PayPal USD',
    })
    const report = await scanWith(
      Response.json({
        result: {
          [token.address]: {
            mintable: { status: '0' },
            freezable: { status: '1' },
            non_transferable: '0',
            trusted_token: 0,
            transfer_fee: {
              current_fee_rate: { fee_rate: '25', maximum_fee },
            },
          },
        },
      }),
      new Response(null, { status: 503 }),
      token,
    )

    expect(report.isFoT).toBe(hasFee)
    expect(report.rows).toHaveLength(4)
    expect(report.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ check: 'is_mintable', goPlus: false }),
        expect.objectContaining({ check: 'freezable', goPlus: true }),
        expect.objectContaining({ check: 'non_transferable', goPlus: false }),
        expect.objectContaining({ check: 'transfer_fee', goPlus: hasFee }),
      ]),
    )
  },
)
