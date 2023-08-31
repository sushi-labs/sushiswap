import { getStorageAt, setStorageAt } from '@nomicfoundation/hardhat-network-helpers'
import { NumberLike } from '@nomicfoundation/hardhat-network-helpers/dist/src/types'
import { erc20Abi } from '@sushiswap/abi'
import { Address, Client, encodeAbiParameters, keccak256, parseAbiParameters } from 'viem'
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
    const slotData = encodeAbiParameters(parseAbiParameters('address, uint256'), [user, BigInt(slotNumber)] as const)
    const slot = keccak256(slotData)
    const previousValue0 = await getStorageAt(token, slot)
    await setStorageAt(token, slot, value0)
    // Vyper mapping
    const slotData2 = encodeAbiParameters(parseAbiParameters('uint256, address'), [BigInt(slotNumber), user] as const)
    const slot2 = keccak256(slotData2)
    const previousValue1 = await getStorageAt(token, slot2)
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

  const result = await Promise.all(
    Array(200)
      .fill(null)
      .map(async (_, i) => {
        const testVal = BigInt(i + 97382)

        const [previousValue0, previousValue1] = await setStorage(i, testVal, testVal)
        const resBalance = await readContract(client, {
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [user],
          address: token as Address,
        })

        if (resBalance !== 0n) {
          if (resBalance === testVal) {
            await setStorage(i, balance, balance)
            cache[token.toLowerCase()] = i
            return true
          }
        }

        await setStorage(i, previousValue0, previousValue1) // revert previous values back

        return false
      })
  )

  return result.some(Boolean)
}
