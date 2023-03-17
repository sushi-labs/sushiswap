import { setStorageAt } from '@nomicfoundation/hardhat-network-helpers'
import { erc20Abi } from '@sushiswap/abi'
import { BigNumber, Contract } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

// Sometimes token contract is a proxy without delegate call
// So, its storage is in other contract and we need to work with it
const TokenProxyMap: Record<string, string> = {
  '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6': '0x4F6296455F8d754c19821cF1EC8FeBF2cD456E67', // Ethereum sBTC
}

const cache: Record<string, number> = {}

export async function setTokenBalance(token: string, user: string, balance: bigint): Promise<boolean> {
  const setStorage = async (slotNumber: number) => {
    const slotData = '0x' + user.padStart(64, '0') + Number(slotNumber).toString(16).padStart(64, '0')
    const slot = keccak256(slotData)
    await setStorageAt(token, slot, balance)
  }

  if (user.startsWith('0x')) user = user.substring(2)
  const realContract = TokenProxyMap[token.toLowerCase()]
  token = realContract || token

  const cashedSlot = cache[token.toLowerCase()]
  if (cashedSlot !== undefined) {
    await setStorage(cashedSlot)
    return true
  }

  const tokenContract = new Contract(token, erc20Abi, ethers.provider)

  const balancePrimary = (await tokenContract.balanceOf(user)) as BigNumber

  for (let i = 0; i < 50; ++i) {
    //   const slotData = '0x' + user.padStart(64, '0') + Number(i).toString(16).padStart(64, '0')
    //   const slot = keccak256(slotData)
    //   await setStorageAt(token, slot, balance)
    await setStorage(i)
    const resBalance = (await tokenContract.balanceOf(user)) as BigNumber
    if (!resBalance.isZero()) {
      if (resBalance.toString() === balance.toString() || !resBalance.eq(balancePrimary)) {
        cache[token.toLowerCase()] = i
        return true
      }
    }
  }
  return false
}
