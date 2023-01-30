import { getBigNumber, RPool, RToken, UniV3Pool } from '@sushiswap/tines'
import WETH9 from 'canonical-weth/build/contracts/WETH9.json'
import { expect } from 'chai'
import { BigNumber, Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'

const ZERO = getBigNumber(0)

interface Environment {
  user: Signer
  token0: RToken
  token0Contract: Contract
  token1: RToken
  token1Contract: Contract
  UniV3Factory: Contract
}

async function createEnv(): Promise<Environment> {
  const [user] = await ethers.getSigners()

  const ERC20Factory = await ethers.getContractFactory('ERC20Mock', user)
  const token0Contract = await ERC20Factory.deploy('Token0', 'Token0', getBigNumber(1e9 * 1e18))
  await token0Contract.deployed()
  const token0: RToken = { name: 'Token0', symbol: 'Token0', address: token0Contract.address }

  const token1Contract = await ERC20Factory.deploy('Token1', 'Token1', getBigNumber(1e9 * 1e18))
  await token1Contract.deployed()
  const token1: RToken = { name: 'Token1', symbol: 'Token1', address: token1Contract.address }

  const UniV3FactoryFactory = await ethers.getContractFactory('UniswapV3Factory')
  const UniV3Factory = await UniV3FactoryFactory.deploy()
  await UniV3Factory.deployed()

  const WETH9Factory = await ethers.getContractFactory(WETH9.abi, WETH9.bytecode)
  const WETH9Contract = await WETH9Factory.deploy()
  await WETH9Contract.deployed()

  return {
    user,
    token0,
    token0Contract,
    token1,
    token1Contract,
    UniV3Factory,
  }
}

interface Stake {
  from: number
  to: number
  val: BigNumber
}

async function createPool(env: Environment, fee: number, stakes: Stake[]): Promise<[Contract, RPool]> {
  const pool = await env.UniV3Factory.createPool(env.token0Contract.address, env.token1Contract.address, fee)
  const tinesPool = new UniV3Pool('pool address', env.token0, env.token1, 0.3, ZERO, ZERO, ZERO, getBigNumber(1), 0, [])
  stakes.forEach((_s) => {
    //pool.mint(env.user.getAddress(), s.from, s.to, s.val)
  })
  return [pool, tinesPool]
}

describe('Uni V3', () => {
  let env: Environment

  before(async () => {
    env = await createEnv()
  })

  it('Empty pool', async () => {
    const [, tinesPool] = await createPool(env, 3000, [])

    const res1 = tinesPool.calcOutByIn(100, true)
    expect(res1.out).to.equal(0)

    const res2 = tinesPool.calcOutByIn(100, false)
    expect(res2.out).to.equal(0)
  })
})
