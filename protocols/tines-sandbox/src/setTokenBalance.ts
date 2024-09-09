import path from 'path'
import { fileURLToPath } from 'url'
import {
  getStorageAt as getStorageAtLib,
  setStorageAt as setStorageAtLib,
} from '@nomicfoundation/hardhat-network-helpers'
import { NumberLike } from '@nomicfoundation/hardhat-network-helpers/dist/src/types.js'
import { PermanentCache } from '@sushiswap/extractor'
import { Contract } from 'ethers'
import hre from 'hardhat'
import { EthereumProvider } from 'hardhat/types'
import { erc20Abi_balanceOf } from 'sushi/abi'
import { Address, PublicClient, parseAbi } from 'viem'

const { ethers } = hre

// Sometimes token contract is a proxy without delegate call
// So, its storage is in other contract and we need to work with it
const TokenProxyMap: Record<string, Address> = {
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
  '0x269895a3df4d73b077fc823dd6da1b95f72aaf9b':
    '0x93B6e9FbBd2c32a0DC3C2B943B7C3CBC2fE23730', // Ethereum sKRW (->target->tokenState->balanceOf)
}

// const cache: Record<string, number> = {}

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
  provider?: EthereumProvider,
): Promise<string> {
  if (!provider) return getStorageAtLib(address, index)

  const indexParam = toPaddedRpcQuantity(index, 32)
  const data = await provider.request({
    method: 'eth_getStorageAt',
    params: [address as Address, indexParam as Address, 'latest'],
  })

  return data as string
}

async function setStorageAt(
  address: string,
  index: string,
  value: NumberLike,
  provider?: EthereumProvider,
): Promise<void> {
  if (!provider) return setStorageAtLib(address, index, value)

  const indexParam = toRpcQuantity(index)
  const codeParam = toPaddedRpcQuantity(value, 32)
  await provider.request({
    method: 'hardhat_setStorageAt',
    params: [address as Address, indexParam as Address, codeParam],
  })
}

async function getBalance(
  token: Address,
  user: Address,
  client?: PublicClient,
): Promise<bigint> {
  if (client) {
    return await client.readContract({
      abi: erc20Abi_balanceOf,
      address: token as Address,
      functionName: 'balanceOf',
      args: [user],
    })
  } else {
    const tokenContract = new Contract(
      token,
      erc20Abi_balanceOf,
      ethers.provider,
    )
    return BigInt((await tokenContract.balanceOf(user)).toString())
  }
}

export enum MappingStyle {
  Solidity = 0,
  Vyper = 1,
}

export interface BalanceSlotInfo {
  contract: Address
  balanceSlot: number
  mappingStyle: MappingStyle
}

function getMapSlotNumber(
  user: Address,
  mapSlot: number,
  mappingStyle: MappingStyle,
) {
  const userPadded = user.substring(2).padStart(64, '0')
  const slotPadded = Number(mapSlot).toString(16).padStart(64, '0')
  const slotData =
    mappingStyle === MappingStyle.Solidity
      ? `0x${userPadded}${slotPadded}`
      : `0x${slotPadded}${userPadded}`
  return ethers.utils.keccak256(slotData)
}

async function setBalance(
  slot: BalanceSlotInfo,
  user: Address,
  value: bigint,
  provider?: EthereumProvider,
) {
  const slotNumber = getMapSlotNumber(user, slot.balanceSlot, slot.mappingStyle)
  await setStorageAt(slot.contract, slotNumber, value, provider)
}

const functionsABI = parseAbi([
  'function target() view returns (address)',
  'function tokenState() view returns (address)',
] as const)

async function syntheticsTokenDataBase(
  token: Address,
  client?: PublicClient,
): Promise<Address | undefined> {
  try {
    if (client) {
      const addr1 = await client.readContract({
        address: token,
        abi: functionsABI,
        functionName: 'target',
      })
      const addr2 = await client.readContract({
        address: addr1,
        abi: functionsABI,
        functionName: 'tokenState',
      })
      return addr2
    } else {
      const contr1 = new Contract(token, functionsABI, ethers.provider)
      const addr1 = await contr1.target()
      const contr2 = new Contract(addr1, functionsABI, ethers.provider)
      const addr2 = await contr2.tokenState()
      return addr2
    }
  } catch (_e) {}
}

