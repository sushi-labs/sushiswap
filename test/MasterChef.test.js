const { ethers } = require("hardhat")
const { expect } = require("chai")
const { time } = require("./utilities")

describe("MasterChef", function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.dev = this.signers[3]
    this.minter = this.signers[4]

    this.MasterChef = await ethers.getContractFactory("MasterChef")
    this.SwipeToken = await ethers.getContractFactory("SwipeToken")
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter)
  })

  beforeEach(async function () {
    this.swipe = await this.SwipeToken.deploy()
    await this.swipe.deployed()
  })

  it("should set correct state variables", async function () {
    this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "1000", "0", "1000")
    await this.chef.deployed()

    await this.swipe.transferOwnership(this.chef.address)

    const swipe = await this.chef.swipe()
    const devaddr = await this.chef.devaddr()
    const owner = await this.swipe.owner()

    expect(swipe).to.equal(this.swipe.address)
    expect(devaddr).to.equal(this.dev.address)
    expect(owner).to.equal(this.chef.address)
  })

  it("should allow dev and only dev to update dev", async function () {
    this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "1000", "0", "1000")
    await this.chef.deployed()

    expect(await this.chef.devaddr()).to.equal(this.dev.address)

    await expect(this.chef.connect(this.bob).dev(this.bob.address, { from: this.bob.address })).to.be.revertedWith("dev: wut?")

    await this.chef.connect(this.dev).dev(this.bob.address, { from: this.dev.address })

    expect(await this.chef.devaddr()).to.equal(this.bob.address)

    await this.chef.connect(this.bob).dev(this.alice.address, { from: this.bob.address })

    expect(await this.chef.devaddr()).to.equal(this.alice.address)
  })

  context("With ERC/LP token added to the field", function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000")

      await this.lp.transfer(this.alice.address, "1000")

      await this.lp.transfer(this.bob.address, "1000")

      await this.lp.transfer(this.carol.address, "1000")

      this.lp2 = await this.ERC20Mock.deploy("LPToken2", "LP2", "10000000000")

      await this.lp2.transfer(this.alice.address, "1000")

      await this.lp2.transfer(this.bob.address, "1000")

      await this.lp2.transfer(this.carol.address, "1000")
    })

    it("should allow emergency withdraw", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "100", "1000")
      await this.chef.deployed()

      await this.chef.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.chef.address, "1000", { from: this.bob.address })

      await this.chef.connect(this.bob).deposit(0, "100", { from: this.bob.address })

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("900")

      await this.chef.connect(this.bob).emergencyWithdraw(0, { from: this.bob.address })

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
    })

    it("should give out SWIPEs only after farming time", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "100", "1000")
      await this.chef.deployed()

      await this.swipe.transferOwnership(this.chef.address)

      await this.chef.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.chef.address, "1000", { from: this.bob.address })
      await this.chef.connect(this.bob).deposit(0, "100", { from: this.bob.address })
      await time.advanceBlockTo("89")

      await this.chef.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 90
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("94")

      await this.chef.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 95
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("99")

      await this.chef.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 100
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("100")

      await this.chef.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 101
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("1000")

      await time.advanceBlockTo("104")
      await this.chef.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 105

      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("5000")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("500")
      expect(await this.swipe.totalSupply()).to.equal("5500")
    })

    it("should not distribute SWIPEs if no one deposit", async function () {
      // 100 per block farming rate starting at block 200 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "200", "1000")
      await this.chef.deployed()
      await this.swipe.transferOwnership(this.chef.address)
      await this.chef.add("100", this.lp.address, true)
      await this.lp.connect(this.bob).approve(this.chef.address, "1000", { from: this.bob.address })
      await time.advanceBlockTo("199")
      expect(await this.swipe.totalSupply()).to.equal("0")
      await time.advanceBlockTo("204")
      expect(await this.swipe.totalSupply()).to.equal("0")
      await time.advanceBlockTo("209")
      await this.chef.connect(this.bob).deposit(0, "10", { from: this.bob.address }) // block 210
      expect(await this.swipe.totalSupply()).to.equal("0")
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("0")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("0")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("990")
      await time.advanceBlockTo("219")
      await this.chef.connect(this.bob).withdraw(0, "10", { from: this.bob.address }) // block 220
      expect(await this.swipe.totalSupply()).to.equal("11000")
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("10000")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
    })

    it("should distribute SWIPEs properly for each staker", async function () {
      // 100 per block farming rate starting at block 300 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "300", "1000")
      await this.chef.deployed()
      await this.swipe.transferOwnership(this.chef.address)
      await this.chef.add("100", this.lp.address, true)
      await this.lp.connect(this.alice).approve(this.chef.address, "1000", {
        from: this.alice.address,
      })
      await this.lp.connect(this.bob).approve(this.chef.address, "1000", {
        from: this.bob.address,
      })
      await this.lp.connect(this.carol).approve(this.chef.address, "1000", {
        from: this.carol.address,
      })
      // Alice deposits 10 LPs at block 310
      await time.advanceBlockTo("309")
      await this.chef.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // Bob deposits 20 LPs at block 314
      await time.advanceBlockTo("313")
      await this.chef.connect(this.bob).deposit(0, "20", { from: this.bob.address })
      // Carol deposits 30 LPs at block 318
      await time.advanceBlockTo("317")
      await this.chef.connect(this.carol).deposit(0, "30", { from: this.carol.address })
      // Alice deposits 10 more LPs at block 320. At this point:
      //   Alice should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5666
      //   MasterChef should have the remaining: 10000 - 5666 = 4334
      await time.advanceBlockTo("319")
      await this.chef.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      expect(await this.swipe.totalSupply()).to.equal("11000")
      expect(await this.swipe.balanceOf(this.alice.address)).to.equal("5666")
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("0")
      expect(await this.swipe.balanceOf(this.carol.address)).to.equal("0")
      expect(await this.swipe.balanceOf(this.chef.address)).to.equal("4334")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("1000")
      // Bob withdraws 5 LPs at block 330. At this point:
      //   Bob should have: 4*2/3*1000 + 2*2/6*1000 + 10*2/7*1000 = 6190
      await time.advanceBlockTo("329")
      await this.chef.connect(this.bob).withdraw(0, "5", { from: this.bob.address })
      expect(await this.swipe.totalSupply()).to.equal("22000")
      expect(await this.swipe.balanceOf(this.alice.address)).to.equal("5666")
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("6190")
      expect(await this.swipe.balanceOf(this.carol.address)).to.equal("0")
      expect(await this.swipe.balanceOf(this.chef.address)).to.equal("8144")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("2000")
      // Alice withdraws 20 LPs at block 340.
      // Bob withdraws 15 LPs at block 350.
      // Carol withdraws 30 LPs at block 360.
      await time.advanceBlockTo("339")
      await this.chef.connect(this.alice).withdraw(0, "20", { from: this.alice.address })
      await time.advanceBlockTo("349")
      await this.chef.connect(this.bob).withdraw(0, "15", { from: this.bob.address })
      await time.advanceBlockTo("359")
      await this.chef.connect(this.carol).withdraw(0, "30", { from: this.carol.address })
      expect(await this.swipe.totalSupply()).to.equal("55000")
      expect(await this.swipe.balanceOf(this.dev.address)).to.equal("5000")
      // Alice should have: 5666 + 10*2/7*1000 + 10*2/6.5*1000 = 11600
      expect(await this.swipe.balanceOf(this.alice.address)).to.equal("11600")
      // Bob should have: 6190 + 10*1.5/6.5 * 1000 + 10*1.5/4.5*1000 = 11831
      expect(await this.swipe.balanceOf(this.bob.address)).to.equal("11831")
      // Carol should have: 2*3/6*1000 + 10*3/7*1000 + 10*3/6.5*1000 + 10*3/4.5*1000 + 10*1000 = 26568
      expect(await this.swipe.balanceOf(this.carol.address)).to.equal("26568")
      // All of them should have 1000 LPs back.
      expect(await this.lp.balanceOf(this.alice.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.carol.address)).to.equal("1000")
    })

    it("should give proper SWIPEs allocation to each pool", async function () {
      // 100 per block farming rate starting at block 400 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "400", "1000")
      await this.swipe.transferOwnership(this.chef.address)
      await this.lp.connect(this.alice).approve(this.chef.address, "1000", { from: this.alice.address })
      await this.lp2.connect(this.bob).approve(this.chef.address, "1000", { from: this.bob.address })
      // Add first LP to the pool with allocation 1
      await this.chef.add("10", this.lp.address, true)
      // Alice deposits 10 LPs at block 410
      await time.advanceBlockTo("409")
      await this.chef.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // Add LP2 to the pool with allocation 2 at block 420
      await time.advanceBlockTo("419")
      await this.chef.add("20", this.lp2.address, true)
      // Alice should have 10*1000 pending reward
      expect(await this.chef.pendingSwipe(0, this.alice.address)).to.equal("10000")
      // Bob deposits 10 LP2s at block 425
      await time.advanceBlockTo("424")
      await this.chef.connect(this.bob).deposit(1, "5", { from: this.bob.address })
      // Alice should have 10000 + 5*1/3*1000 = 11666 pending reward
      expect(await this.chef.pendingSwipe(0, this.alice.address)).to.equal("11666")
      await time.advanceBlockTo("430")
      // At block 430. Bob should get 5*2/3*1000 = 3333. Alice should get ~1666 more.
      expect(await this.chef.pendingSwipe(0, this.alice.address)).to.equal("13333")
      expect(await this.chef.pendingSwipe(1, this.bob.address)).to.equal("3333")
    })

    it("should stop giving bonus SWIPEs after the bonus period ends", async function () {
      // 100 per block farming rate starting at block 500 with bonus until block 600
      this.chef = await this.MasterChef.deploy(this.swipe.address, this.dev.address, "100", "500", "600")
      await this.swipe.transferOwnership(this.chef.address)
      await this.lp.connect(this.alice).approve(this.chef.address, "1000", { from: this.alice.address })
      await this.chef.add("1", this.lp.address, true)
      // Alice deposits 10 LPs at block 590
      await time.advanceBlockTo("589")
      await this.chef.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // At block 605, she should have 1000*10 + 100*5 = 10500 pending.
      await time.advanceBlockTo("605")
      expect(await this.chef.pendingSwipe(0, this.alice.address)).to.equal("10500")
      // At block 606, Alice withdraws all pending rewards and should get 10600.
      await this.chef.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.chef.pendingSwipe(0, this.alice.address)).to.equal("0")
      expect(await this.swipe.balanceOf(this.alice.address)).to.equal("10600")
    })
  })
})
