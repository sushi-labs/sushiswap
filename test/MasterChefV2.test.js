const { ethers } = require("hardhat")
const { expect } = require("chai")
const { time, prepare, deploy, getBigNumber } = require("./utilities")
const { advanceBlockTo } = require("./utilities/time")

describe("MasterChefV2", function () {
  before(async function () {
    await prepare(this, ['MasterChef', 'SushiToken', 'ERC20Mock', 'MasterChefV2'])
    await deploy(this, [
        ["sushi", this.SushiToken], 
    ])
    await deploy(this, 
        [["lp", this.ERC20Mock, ["LP Token", "LPT", getBigNumber(10)]], 
        ["dummy", this.ERC20Mock, ["Dummy", "DummyT", getBigNumber(10)]], 
        ['chef', this.MasterChef, [this.sushi.address, this.bob.address, getBigNumber(100), "0", "0"]]
    ])
    await this.dummy.transfer(this.bob.address, getBigNumber(10))
    await this.sushi.transferOwnership(this.chef.address)
    await this.chef.add(100, this.lp.address, true)
    await this.chef.add(100, this.dummy.address, true)
    await this.lp.approve(this.chef.address, getBigNumber(10))
    await this.chef.deposit(0, getBigNumber(10)) 
  })

  beforeEach(async function () {
    await this.dummy.connect(this.bob).transfer(this.alice.address, 100)
    await deploy(this, [
        ['chef2', this.MasterChefV2, [this.chef.address, this.sushi.address, 1]],
        ["rlp", this.ERC20Mock, ["LP", "rLPT", getBigNumber(10)]], 
        ["r", this.ERC20Mock, ["Reward", "RewardT", getBigNumber(100000)]], 
    ])
    await this.dummy.approve(this.chef2.address, getBigNumber(10))
    await this.chef2.init(this.dummy.address)
    await this.rlp.transfer(this.bob.address, getBigNumber(1)) 
  })
  
  describe("Harvest", function () {
    it("should give back the correct amount of SUSHI and reward", async function () {
        await this.r.transfer(this.chef2.address, getBigNumber(100000))
        await this.chef2.add(10, this.rlp.address, this.r.address, getBigNumber(1))
        await this.rlp.approve(this.chef2.address, getBigNumber(10))
        expect(await this.chef2.lpToken(0)).to.be.equal(this.rlp.address)
        let log = await this.chef2.deposit(0, getBigNumber(1), this.alice.address)
        await advanceBlockTo(2000)
        await this.chef2.harvestFromMasterChef()
        let log2 = await this.chef2.harvest(0, this.alice.address)
        let expectedSushi = getBigNumber(100).mul(log2.blockNumber - log.blockNumber).div(2)
        expect(await this.sushi.balanceOf(this.alice.address)).to.be.equal(await this.r.balanceOf(this.alice.address)).to.be.equal(expectedSushi)
    })
  })

  describe("Add", function () {
      it("should add pool with reward token multiplier", async function () {
          await expect(this.chef2.add(10, this.rlp.address, this.r.address, getBigNumber(1)))
          .to.emit(this.chef2, "LogPoolAddition")
          .withArgs(this.rlp.address, 10, this.r.address, getBigNumber(1))
      })
  })

  
})
