import { ethers } from "hardhat"
const { BigNumber } = require("ethers")

export const BASE_TEN = 10
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export function encodeParameters(types, values) {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}

export async function prepare(thisObject, contracts) {
  for (let i in contracts) {
    let contract = contracts[i]
    thisObject[contract] = await ethers.getContractFactory(contract)
  }
  thisObject.signers = await ethers.getSigners()
  thisObject.alice = thisObject.signers[0]
  thisObject.bob = thisObject.signers[1]
  thisObject.carol = thisObject.signers[2]
  thisObject.dev = thisObject.signers[3]
  thisObject.alicePrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  thisObject.bobPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  thisObject.carolPrivateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
}

export async function deploy(thisObject, contracts) {
  for (let i in contracts) {
    let contract = contracts[i]
    thisObject[contract[0]] = await contract[1].deploy(...(contract[2] || []))
    await thisObject[contract[0]].deployed()
  }
}

export async function createSLP(thisObject, name, tokenA, tokenB, amount) {
  const createPairTx = await thisObject.factory.createPair(tokenA.address, tokenB.address)

  const _pair = (await createPairTx.wait()).events[0].args.pair

  thisObject[name] = await thisObject.UniswapV2Pair.attach(_pair)

  await tokenA.transfer(thisObject[name].address, amount)
  await tokenB.transfer(thisObject[name].address, amount)

  await thisObject[name].mint(thisObject.alice.address)
}
// Defaults to e18 using amount * 10^18
export function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals))
}

export * from "./time"
