const { prepare, getBigNumber, createSLP } = require('./utilities')
const { expect } = require("chai")

describe('SushiYieldToken', function () {
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

    this.yieldTokenFactory = await this.YieldTokenFactory.deploy(this.chef.address)
    await createSLP(this, 'lpToken', this.sushi, this.weth, getBigNumber(10))
    await this.chef.add(100, this.lpToken.address, true)

    const tx = await this.yieldTokenFactory.createYieldToken(0)
    const receipt = await tx.wait()
    this.contract = this.SushiYieldToken.attach(receipt.events[0].args.token)
  })

  it("should have correct name and symbol and decimal", async function () {
    expect(await this.contract.name(), "SUSHI-ETH SushiSwap Yield Token");
    expect(await this.contract.symbol(), "SUSHI-ETH SYD");
    expect(await this.contract.decimals(), 18);
  });

  it("should mint and burn properly", async function () {
    this.lpToken.transfer(this.contract.address, getBigNumber(1))
    await this.contract.mint(this.alice.address)
    expect(await this.contract.balanceOf(this.alice.address), getBigNumber(1))
    expect(await this.lpToken.balanceOf(this.alice.address), getBigNumber(0))

    this.contract.transfer(this.contract.address, getBigNumber(1))
    await this.contract.burn(this.alice.address)
    expect(await this.contract.balanceOf(this.alice.address), getBigNumber(0))
    expect(await this.lpToken.balanceOf(this.alice.address), getBigNumber(1))
  });
})
