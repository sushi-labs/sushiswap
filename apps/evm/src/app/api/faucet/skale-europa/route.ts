import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { createConfig, getBalance, sendTransaction } from '@wagmi/core'
import { NextRequest, NextResponse } from 'next/server'
import { ChainId } from 'sushi'
import { Hex, getAddress } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { z } from 'zod'

const MAX_BALANCE_AMOUNT = 100000000000n // 0.0000001
const DISTRIBUTION_AMOUNT = 5000000000000n // 0.000005

const config = createConfig(publicWagmiConfig)
const account = privateKeyToAccount(
  process.env.SKALE_EUROPA_FAUCET_PRIVATE_KEY as Hex,
)

const schema = z.object({
  address: z.string().transform((address) => getAddress(address)),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  try {
    const { address } = schema.parse(params)

    const balance = await getBalance(config, {
      chainId: ChainId.SKALE_EUROPA,
      address,
    })

    if (balance.value > MAX_BALANCE_AMOUNT)
      throw new Error('User balance exceeds limit')

    const tx = await sendTransaction(config, {
      chainId: ChainId.SKALE_EUROPA,
      account,
      to: address,
      value: DISTRIBUTION_AMOUNT,
    })

    return NextResponse.json(tx, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
      },
    })
  } catch (e) {
    return NextResponse.json(e instanceof Error ? e.message : undefined, {
      status: 500,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
      },
    })
  }
}
