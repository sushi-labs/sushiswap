import { getStorageAt, setStorageAt } from '@nomicfoundation/hardhat-network-helpers'
import { NumberLike } from '@nomicfoundation/hardhat-network-helpers/dist/src/types'
import { erc20Abi } from '@sushiswap/abi'
import { Address, Client, keccak256 } from 'viem'
import { readContract } from 'viem/actions'

// Sometimes token contract is a proxy without delegate call
// So, its storage is in other contract and we need to work with it
const TokenProxyMap: Record<Address, Address> = {
  '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6': '0x4F6296455F8d754c19821cF1EC8FeBF2cD456E67', // Ethereum sBTC
  '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb': '0x34A5ef81d18F3a305aE9C2d7DF42beef4c79031c', // Ethereum sETH
  '0xd71ecff9342a5ced620049e616c5035f1db98620': '0x6568D9e750fC44AF00f857885Dfb8281c00529c4', // Ethereum sEUR
  '0xbbc455cb4f1b9e4bfc4b73970d360c8f032efee6': '0x577D4a7395c6A5f46d9981a5F83fa7294926aBB0', // Ethereum sLink
  '0x0316eb71485b0ab14103307bf65a021042c6d380': '0xc728693dcf6b257bf88577d6c92e52028426eefd', // Ethereum HBTC
}

const cache: Record<string, number> = {}

export async function setTokenBalance(
  client: Client,
  token: Address,
  user: Address,
  balance: bigint
): Promise<boolean> {
  const setStorage = async (slotNumber: number, value0: NumberLike, value1: NumberLike) => {
    // Solidity mapping
    const slotData = `0x${user.padStart(64, '0')}${Number(slotNumber).toString(16).padStart(64, '0')}` as const
    const slot = keccak256(slotData)
    const previousValue0 = await getStorageAt(token, slot)
    await setStorageAt(token, slot, value0)
    // Vyper mapping
    const slotData2 = `0x${Number(slotNumber).toString(16).padStart(64, '0')}${user.padStart(64, '0')}` as const
    const slot2 = keccak256(slotData2)
    const previousValue1 = await getStorageAt(token, slot)
    await setStorageAt(token, slot2, value1)
    return [previousValue0, previousValue1]
  }

  const realContract = TokenProxyMap[token.toLowerCase() as Address]
  token = realContract || token

  const cachedSlot = cache[token.toLowerCase()]
  if (cachedSlot !== undefined) {
    await setStorage(cachedSlot, balance, balance)
    return true
  }

  const balancePrimary = await readContract(client, {
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [user],
    address: token as Address,
  })

  await Promise.all(
    Array(200).map(async (_, i) => {
      const [previousValue0, previousValue1] = await setStorage(i, balance, balance)
      const resBalance = await readContract(client, {
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
        address: token as Address,
      })
      //console.log(i, '0x' + user.padStart(64, '0') + Number(i).toString(16).padStart(64, '0'), resBalance.toString())

      if (resBalance !== 0n) {
        if (resBalance.toString() === balance.toString() || resBalance !== balancePrimary) {
          cache[token.toLowerCase()] = i
          return true
        }
      }
      await setStorage(i, previousValue0, previousValue1) // revert previous values back
    })
  )
  return false
}
