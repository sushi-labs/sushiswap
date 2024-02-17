import {
  getStorageAt as getStorageAtLib,
  setStorageAt as setStorageAtLib,
} from '@nomicfoundation/hardhat-network-helpers'
import { NumberLike } from '@nomicfoundation/hardhat-network-helpers/dist/src/types'
import { BigNumber, Contract } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { erc20Abi } from 'sushi/abi'
import { Address, PublicClient, WalletClient } from 'viem'

// Sometimes token contract is a proxy without delegate call
// So, its storage is in other contract and we need to work with it
const TokenProxyMap: Record<string, string> = {
  '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6':
    '0x4F6296455F8d754c19821cF1EC8FeBF2cD456E67', // Ethereum sBTC
  '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb':
    '0x34A5ef81d18F3a305aE9C2d7DF42beef4c79031c', // Ethereum sETH
  '0xd71ecff9342a5ced620049e616c5035f1db98620':
    '0x6568D9e750fC44AF00f857885Dfb8281c00529c4', // Ethereum sEUR
  '0xbbc455cb4f1b9e4bfc4b73970d360c8f032efee6':
    '0x577D4a7395c6A5f46d9981a5F83fa7294926aBB0', // Ethereum sLink
  '0x0316eb71485b0ab14103307bf65a021042c6d380':
    '0xc728693dcf6b257bf88577d6c92e52028426eefd', // Ethereum HBTC
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51':
    '0x05a9CBe762B36632b3594DA4F082340E0e5343e8', // Ethereum sUSD
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd':
    '0xc42B14e49744538e3C239f8ae48A1Eaaf35e68a0', // Ethereum GUSD
}

const cache: Record<string, number> = {}

function toRpcQuantity(x: NumberLike): string {
  let hex: string
  if (typeof x === 'number' || typeof x === 'bigint') {
    // TODO: check that number is safe
    hex = `0x${x.toString(16)}`
  } else if (typeof x === 'string') {
    if (!x.startsWith('0x')) {
      throw new Error('Only 0x-prefixed hex-encoded strings are accepted')
    }
    hex = x
  } else if ('toHexString' in x) {
    hex = x.toHexString()
  } else if ('toString' in x) {
    hex = x.toString(16)
  } else {
    throw new Error(`${x as any} cannot be converted to an RPC quantity`)
  }

  if (hex === '0x0') return hex

  return hex.startsWith('0x') ? hex.replace(/0x0+/, '0x') : `0x${hex}`
}

function toPaddedRpcQuantity(x: NumberLike, bytesLength: number): string {
  let rpcQuantity = toRpcQuantity(x)

  if (rpcQuantity.length < 2 + 2 * bytesLength) {
    const rpcQuantityWithout0x = rpcQuantity.slice(2)
    rpcQuantity = `0x${rpcQuantityWithout0x.padStart(2 * bytesLength, '0')}`
  }

  return rpcQuantity
}

async function getStorageAt(
  address: string,
  index: string,
  client?: PublicClient,
): Promise<string> {
  if (!client) return getStorageAtLib(address, index)

  const indexParam = toPaddedRpcQuantity(index, 32)
  const data = await client.request({
    method: 'eth_getStorageAt',
    params: [address as Address, indexParam as Address, 'latest'],
  })

  return data as string
}

async function setStorageAt(
  address: string,
  index: string,
  value: NumberLike,
  client?: WalletClient,
): Promise<void> {
  if (!client) return setStorageAtLib(address, index, value)

  const indexParam = toRpcQuantity(index)
  const codeParam = toPaddedRpcQuantity(value, 32)
  await client.request({
    // @ts-ignore
    method: 'hardhat_setStorageAt',
    // @ts-ignore
    params: [address as Address, indexParam as Address, codeParam],
  })
}

export async function setTokenBalance(
  token: string,
  user: string,
  balance: bigint,
  client?: PublicClient & WalletClient,
): Promise<boolean> {
  const setStorage = async (
    realContract: string,
    slotNumber: number,
    value0: NumberLike,
    value1: NumberLike,
  ) => {
    // Solidity mapping
    const slotData = `0x${user.padStart(64, '0')}${Number(slotNumber)
      .toString(16)
      .padStart(64, '0')}`
    const slot = keccak256(slotData)
    const previousValue0 = await getStorageAt(realContract, slot, client)
    await setStorageAt(realContract, slot, value0, client)
    // Vyper mapping
    const slotData2 = `0x${Number(slotNumber)
      .toString(16)
      .padStart(64, '0')}${user.padStart(64, '0')}`
    const slot2 = keccak256(slotData2)
    const previousValue1 = await getStorageAt(realContract, slot2, client)
    await setStorageAt(realContract, slot2, value1, client)
    return [previousValue0, previousValue1]
  }

  if (user.startsWith('0x')) user = user.substring(2)
  const realContract = TokenProxyMap[token.toLowerCase()] ?? token

  const cashedSlot = cache[token.toLowerCase()]
  if (cashedSlot !== undefined) {
    await setStorage(realContract, cashedSlot, balance, balance)
    return true
  }

  const tokenContract = new Contract(token, erc20Abi, ethers.provider)

  const balancePrimary = (await tokenContract.balanceOf(user)) as BigNumber

  for (let i = 0; i < 200; ++i) {
    //console.log('setTokenBalance', token, i)
    const [previousValue0, previousValue1] = await setStorage(
      realContract,
      i,
      balance,
      balance,
    )
    const resBalance = (await tokenContract.balanceOf(user)) as BigNumber
    //console.log(i, '0x' + user.padStart(64, '0') + Number(i).toString(16).padStart(64, '0'), resBalance.toString())

    if (!resBalance.isZero()) {
      if (
        resBalance.toString() === balance.toString() ||
        !resBalance.eq(balancePrimary)
      ) {
        cache[token.toLowerCase()] = i
        return true
      }
    }
    await setStorage(realContract, i, previousValue0, previousValue1) // revert previous values back
  }
  return false
}
