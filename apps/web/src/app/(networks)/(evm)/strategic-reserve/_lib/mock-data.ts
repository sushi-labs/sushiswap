import { EvmChainId, type EvmTxHash, SUSHI, USDC } from 'sushi/evm'

// Replace these fixtures with the generated API responses when available.
export const mockReserveHistory = {
  isReconciled: true,
  points: [
    { timestamp: 1788830278, amountRaw: '0', amount: '0' },
    {
      timestamp: 1788830279,
      amountRaw: '9220515781711406012356',
      amount: '9220.515781711406012356',
    },
    {
      timestamp: 1789421735,
      amountRaw: '18364610677393143463252',
      amount: '18364.610677393143463252',
    },
    {
      timestamp: 1789768818,
      amountRaw: '18364610677393143463252',
      amount: '18364.610677393143463252',
    },
  ],
  token: SUSHI[EvmChainId.ETHEREUM],
}

export const mockReserveTransactions = {
  hasNextPage: false,
  token: SUSHI[EvmChainId.ETHEREUM],
  totalCount: 2,
  transactions: [
    {
      transactionHash:
        '0xa923a363621f6243ef62d92114a4715f2e5887098aab5b0bebfb16e6a3482c51' as const satisfies EvmTxHash,
      timestamp: 1789421735,
      round: 2,
      receivedRaw: '9144094895681737450896',
      received: '9144.094895681737450896',
      priceUSD: 0.22215220119569312,
      spent: [
        {
          token: USDC[EvmChainId.ETHEREUM],
          amountUSD: 2031.3808090179998,
          amountRaw: '2033000000',
          amount: '2033',
        },
      ],
    },
    {
      transactionHash:
        '0xb0aa7353a84bf79722e5bc7eff5867d9f7149ee3aa6f1c4a8b5c42795c244702' as const satisfies EvmTxHash,
      timestamp: 1788830279,
      round: 1,
      receivedRaw: '9220515781711406012356',
      received: '9220.515781711406012356',
      priceUSD: 0.24238302245226281,
      spent: [
        {
          token: USDC[EvmChainId.ETHEREUM],
          amountUSD: 2234.8964837399994,
          amountRaw: '2235000000',
          amount: '2235',
        },
      ],
    },
  ],
}
