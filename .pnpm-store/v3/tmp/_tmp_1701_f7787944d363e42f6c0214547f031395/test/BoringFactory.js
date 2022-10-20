const { ADDRESS_ZERO, prepare, getApprovalDigest } = require("./utilities")
const { expect } = require("chai")
const { ecsign } = require("ethereumjs-util")

describe("BoringFactory", function () {
    before(async function () {
        await prepare(this, ["BoringFactory", "MockMasterContract"])
        this.contract = await this.BoringFactory.deploy()
        await this.contract.deployed()
        this.master = await this.MockMasterContract.deploy()
        await this.master.deployed()
    })

    it("Can create clone", async function () {
        let initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(this.master.address, initData, false)).to.emit(this.contract, "LogDeploy")
    })

    it("Can create a second clone", async function () {
        let initData = await this.master.getInitData(12345)
        await expect(this.contract.deploy(this.master.address, initData, false)).to.emit(this.contract, "LogDeploy")
    })

    it("Can create the same clone twice", async function () {
        initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(this.master.address, initData, false))
    })

    it("Can create clone with CREATE2", async function () {
        let initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(this.master.address, initData, true)).to.emit(this.contract, "LogDeploy")
    })

    it("Can create another clone with the same masterContract using CREATE2", async function () {
        let initData = await this.master.getInitData(12345)
        await expect(this.contract.deploy(this.master.address, initData, true))
    })

    it("Cannot create the same clone twice", async function () {
        initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(this.master.address, initData, true)).to.be.revertedWith(
            "Transaction reverted: function call to a non-contract account"
        )
    })

    it("Reverts on masterContract address 0", async function () {
        let initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(ADDRESS_ZERO, initData, false)).to.revertedWith("BoringFactory: No masterContract")
    })

    it("Reverts on masterContract address 0 with CREATE2", async function () {
        let initData = await this.master.getInitData(1234)
        await expect(this.contract.deploy(ADDRESS_ZERO, initData, true)).to.revertedWith("BoringFactory: No masterContract")
    })

    it("Reverts on masterContract with wrong data", async function () {
        await expect(this.contract.deploy(this.master.address, "0x", true)).to.revertedWith("Transaction reverted without a reason")
    })
})
