const { prepare, getBigNumber, createSLP } = require('./utilities')
const { expect } = require("chai")

describe('YieldTokenFactory', function () {
  before(async function () {
    await prepare(this, ['SushiToken', 'RevertingERC20Mock', 'UniswapV2Factory', 'UniswapV2Pair', 'MasterChef', 'YieldTokenFactory', 'SushiYieldToken'])
  })

  beforeEach(async function () {
    this.sushi = await this.SushiToken.deploy()
    this.sushi.mint(this.alice.address, getBigNumber('10000000'))
    this.weth = await this.RevertingERC20Mock.deploy('WETH', 'ETH', getBigNumber('10000000'))
    this.factory = await this.UniswapV2Factory.deploy(ethers.constants.AddressZero)
    this.chef = await this.MasterChef.deploy(this.sushi.address, this.dev.address, '1000', '0', '1000')
    await this.sushi.transferOwnership(this.chef.address)

    this.contract = await this.YieldTokenFactory.deploy(this.chef.address)
    await createSLP(this, 'lpToken', this.sushi, this.weth, getBigNumber(10))
    await this.chef.add(100, this.lpToken.address, true)
  })

  it('should return correct code hash', async function () {
    expect(await this.contract.yieldTokenCodeHash()).to.equal('0xfa7ddfafe44a5dc8e2ac3bcb710aa4d4a39306860a037a436c223daeb1d1a32b')
  });

  it('should create yield token', async function () {
    const tx = await this.contract.createYieldToken(0)
    const receipt = await tx.wait()
    const token = this.SushiYieldToken.attach(receipt.events[0].args.token)
    expect(await token.lpToken()).to.equal(this.lpToken.address)
  });
})