async function findBalanceSlot(
  token: Address,
  user: Address,
  balance: bigint, // TODO: remove!
  client?: PublicClient,
  provider?: EthereumProvider,
  tokenData?: Address,
): Promise<BalanceSlotInfo | undefined> {
  const dataContract =
    tokenData ??
    TokenProxyMap[token.toLowerCase()] ??
    (await syntheticsTokenDataBase(token, client)) ??
    token
  const balancePrimary = await getBalance(token, user, client)

  const checkSlot = async (
    slotNumber: number,
    mappingStyle: MappingStyle,
  ): Promise<boolean> => {
    const slot = getMapSlotNumber(user, slotNumber, mappingStyle)
    const previousValue = await getStorageAt(dataContract, slot, provider)
    await setStorageAt(dataContract, slot, balancePrimary + 1n, provider)
    const newBalance = await getBalance(token, user, client)
    await setStorageAt(dataContract, slot, previousValue, provider) // revert previous values back
    return newBalance !== balancePrimary
  }

  const tryBalanceOf = async (
    slotNumber: number,
    client?: PublicClient,
  ): Promise<Address | undefined> => {
    const slot = `0x${Number(slotNumber).toString(16).padStart(64, '0')}`
    const val = await getStorageAt(dataContract, slot, provider)
    if (!val.startsWith('0x000000000000000000000000')) return
    const address = `0x${val.substring(26)}` as Address
    if (address.startsWith('0x000000000000')) return // too low value
    try {
      await getBalance(address, address, client)
      /*const tokenContract = new Contract(
        address,
        [
          {
            type: 'function',
            name: 'balance',
            stateMutability: 'view',
            inputs: [
              {
                name: 'account',
                type: 'address',
              },
            ],
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
          },
        ],
        ethers.provider,
      )
      await tokenContract.balance(user)*/
      return address
    } catch (_e) {}
  }

  for (let i = 0; i < 200; ++i) {
    if (await checkSlot(i, MappingStyle.Solidity))
      return {
        contract: dataContract,
        balanceSlot: i,
        mappingStyle: MappingStyle.Solidity,
      }
    if (await checkSlot(i, MappingStyle.Vyper))
      return {
        contract: dataContract,
        balanceSlot: i,
        mappingStyle: MappingStyle.Vyper,
      }

    if (dataContract === token) {
      // try to find an address of implementation contract
      const addr = await tryBalanceOf(i, client)
      if (addr !== undefined) {
        const res = await findBalanceSlot(
          token,
          user,
          balance,
          client,
          provider,
          addr,
        )
        if (res) return res
      }
    }
  }
}

type TokenSlotRecord =
  | [Address]
  | [Address, number, number]
  | [Address, Address, number, number]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cache = new PermanentCache<TokenSlotRecord>(
  true,
  __dirname,
  './setTokenCache',
)
const cachedMap = new Map<Address, BalanceSlotInfo | undefined>()

async function initCache() {
  const records = await cache.getAllRecords()
  records.forEach((r) => {
    if (r.length === 1) cachedMap.set(r[0], undefined)
    else if (r.length === 3)
      cachedMap.set(r[0], {
        contract: r[0],
        balanceSlot: r[1],
        mappingStyle: r[2] as MappingStyle,
      })
    else if (r.length === 4)
      cachedMap.set(r[0], {
        contract: r[1],
        balanceSlot: r[2],
        mappingStyle: r[3] as MappingStyle,
      })
  })
}
initCache()

async function addCacheRecord(
  token: Address,
  slotInfo: BalanceSlotInfo | undefined,
) {
  cachedMap.set(token, slotInfo)
  if (slotInfo === undefined) await cache.add([token])
  else if (token === slotInfo.contract)
    await cache.add([
      token,
      slotInfo.balanceSlot,
      slotInfo.mappingStyle as number,
    ])
  else
    await cache.add([
      token,
      slotInfo.contract,
      slotInfo.balanceSlot,
      slotInfo.mappingStyle as number,
    ])
}

export async function setTokenBalance(
  token: Address,
  user: Address,
  balance: bigint,
  client?: PublicClient,
  provider?: EthereumProvider,
): Promise<boolean> {
  let slotInfo = cachedMap.get(token)
  if (!slotInfo && !cachedMap.has(token)) {
    slotInfo = await findBalanceSlot(token, user, balance, client, provider)
    await addCacheRecord(token, slotInfo)
  }
  if (slotInfo) await setBalance(slotInfo, user, balance, provider)
  return slotInfo !== undefined
}
