import { getBigNumber, RToken, UniV3Pool } from '@sushiswap/tines'
import { expect } from 'chai'
import { ethers } from 'hardhat'

const ZERO = getBigNumber(0)

describe('Uni V3', () => {
  it('Empty pool', async () => {
    const ERC20Factory = await ethers.getContractFactory('ERC20Mock')
    const Token0Contract = await ERC20Factory.deploy('Token0', 'Token0', getBigNumber(1e9 * 1e18))
    await Token0Contract.deployed()
    const Token0: RToken = { name: 'Token0', symbol: 'Token0', address: Token0Contract.address }

    const Token1Contract = await ERC20Factory.deploy('Token1', 'Token1', getBigNumber(1e9 * 1e18))
    await Token1Contract.deployed()
    const Token1: RToken = { name: 'Token1', symbol: 'Token1', address: Token1Contract.address }

    const UniV3FactoryFactory = await ethers.getContractFactory('UniswapV3Factory')
    const UniV3Factory = await UniV3FactoryFactory.deploy()
    await UniV3Factory.deployed()

    await UniV3Factory.createPool(Token0Contract.address, Token1Contract.address, 3000 /*0.3%*/)
    const tinesPool = new UniV3Pool('pool address', Token0, Token1, 0.3, ZERO, ZERO, ZERO, getBigNumber(1), 0, [])

    const res1 = tinesPool.calcOutByIn(100, true)
    expect(res1.out).to.equal(0)

    const res2 = tinesPool.calcOutByIn(100, false)
    expect(res2.out).to.equal(0)
  })
})
