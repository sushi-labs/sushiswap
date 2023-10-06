import '../lib/wagmi.js'

import { isAddress } from '@ethersproject/address'
import { chainIds, chains } from 'sushi/chain'
import { createClient } from '@sushiswap/database'
import { Address, fetchToken } from '@wagmi/core'

class Token {
  id: string
  chainId: number
  address: string
  status: 'APPROVED' | 'DISAPPROVED' | 'UNKNOWN' | undefined
  isFeeOnTransfer: boolean | undefined
  isCommon: boolean | undefined
  constructor(
    chainId: number,
    address: string,
    status: 'APPROVED' | 'DISAPPROVED' | 'UNKNOWN' = undefined,
    isFeeOnTransfer: boolean = undefined,
    isCommon: boolean = undefined
  ) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`)
    }
    if (!chains[chainId]) {
      throw new Error(`Invalid chainId, ${chainId}, valid chains are ${chainIds.join(', ')}`)
    }
    this.id = `${chainId}:${address.toLowerCase()}`
    this.chainId = chainId
    this.status = status
    this.address = address.toLowerCase()
    this.isFeeOnTransfer = isFeeOnTransfer
    this.isCommon = isCommon
  }
}

export async function main() {
  const client = await createClient()
  // const token = new Token(56288, '0x4a2c2838c3907D024916c3f4Fe07832745Ae4bec', 'APPROVED')
  const token = new Token(1234, '0x', 'DISAPPROVED')
  try {
    const foundToken = await client.token.findFirst({
      where: {
        id: token.id,
      },
    })
    if (foundToken) {
      let data = {}
      if (token.status) {
        data = { status: token.status }
      }
      if (token.isFeeOnTransfer !== undefined) {
        data = { ...data, isFeeOnTransfer: token.isFeeOnTransfer }
      }
      if (token.isCommon !== undefined) {
        data = { ...data, isCommon: token.isCommon }
      }
      if (Object.keys(data).length === 0) {
        console.log(`Token ${token.id} exist and no data was provided to update.`)
      }
      const updatedToken = await client.token.update({
        where: {
          id: token.id,
        },
        data,
      })
      console.log(`Token updated, new data:  
        ID: ${updatedToken.id} 
        CHAINID: ${updatedToken.chainId}
        ADDRESS: ${updatedToken.address}
        NAME: ${updatedToken.name}
        SYMBOL: ${updatedToken.symbol} 
        DECIMALS: ${updatedToken.decimals}
        STATUS: ${updatedToken.status}
        FOT: ${updatedToken.isFeeOnTransfer}
        COMMON: ${updatedToken.isCommon}
        `)
    } else {
      const tokenFromContract = await fetchTokenFromContract(token)
      const newToken = await client.token.create({
        data: {
          id: token.id,
          chainId: token.chainId,
          ...tokenFromContract,
          status: token.status,
          isFeeOnTransfer: token.isFeeOnTransfer,
          isCommon: token.isCommon,
        },
      })
      console.log(`Token was not found in the database, the token was fetched from the contract and then created:  
      ID: ${newToken.id} 
      CHAINID: ${newToken.chainId} 
      ADDRESS: ${newToken.address}
      NAME: ${newToken.name}
      SYMBOL: ${newToken.symbol} 
      DECIMALS: ${newToken.decimals}
      STATUS: ${newToken.status}
      FOT: ${newToken.isFeeOnTransfer}
      COMMON: ${newToken.isCommon}
      `)
    }
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function fetchTokenFromContract(token: Token) {
  const tokenFromContract = await fetchToken({
    chainId: token.chainId,
    address: token.address as Address,
  })
  if (tokenFromContract) {
    return {
      address: tokenFromContract.address,
      name: tokenFromContract.name,
      symbol: tokenFromContract.symbol,
      decimals: tokenFromContract.decimals,
    }
  } else {
    throw new Error(`Not ERC20? ${token.id}`)
  }
}

main()
