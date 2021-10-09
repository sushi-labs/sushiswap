import { ethers } from "hardhat";
import { expect } from "chai";
import { encodeParameters, latest, duration, increase } from "./utilities"

describe("Timelock", function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.dev = this.signers[3]
    this.minter = this.signers[4]

    this.SushiToken = await ethers.getContractFactory("SushiToken")
    this.Timelock = await ethers.getContractFactory("Timelock")
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter)
    this.MasterChef = await ethers.getContractFactory("MasterChef")
  })

  beforeEach(async function () {
    this.sushi = await this.SushiToken.deploy()
    this.chef = await this.MasterChef.deploy(this.sushi.address, this.dev.address, "1000", "0", "1000")
    await this.sushi.transferOwnership(this.chef.address)
    const delay = 259200;
    this.timelock = await this.Timelock.deploy(this.alice.address, delay)
  })

  it("should not be able to transfer MasterChef from non owner address to timelock", async function () {
    await expect(
      this.chef.connect(this.bob).transferOwnership(this.timelock.address, {
        from: this.bob.address,
      })
    ).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("should be able to transfer MasterChef to timelock from owner", async function () {
    await expect(
      this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
        from: this.alice.address,
      })
    ).to.emit(this.chef, 'OwnershipTransferred')
  })


  it("should queue transaction", async function () {
    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        (await latest()).add(duration.days(4))
      )
    ).to.emit(this.timelock, 'QueueTransaction')
  })

  it("should fail to execute transaction un-queued transaction", async function () {
    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    await expect(
      this.timelock.connect(this.alice).executeTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        (await latest()).add(duration.days(4))
      )
    ).to.be.revertedWith("Timelock::executeTransaction: Transaction hasn't been queued.")
  })

  it("should fail to execute transaction early", async function () {
    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    const eta = (await latest()).add(duration.days(4))
    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        eta
      )
    ).to.emit(this.timelock, 'QueueTransaction')

    await increase(duration.days(1))

    await expect(
      this.timelock.connect(this.alice).executeTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        eta
      )
    ).to.be.revertedWith("Timelock::executeTransaction: Transaction hasn't surpassed time lock.")
  })

  it("should be able to cancel transaction", async function () {
    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    const eta = (await latest()).add(duration.days(4))
    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        eta
      )
    ).to.emit(this.timelock, 'QueueTransaction')

    await increase(duration.days(1))

    await expect(
      this.timelock.connect(this.alice).cancelTransaction(
        this.chef.address,
        "0",
        "transferOwnership(address)",
        encodeParameters(["address"], [this.bob.address]),
        eta
      )
    ).to.emit(this.timelock, "CancelTransaction")
  })

  it("add farm using timelock", async function () {
    this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000")

    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    const eta = (await latest()).add(duration.days(4))
    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "add(uint256,address,bool)",
        encodeParameters(["uint256", "address", "bool"], ["100", this.lp.address, false]),
        eta
      )
    ).to.emit(this.timelock, 'QueueTransaction')

    await increase(duration.days(4))

    await expect(
      this.timelock.connect(this.alice).executeTransaction(
        this.chef.address,
        "0",
        "add(uint256,address,bool)",
        encodeParameters(["uint256", "address", "bool"], ["100", this.lp.address, false]),
        eta
      )
    ).to.emit(this.timelock, "ExecuteTransaction")

    expect((await this.chef.poolInfo("0")).allocPoint).to.equal("100")
    expect(await this.chef.totalAllocPoint()).to.equal("100")
    expect(await this.chef.poolLength()).to.equal("1")
  })

  it("should fail to add farm using timelock without waiting long enough", async function () {
    this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000")

    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    const eta = (await latest()).add(duration.days(4))
    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "add(uint256,address,bool)",
        encodeParameters(["uint256", "address", "bool"], ["100", this.lp.address, false]),
        eta
      )
    ).to.emit(this.timelock, 'QueueTransaction')

    await increase(duration.days(4))

    await expect(
      this.timelock.connect(this.alice).executeTransaction(
        this.chef.address,
        "0",
        "add(uint256,address,bool)",
        encodeParameters(["uint256", "address", "bool"], ["100", this.lp.address, false]),
        eta
      )
    ).to.emit(this.timelock, "ExecuteTransaction")
  })

  it("set farm alloc points using timelock", async function () {
    this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000")

    await this.chef.add("100", this.lp.address, true)
    this.chef.connect(this.alice).transferOwnership(this.timelock.address, {
      from: this.alice.address,
    })

    expect((await this.chef.poolInfo("0")).allocPoint).to.equal("100")
    expect(await this.chef.totalAllocPoint()).to.equal("100")
    expect(await this.chef.poolLength()).to.equal("1")

    const eta = (await latest()).add(duration.days(4))
    await expect(
      this.timelock.connect(this.alice).queueTransaction(
        this.chef.address,
        "0",
        "set(uint256,uint256,bool)",
        encodeParameters(["uint256", "uint256", "bool"], ["0", "200", false]),
        eta
      )
    ).to.emit(this.timelock, 'QueueTransaction')

    await increase(duration.days(4))

    await expect(
      this.timelock.connect(this.alice).executeTransaction(
        this.chef.address,
        "0",
        "set(uint256,uint256,bool)",
        encodeParameters(["uint256", "uint256", "bool"], ["0", "200", false]),
        eta
      )
    ).to.emit(this.timelock, "ExecuteTransaction")

    expect((await this.chef.poolInfo("0")).allocPoint).to.equal("200")
    expect(await this.chef.totalAllocPoint()).to.equal("200")
    expect(await this.chef.poolLength()).to.equal("1")
  })
})
