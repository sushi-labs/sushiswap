import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { NextResponse } from 'next/server'
import { Contract } from 'ethers'
import { Address, createPublicClient, getContract } from 'viem'
import { config } from '@sushiswap/viem-config'
export interface Token {
  symbol: string
  name: string
  decimals: number
}

const erc20ABI = [
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
  },
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
] as const

const getToken = async (id: string, chainId: ChainId): Promise<Token> => {
  const publicClient = createPublicClient(config[chainId])

  const token = getContract({ address: id as Address, abi: erc20ABI, publicClient })

  const [symbol, name, decimals] = await Promise.all([token.read.symbol(), token.read.name(), token.read.decimals()])

  return { symbol, name, decimals }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chainId = searchParams.get('chainId')

  if (!address || !chainId || !isAddress(address)) {
    return new Response(null, { status: 422 })
  }

  try {
    const data = await getToken(address, parseInt(chainId) as ChainId)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
