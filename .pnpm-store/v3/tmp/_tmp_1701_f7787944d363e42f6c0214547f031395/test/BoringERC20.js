const { expect, assert } = require("chai")
const { ADDRESS_ZERO, getApprovalDigest, getDomainSeparator, prepare } = require("./utilities")
const { ecsign } = require("ethereumjs-util")

describe("BoringERC20", function () {
    before(async function () {
        await prepare(this, ["MockBoringERC20", "MockERC20"])
    })

    beforeEach(async function () {
        this.token = await this.MockERC20.deploy(10000)
        await this.token.deployed()
        this.mock = await this.MockBoringERC20.deploy(this.token.address)
        await this.mock.deployed()
    })

    it("Token address is set", async function () {
        expect(await this.mock.token()).to.equal(this.token.address)
        console.log(this.token.address)
    })

    it("Get the symbol of a token that has no symbol", async function () {
        expect(await this.mock.safeSymbol()).to.equal("???")
    })

    it("Get the name of a token that has no name", async function () {
        expect(await this.mock.safeName()).to.equal("???")
    })

    it("Get the decimals of a token that has no decimals", async function () {
        expect(await this.mock.safeDecimals()).to.equal(18)
    })

    it("Can send tokens with transfer", async function () {
        await expect(this.token.transfer(this.mock.address, 100))
            .to.emit(this.token, "Transfer")
            .withArgs(this.alice.address, this.mock.address, 100)
        await expect(this.mock.safeTransfer(this.bob.address, 100))
            .to.emit(this.token, "Transfer")
            .withArgs(this.mock.address, this.bob.address, 100)
        expect(await this.token.balanceOf(this.bob.address)).to.equal(100)
    })

    it("Can send tokens with transferFrom", async function () {
        await this.token.approve(this.mock.address, 50)
        await expect(this.mock.safeTransferFrom(this.alice.address, this.carol.address, 50))
            .to.emit(this.token, "Transfer")
            .withArgs(this.alice.address, this.carol.address, 50)
        expect(await this.token.balanceOf(this.carol.address)).to.equal(50)
    })

    it("Reverts sending tokens with transfer", async function () {
        await expect(this.mock.safeTransfer(this.bob.address, 100)).to.revertedWith("BoringERC20: Transfer failed")
    })

    it("Reverts sending tokens with transferFrom", async function () {
        await expect(this.mock.safeTransferFrom(this.alice.address, this.carol.address, 50)).to.revertedWith("BoringERC20: TransferFrom failed")
    })
})
